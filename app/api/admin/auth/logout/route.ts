import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_NAME } from '@/lib/admin-session'

export async function POST(request: NextRequest) {
  const res = NextResponse.redirect(new URL('/admin/login', request.url), 302)
  res.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 })
  return res
}

export async function GET(request: NextRequest) {
  const res = NextResponse.redirect(new URL('/admin/login', request.url), 302)
  res.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 })
  return res
}
