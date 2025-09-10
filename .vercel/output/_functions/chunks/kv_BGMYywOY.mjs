import { Redis } from '@upstash/redis';
import { ulid } from 'ulid';

const redis = new Redis({
  url: "https://ample-skylark-28559.upstash.io",
  token: "AW-PAAIncDEzNjJkMjlhMmMyYWM0OWVmOWQxYmVmNzYyMDQ5OGY0NnAxMjg1NTk"
});
console.log("Redis config:", {
  url: "https://ample-skylark-28559.upstash.io",
  token: "AW-PAAIncDEzNjJkMjlhMmMyYWM0OWVmOWQxYmVmNzYyMDQ5OGY0NnAxMjg1NTk".substring(0, 10) + "..."
});
const keys = {
  post: (id) => `post:${id}`,
  slug: (slug) => `post:slug:${slug}`,
  zPublished: "zidx:posts:published",
  zDraft: "zidx:posts:draft",
  tag: (tag) => `sidx:tag:${tag}`,
  author: (authorId) => `sidx:author:${authorId}`,
  month: (month) => `sidx:month:${month}`,
  authorCache: (id) => `author:${id}`,
  adminEmails: "s:admins:emails"
};
function slugify(str) {
  return str.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function normalizeTag(tag) {
  return slugify(tag);
}
function monthFromDate(date) {
  return date.slice(0, 7);
}
async function ensureUniqueSlug(base) {
  let slug = base;
  let i = 2;
  while (await redis.exists(keys.slug(slug))) {
    slug = `${base}-${i++}`;
  }
  return slug;
}
async function createPost(input) {
  const now = /* @__PURE__ */ new Date();
  const id = ulid();
  const status = input.status ?? "published";
  const slugBase = slugify(input.slug ?? input.title);
  const slug = await ensureUniqueSlug(slugBase);
  const createdAt = now.toISOString();
  const updatedAt = createdAt;
  const publishedAt = status === "published" ? createdAt : void 0;
  const tags = Array.from(new Set((input.tags || []).map(normalizeTag)));
  const post = {
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
  };
  const pipeline = redis.multi();
  pipeline.set(keys.post(id), JSON.stringify(post));
  pipeline.set(keys.slug(slug), id);
  const zKey = status === "published" ? keys.zPublished : keys.zDraft;
  const score = status === "published" ? now.getTime() : now.getTime();
  pipeline.zadd(zKey, { score, member: id });
  tags.forEach((tag) => pipeline.sadd(keys.tag(tag), id));
  pipeline.sadd(keys.author(post.author.id), id);
  const monthKey = monthFromDate(
    status === "published" ? createdAt : updatedAt
  );
  pipeline.sadd(keys.month(monthKey), id);
  await pipeline.exec();
  return post;
}
async function getPostById(id) {
  const data = await redis.get(keys.post(id));
  if (!data) return null;
  if (typeof data === "object") {
    return data;
  }
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Error parsing post data:", error, "Data:", data);
    return null;
  }
}
async function getPostBySlug(slug) {
  const id = await redis.get(keys.slug(slug));
  if (!id) return null;
  return getPostById(id);
}
async function updatePost(id, input) {
  const existing = await getPostById(id);
  if (!existing) throw new Error("Post not found");
  const now = /* @__PURE__ */ new Date();
  let slug = existing.slug;
  if (input.slug && input.slug !== existing.slug) {
    const base = slugify(input.slug);
    slug = await ensureUniqueSlug(base);
  }
  const tags = input.tags ? Array.from(new Set(input.tags.map(normalizeTag))) : existing.tags;
  const status = input.status ?? existing.status;
  const updated = {
    ...existing,
    ...input,
    slug,
    tags,
    status,
    headerImage: input.headerImage ?? existing.headerImage,
    seo: input.seo ?? existing.seo,
    updatedAt: now.toISOString()
  };
  if (status === "published" && !existing.publishedAt) {
    updated.publishedAt = now.toISOString();
  }
  const pipeline = redis.multi();
  pipeline.set(keys.post(id), JSON.stringify(updated));
  if (slug !== existing.slug) {
    pipeline.del(keys.slug(existing.slug));
    pipeline.set(keys.slug(slug), id);
  }
  if (status !== existing.status) {
    const oldZ = existing.status === "published" ? keys.zPublished : keys.zDraft;
    const newZ = status === "published" ? keys.zPublished : keys.zDraft;
    pipeline.zrem(oldZ, id);
    const score = status === "published" ? new Date(updated.publishedAt ?? now.toISOString()).getTime() : now.getTime();
    pipeline.zadd(newZ, { score, member: id });
  } else if (status === "published" && updated.publishedAt !== existing.publishedAt) {
    const score = new Date(
      updated.publishedAt ?? now.toISOString()
    ).getTime();
    pipeline.zadd(keys.zPublished, { score, member: id });
  }
  if (input.tags) {
    const oldTags = new Set(existing.tags);
    const newTags = new Set(tags);
    for (const t of oldTags)
      if (!newTags.has(t)) pipeline.srem(keys.tag(t), id);
    for (const t of newTags)
      if (!oldTags.has(t)) pipeline.sadd(keys.tag(t), id);
  }
  if (input.author && input.author.id !== existing.author.id) {
    pipeline.srem(keys.author(existing.author.id), id);
    pipeline.sadd(keys.author(input.author.id), id);
  }
  const prevMonth = monthFromDate(
    existing.status === "published" ? existing.publishedAt ?? existing.updatedAt : existing.updatedAt
  );
  const nextMonth = monthFromDate(
    status === "published" ? updated.publishedAt ?? updated.updatedAt : updated.updatedAt
  );
  if (prevMonth !== nextMonth) {
    pipeline.srem(keys.month(prevMonth), id);
    pipeline.sadd(keys.month(nextMonth), id);
  }
  await pipeline.exec();
  return updated;
}
async function deletePost(id) {
  const existing = await getPostById(id);
  if (!existing) return;
  const pipeline = redis.multi();
  pipeline.del(keys.post(id));
  pipeline.del(keys.slug(existing.slug));
  const zKey = existing.status === "published" ? keys.zPublished : keys.zDraft;
  pipeline.zrem(zKey, id);
  existing.tags.forEach((t) => pipeline.srem(keys.tag(t), id));
  pipeline.srem(keys.author(existing.author.id), id);
  const monthKey = monthFromDate(
    existing.status === "published" ? existing.publishedAt ?? existing.updatedAt : existing.updatedAt
  );
  pipeline.srem(keys.month(monthKey), id);
  await pipeline.exec();
}

export { getPostBySlug as a, createPost as c, deletePost as d, getPostById as g, keys as k, normalizeTag as n, redis as r, updatePost as u };
