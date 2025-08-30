import type { APIRoute } from 'astro'
import { redis, keys, normalizeTag, getPostById, type Post } from '../../../lib/kv'
export const prerender = false

export const GET: APIRoute = async ({ url }) => {
  const statusParam = url.searchParams.get('status')
  const status = statusParam === 'draft' ? 'draft' : 'published'
  const tag = url.searchParams.get('tag')
  const month = url.searchParams.get('month')
  const q = url.searchParams.get('q')?.toLowerCase() || ''
  const page = Number(url.searchParams.get('page') || '1')
  const limit = Math.min(Number(url.searchParams.get('limit') || '20'), 50)

  const zKey = status === 'published' ? keys.zPublished : keys.zDraft
  let ids = await redis.zrevrange<string[]>(zKey, 0, 499)
  if (tag) {
    const tagIds = await redis.smembers<string>(keys.tag(normalizeTag(tag)))
    ids = ids.filter(id => tagIds.includes(id))
  }
  if (month) {
    const monthIds = await redis.smembers<string>(keys.month(month))
    ids = ids.filter(id => monthIds.includes(id))
  }
  let posts = await Promise.all(ids.map(id => getPostById(id)))
  posts = posts.filter((p): p is Post => p !== null)
  if (q) {
    posts = posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q))
    )
  }
  const total = posts.length
  const start = (page - 1) * limit
  posts = posts.slice(start, start + limit)
  const summaries = posts.map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    tags: p.tags,
    author: p.author,
    headerImage: p.headerImage,
    publishedAt: p.publishedAt,
  }))
  return new Response(JSON.stringify({ page, limit, total, posts: summaries }), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  })
}
