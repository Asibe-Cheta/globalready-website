import { NextRequest, NextResponse } from 'next/server'
import { createAdminSessionToken, COOKIE_NAME } from '@/lib/admin-session-sign'

/**
 * Admin login — at /api/auth/login so middleware does NOT run (matcher is only /api/admin/*).
 * Fixes "No response" when POST to /api/admin/auth/login was affected by middleware.
 */

/** GET: health check for this route */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Login API is reachable. POST with { "password": "..." } to sign in.',
    env: {
      hasPassword: !!process.env.ADMIN_PASSWORD,
      hasSessionSecret: !!process.env.ADMIN_SESSION_SECRET,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const envPassword = process.env.ADMIN_PASSWORD
    if (!envPassword) {
      return NextResponse.json({ error: 'Admin login not configured. Set ADMIN_PASSWORD in Vercel and redeploy.' }, { status: 500 })
    }
    let body: { password?: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
    const submitted = typeof body.password === 'string' ? body.password.trim() : ''
    const expected = envPassword.trim()
    if (submitted !== expected) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }
    const token = createAdminSessionToken()
    if (!token) {
      return NextResponse.json({ error: 'Session not configured. Set ADMIN_SESSION_SECRET in Vercel and redeploy.' }, { status: 500 })
    }
    const redirectTo = request.nextUrl.searchParams.get('from') || '/admin'
    // Return 200 + JSON instead of 302 so fetch always gets a proper response (avoids status 0 in some browsers)
    const res = NextResponse.json({ success: true, redirect: redirectTo })
    res.cookies.set(COOKIE_NAME, token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24h
      secure: process.env.NODE_ENV === 'production',
    })
    return res
  } catch (err) {
    console.error('Login API error:', err)
    return NextResponse.json(
      { error: 'Server error during login. Check Vercel Function logs.' },
      { status: 500 }
    )
  }
}
