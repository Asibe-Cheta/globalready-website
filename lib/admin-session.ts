/**
 * Admin session verification for Edge (middleware).
 * Signing is done in API route (Node) with crypto.createHmac.
 */

const COOKIE_NAME = 'admin_session'
const MAX_AGE_MS = 24 * 60 * 60 * 1000 // 24h

function base64UrlEncode(s: string): string {
  const bytes = new TextEncoder().encode(s)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecode(s: string): string {
  const base64 = s.replace(/-/g, '+').replace(/_/g, '/')
  const pad = base64.length % 4
  const padded = pad ? base64 + '='.repeat(4 - pad) : base64
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

async function hmacSha256Hex(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(message)
  )
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function getAdminSessionCookie(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return null
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`))
  return match ? match[1].trim() : null
}

/**
 * Verify the admin session token. Returns true if valid and not expired.
 */
export async function verifyAdminSession(request: Request): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) return false
  const token = getAdminSessionCookie(request)
  if (!token) return false
  const dot = token.indexOf('.')
  if (dot === -1) return false
  const payloadBase64 = token.slice(0, dot)
  const sigHex = token.slice(dot + 1)
  try {
    const payloadJson = base64UrlDecode(payloadBase64)
    const payload = JSON.parse(payloadJson) as { admin?: boolean; exp?: number }
    if (!payload.admin || typeof payload.exp !== 'number') return false
    if (payload.exp < Date.now()) return false
    const expectedSig = await hmacSha256Hex(payloadBase64, secret)
    return sigHex === expectedSig
  } catch {
    return false
  }
}

export { COOKIE_NAME, MAX_AGE_MS }
