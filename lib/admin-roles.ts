export type AdminRole = 'full' | 'jobs'

export function normalizeAdminRole(role: unknown): AdminRole {
  return role === 'jobs' ? 'jobs' : 'full'
}

/** Pages a jobs-only admin may open (login is always allowed in middleware). */
export function isAdminPageAllowedForRole(pathname: string, role: AdminRole): boolean {
  if (role === 'full') return true
  if (pathname === '/admin' || pathname === '/admin/') return false
  if (pathname === '/admin/jobs' || pathname === '/admin/jobs/new') return true
  return false
}

/** API paths under /api/admin/* (no leading slash). */
export function isAdminApiPathAllowedForRole(path: string, method: string, role: AdminRole): boolean {
  if (role === 'full') return true

  const normalized = path.replace(/^\/+|\/+$/g, '')
  if (normalized === 'me' && method === 'GET') return true
  if (normalized === 'jobs' && (method === 'GET' || method === 'POST')) return true
  return false
}

export function defaultAdminRedirect(role: AdminRole, from?: string | null): string {
  if (role === 'jobs') return '/admin/jobs'
  return from && from.startsWith('/admin') ? from : '/admin'
}

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  full: 'Administrator',
  jobs: 'Job poster',
}
