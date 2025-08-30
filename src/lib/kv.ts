import { Redis } from '@upstash/redis'
import { ulid } from 'ulid'

// Upstash client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
})

// Types
export type Author = {
  id: string
  name: string
  email: string
  image?: string
}

export type HeaderImage = {
  url: string
  width?: number
  height?: number
  alt?: string
}

export type Post = {
  v: number
  id: string
  slug: string
  status: 'draft' | 'published'
  title: string
  description: string
  tags: string[]
  author: Author
  headerImage?: HeaderImage
  readingMinutes?: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
  seo?: { title?: string; description?: string; ogImage?: string }
  content: string
}

// Key helpers
export const keys = {
  post: (id: string) => `post:${id}`,
  slug: (slug: string) => `post:slug:${slug}`,
  zPublished: 'zidx:posts:published',
  zDraft: 'zidx:posts:draft',
  tag: (tag: string) => `sidx:tag:${tag}`,
  author: (authorId: string) => `sidx:author:${authorId}`,
  month: (month: string) => `sidx:month:${month}`,
  authorCache: (id: string) => `author:${id}`,
  adminEmails: 's:admins:emails'
}

// Utilities
export function slugify(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function normalizeTag(tag: string): string {
  return slugify(tag)
}

function monthFromDate(date: string): string {
  return date.slice(0, 7) // YYYY-MM
}

async function ensureUniqueSlug(base: string): Promise<string> {
  let slug = base
  let i = 2
  while (await redis.exists(keys.slug(slug))) {
    slug = `${base}-${i++}`
  }
  return slug
}

// Post operations
export async function createPost(input: Omit<Post, 'id' | 'v' | 'createdAt' | 'updatedAt' | 'publishedAt'> & { status?: 'draft' | 'published'; slug?: string }): Promise<Post> {
  const now = new Date()
  const id = ulid()
  const status = input.status ?? 'published'
  const slugBase = slugify(input.slug ?? input.title)
  const slug = await ensureUniqueSlug(slugBase)
  const createdAt = now.toISOString()
  const updatedAt = createdAt
  const publishedAt = status === 'published' ? createdAt : undefined

  const tags = Array.from(new Set((input.tags || []).map(normalizeTag)))

  const post: Post = {
    v: 1,
    id,
    slug,
    status,
    title: input.title,
    description: input.description,
    tags,
    author: input.author,
    headerImage: input.headerImage,
    readingMinutes: input.readingMinutes,
    createdAt,
    updatedAt,
    publishedAt,
    seo: input.seo,
    content: input.content
  }

  const pipeline = redis.multi()
  pipeline.set(keys.post(id), JSON.stringify(post))
  pipeline.set(keys.slug(slug), id)
  const zKey = status === 'published' ? keys.zPublished : keys.zDraft
  const score = status === 'published' ? now.getTime() : now.getTime()
  pipeline.zadd(zKey, { score, member: id })
  tags.forEach(tag => pipeline.sadd(keys.tag(tag), id))
  pipeline.sadd(keys.author(post.author.id), id)
  const monthKey = monthFromDate(status === 'published' ? createdAt : updatedAt)
  pipeline.sadd(keys.month(monthKey), id)
  await pipeline.exec()
  return post
}

export async function getPostById(id: string): Promise<Post | null> {
  const data = await redis.get<string>(keys.post(id))
  return data ? (JSON.parse(data) as Post) : null
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const id = await redis.get<string>(keys.slug(slug))
  if (!id) return null
  return getPostById(id)
}

export async function updatePost(
  id: string,
  input: Partial<Omit<Post, 'id' | 'v' | 'createdAt'>> & { slug?: string }
): Promise<Post> {
  const existing = await getPostById(id)
  if (!existing) throw new Error('Post not found')

  const now = new Date()

  let slug = existing.slug
  if (input.slug && input.slug !== existing.slug) {
    const base = slugify(input.slug)
    slug = await ensureUniqueSlug(base)
  }

  const tags = input.tags
    ? Array.from(new Set(input.tags.map(normalizeTag)))
    : existing.tags

  const status = input.status ?? existing.status

  const updated: Post = {
    ...existing,
    ...input,
    slug,
    tags,
    status,
    headerImage: input.headerImage ?? existing.headerImage,
    seo: input.seo ?? existing.seo,
    updatedAt: now.toISOString(),
  }

  if (status === 'published' && !existing.publishedAt) {
    updated.publishedAt = now.toISOString()
  }

  const pipeline = redis.multi()

  // Update main record
  pipeline.set(keys.post(id), JSON.stringify(updated))

  // Slug resolver
  if (slug !== existing.slug) {
    pipeline.del(keys.slug(existing.slug))
    pipeline.set(keys.slug(slug), id)
  }

  // Status/ZSET maintenance
  if (status !== existing.status) {
    const oldZ = existing.status === 'published' ? keys.zPublished : keys.zDraft
    const newZ = status === 'published' ? keys.zPublished : keys.zDraft
    pipeline.zrem(oldZ, id)
    const score = status === 'published'
      ? new Date(updated.publishedAt ?? now.toISOString()).getTime()
      : now.getTime()
    pipeline.zadd(newZ, { score, member: id })
  } else if (status === 'published' && updated.publishedAt !== existing.publishedAt) {
    const score = new Date(updated.publishedAt ?? now.toISOString()).getTime()
    pipeline.zadd(keys.zPublished, { score, member: id })
  }

  // Tag sets
  if (input.tags) {
    const oldTags = new Set(existing.tags)
    const newTags = new Set(tags)
    for (const t of oldTags) if (!newTags.has(t)) pipeline.srem(keys.tag(t), id)
    for (const t of newTags) if (!oldTags.has(t)) pipeline.sadd(keys.tag(t), id)
  }

  // Author index
  if (input.author && input.author.id !== existing.author.id) {
    pipeline.srem(keys.author(existing.author.id), id)
    pipeline.sadd(keys.author(input.author.id), id)
  }

  // Month index
  const prevMonth = monthFromDate(
    existing.status === 'published'
      ? existing.publishedAt ?? existing.updatedAt
      : existing.updatedAt
  )
  const nextMonth = monthFromDate(
    status === 'published'
      ? updated.publishedAt ?? updated.updatedAt
      : updated.updatedAt
  )
  if (prevMonth !== nextMonth) {
    pipeline.srem(keys.month(prevMonth), id)
    pipeline.sadd(keys.month(nextMonth), id)
  }

  await pipeline.exec()
  return updated
}

export async function deletePost(id: string): Promise<void> {
  const existing = await getPostById(id)
  if (!existing) return

  const pipeline = redis.multi()
  pipeline.del(keys.post(id))
  pipeline.del(keys.slug(existing.slug))
  const zKey = existing.status === 'published' ? keys.zPublished : keys.zDraft
  pipeline.zrem(zKey, id)
  existing.tags.forEach(t => pipeline.srem(keys.tag(t), id))
  pipeline.srem(keys.author(existing.author.id), id)
  const monthKey = monthFromDate(
    existing.status === 'published'
      ? existing.publishedAt ?? existing.updatedAt
      : existing.updatedAt
  )
  pipeline.srem(keys.month(monthKey), id)
  await pipeline.exec()
}
