import type { APIRoute } from 'astro'
import { redis, keys } from '../../../lib/kv'

export const GET: APIRoute = async () => {
  try {
    // Get all tags
    const tagKeys = await redis.keys(keys.tag('*'))
    const tags = tagKeys.map(key => key.split(':').pop()).filter(Boolean)
    
    // Get all months (this is a simplified version - in a real app you'd get from posts)
    const months: string[] = []
    
    return new Response(JSON.stringify({
      tags: tags.sort(),
      months: months.sort()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Error fetching metadata:', error)
    return new Response(JSON.stringify({
      tags: [],
      months: []
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
