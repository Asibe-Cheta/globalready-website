import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-session'

const ADMIN_LOGIN = '/admin/login'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === ADMIN_LOGIN) {
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

  // /api/admin is protected in the API route (Node) so cookies are available there
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
