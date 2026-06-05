import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAdminPageAllowedForRole } from '@/lib/admin-roles'
import { getAdminSession } from '@/lib/admin-session'

const ADMIN_LOGIN = '/admin/login'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === ADMIN_LOGIN) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    const session = await getAdminSession(request)
    if (!session.valid) {
      const loginUrl = new URL(ADMIN_LOGIN, request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (!isAdminPageAllowedForRole(pathname, session.role)) {
      return NextResponse.redirect(new URL('/admin/jobs', request.url))
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
