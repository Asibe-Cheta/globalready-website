import type { AdminRole } from '@/lib/admin-roles'
import { normalizeAdminRole } from '@/lib/admin-roles'
import { getAdminSessionCookie } from '@/lib/admin-session'

export type AdminSessionPayload = {
  admin: boolean
  role: AdminRole
  exp: number
}

function base64UrlDecodeNode(s: string): string {
  const base64 = s.replace(/-/g, '+').replace(/_/g, '/')
  const pad = base64.length % 4
  const padded = pad ? base64 + '='.repeat(4 - pad) : base64
  return Buffer.from(padded, 'base64').toString('utf8')
}

function base64UrlDecodeEdge(s: string): string {
  const base64 = s.replace(/-/g, '+').replace(/_/g, '/')
  const pad = base64.length % 4
  const padded = pad ? base64 + '='.repeat(4 - pad) : base64
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

export function decodeAdminSessionPayload(
  token: string,
  decodeBase64Url: (value: string) => string
): AdminSessionPayload | null {
  const dot = token.indexOf('.')
  if (dot === -1) return null

  try {
    const payloadJson = decodeBase64Url(token.slice(0, dot))
    const payload = JSON.parse(payloadJson) as { admin?: boolean; role?: unknown; exp?: number }
    if (!payload.admin || typeof payload.exp !== 'number') return null
    if (payload.exp < Date.now()) return null
    return {
      admin: true,
      role: normalizeAdminRole(payload.role),
      exp: payload.exp,
    }
  } catch {
    return null
  }
}

export function getAdminSessionPayloadFromRequest(
  request: Request,
  runtime: 'node' | 'edge' = 'node'
): AdminSessionPayload | null {
  const token = getAdminSessionCookie(request)
  if (!token) return null
  const decode = runtime === 'node' ? base64UrlDecodeNode : base64UrlDecodeEdge
  return decodeAdminSessionPayload(token, decode)
}
