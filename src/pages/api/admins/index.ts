import type { APIRoute } from 'astro'
import { redis, keys } from '../../../lib/kv'
import { requireAdmin, AuthError } from '../../../lib/auth'
export const prerender = false

async function handleAuth(request: Request) {
  try {
    await requireAdmin(request)
    return null
  } catch (e) {
    if (e instanceof AuthError) {
      return new Response(e.message, { status: e.status })
    }
    return new Response('Server error', { status: 500 })
  }
}

export const GET: APIRoute = async ({ request }) => {
  const auth = await handleAuth(request)
  if (auth) return auth
  const emails = await redis.smembers<string>(keys.adminEmails)
  return new Response(JSON.stringify(emails), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  })
}

export const POST: APIRoute = async ({ request }) => {
  const auth = await handleAuth(request)
  if (auth) return auth
  const { email } = await request.json()
  if (!email) return new Response('Email required', { status: 400 })
  await redis.sadd(keys.adminEmails, email.toLowerCase())
  return new Response(null, { status: 204 })
}

export const DELETE: APIRoute = async ({ request }) => {
  const auth = await handleAuth(request)
  if (auth) return auth
  const { email } = await request.json()
  if (!email) return new Response('Email required', { status: 400 })
  await redis.srem(keys.adminEmails, email.toLowerCase())
  return new Response(null, { status: 204 })
}
