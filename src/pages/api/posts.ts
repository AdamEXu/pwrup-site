import type { APIRoute } from 'astro'
import { createPost } from '../../lib/kv'
import { requireAdmin, AuthError } from '../../lib/auth'
export const prerender = false

export const POST: APIRoute = async (context) => {
  try {
    const author = await requireAdmin(context)
    const body = await context.request.json()
    
    if (!body.title || !body.content) {
      return new Response('Missing required fields: title and content', { status: 400 })
    }

    // Set defaults for optional fields
    const postData = {
      title: body.title,
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      description: body.description || '',
      content: body.content,
      tags: Array.isArray(body.tags) ? body.tags : [],
      status: body.status || 'draft',
      readingTime: body.readingTime || undefined,
      headerImage: body.headerImage || undefined,
      author
    }

    const post = await createPost(postData)
    
    return new Response(JSON.stringify(post), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (e) {
    console.error('Create post error:', e)
    if (e instanceof AuthError) {
      return new Response(e.message, { status: e.status })
    }
    return new Response('Server error', { status: 500 })
  }
}
