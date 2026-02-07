/**
 * Admin session signing (Node only - used by API routes).
 * Do not import in middleware (Edge).
 */

import { createHmac } from 'crypto'
import { COOKIE_NAME, MAX_AGE_MS } from './admin-session'

function base64UrlEncode(s: string): string {
  return Buffer.from(s, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function createAdminSessionToken(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) return null
  const payload = { admin: true, exp: Date.now() + MAX_AGE_MS }
  const payloadBase64 = base64UrlEncode(JSON.stringify(payload))
  const sig = createHmac('sha256', secret).update(payloadBase64).digest('hex')
  return `${payloadBase64}.${sig}`
}

export function getAdminSessionCookieAttributes(): string {
  const isProd = process.env.NODE_ENV === 'production'
  return [
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${MAX_AGE_MS / 1000}`,
    ...(isProd ? ['Secure'] : []),
  ].join('; ')
}

export { COOKIE_NAME } from './admin-session'
