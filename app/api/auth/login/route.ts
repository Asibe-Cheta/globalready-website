import { NextRequest, NextResponse } from 'next/server'
import type { AdminRole } from '@/lib/admin-roles'
import { defaultAdminRedirect } from '@/lib/admin-roles'
import { createAdminSessionToken, COOKIE_NAME } from '@/lib/admin-session-sign'

/** GET: health check for this route */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Login API is reachable. POST with { "password": "..." } to sign in.',
    env: {
      hasPassword: !!process.env.ADMIN_PASSWORD,
      hasJobsPassword: !!process.env.ADMIN_JOBS_PASSWORD,
      hasSessionSecret: !!process.env.ADMIN_SESSION_SECRET,
    },
  })
}

function resolveAdminRole(password: string): AdminRole | null {
  const submitted = password.trim()
  const fullPassword = process.env.ADMIN_PASSWORD?.trim()
  const jobsPassword = process.env.ADMIN_JOBS_PASSWORD?.trim()

  if (fullPassword && submitted === fullPassword) return 'full'
  if (jobsPassword && submitted === jobsPassword) return 'jobs'
  return null
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ADMIN_PASSWORD && !process.env.ADMIN_JOBS_PASSWORD) {
      return NextResponse.json(
        { error: 'Admin login not configured. Set ADMIN_PASSWORD and/or ADMIN_JOBS_PASSWORD in Vercel and redeploy.' },
        { status: 500 }
      )
    }

    let body: { password?: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const submitted = typeof body.password === 'string' ? body.password : ''
    const role = resolveAdminRole(submitted)
    if (!role) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const token = createAdminSessionToken(role)
    if (!token) {
      return NextResponse.json(
        { error: 'Session not configured. Set ADMIN_SESSION_SECRET in Vercel and redeploy.' },
        { status: 500 }
      )
    }

    const from = request.nextUrl.searchParams.get('from')
    const redirectTo = defaultAdminRedirect(role, from)
    const res = NextResponse.json({ success: true, redirect: redirectTo, role })
    const host = request.nextUrl.hostname || ''
    const cookieOpts: {
      path: string
      httpOnly: boolean
      sameSite: 'lax'
      maxAge: number
      secure?: boolean
      domain?: string
    } = {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      secure: process.env.NODE_ENV === 'production',
    }
    if (process.env.NODE_ENV === 'production' && (host === 'globalready.tech' || host === 'www.globalready.tech')) {
      cookieOpts.domain = '.globalready.tech'
    }
    res.cookies.set(COOKIE_NAME, token, cookieOpts)
    return res
  } catch (err) {
    console.error('Login API error:', err)
    return NextResponse.json(
      { error: 'Server error during login. Check Vercel Function logs.' },
      { status: 500 }
    )
  }
}
