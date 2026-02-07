/**
 * Admin session signing and verification (Node only - used by API routes).
 * Do not import in middleware (Edge).
 * Verification here uses the same createHmac as signing to avoid Node vs Web Crypto mismatches.
 */

import { createHmac } from 'crypto'
import { COOKIE_NAME, MAX_AGE_MS, getAdminSessionCookie } from './admin-session'

function base64UrlEncode(s: string): string {
  return Buffer.from(s, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecode(s: string): string {
  const base64 = s.replace(/-/g, '+').replace(/_/g, '/')
  const pad = base64.length % 4
  const padded = pad ? base64 + '='.repeat(4 - pad) : base64
  return Buffer.from(padded, 'base64').toString('utf8')
}

export function createAdminSessionToken(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) return null
  const payload = { admin: true, exp: Date.now() + MAX_AGE_MS }
  const payloadBase64 = base64UrlEncode(JSON.stringify(payload))
  const sig = createHmac('sha256', secret).update(payloadBase64).digest('hex')
  return `${payloadBase64}.${sig}`
}

export type VerifyResult = 'ok' | 'no_secret' | 'no_cookie' | 'invalid_session'

/**
 * Verify admin session using Node crypto (same as signing). Use this in API routes so sign/verify match.
 * Returns reason string for 401 responses (no_secret, no_cookie, invalid_session).
 */
export function verifyAdminSessionNode(request: Request): VerifyResult {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) return 'no_secret'
  const token = getAdminSessionCookie(request)
  if (!token) return 'no_cookie'
  const dot = token.indexOf('.')
  if (dot === -1) return 'invalid_session'
  const payloadBase64 = token.slice(0, dot)
  const sigHex = token.slice(dot + 1)
  try {
    const payloadJson = base64UrlDecode(payloadBase64)
    const payload = JSON.parse(payloadJson) as { admin?: boolean; exp?: number }
    if (!payload.admin || typeof payload.exp !== 'number') return 'invalid_session'
    if (payload.exp < Date.now()) return 'invalid_session'
    const expectedSig = createHmac('sha256', secret).update(payloadBase64).digest('hex')
    return sigHex === expectedSig ? 'ok' : 'invalid_session'
  } catch {
    return 'invalid_session'
  }
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
