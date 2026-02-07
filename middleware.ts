import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-session'

const ADMIN_LOGIN = '/admin/login'
const API_AUTH_LOGIN = '/api/admin/auth/login'
const API_AUTH_LOGOUT = '/api/admin/auth/logout'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page and auth API without session
  if (pathname === ADMIN_LOGIN || pathname === API_AUTH_LOGIN || pathname === API_AUTH_LOGOUT) {
    return NextResponse.next()
  }

  // Protect /admin (all admin pages except login)
  if (pathname.startsWith('/admin')) {
    const valid = await verifyAdminSession(request)
    if (!valid) {
      const loginUrl = new URL(ADMIN_LOGIN, request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Protect /api/admin (all proxy routes except auth)
  if (pathname.startsWith('/api/admin')) {
    const valid = await verifyAdminSession(request)
    if (!valid) {
      return NextResponse.json({ error: 'Unauthorized. Please log in at /admin/login' }, { status: 401 })
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
