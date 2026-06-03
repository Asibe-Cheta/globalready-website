import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const uid = request.nextUrl.searchParams.get('uid')?.trim()
    if (!uid) {
      return NextResponse.json({ error: 'uid required.' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(uid)
    if (error || !data.user?.email) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }

    return NextResponse.json({ email: data.user.email })
  } catch (err) {
    console.error('upgrade/user-email error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Could not look up account.' },
      { status: 500 }
    )
  }
}
