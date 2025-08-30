import { clerkClient, verifyToken } from '@clerk/astro/server'
import { redis, keys, type Author } from './kv'

export class AuthError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function requireAdmin(request: Request): Promise<Author> {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined
  if (!token) throw new AuthError('Unauthorized', 401)
  const payload = await verifyToken(token)
  const userId = payload.sub
  const user = await clerkClient.users.getUser(userId)
  const email = user.primaryEmailAddress?.emailAddress?.toLowerCase()
  if (!email) throw new AuthError('Unauthorized', 401)
  const allowed = await redis.sismember(keys.adminEmails, email)
  if (!allowed) throw new AuthError('Forbidden', 403)
  return {
    id: userId,
    name: user.fullName || '',
    email,
    image: user.imageUrl,
  }
}
