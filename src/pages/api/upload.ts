import type { APIRoute } from 'astro'
import { requireAdmin, AuthError } from '../../lib/auth'
export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    await requireAdmin(request)
    return new Response('Not implemented', { status: 501 })
  } catch (e) {
    if (e instanceof AuthError) {
      return new Response(e.message, { status: e.status })
    }
    return new Response('Server error', { status: 500 })
  }
}
