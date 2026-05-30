import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase URL or service role key is not set')
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

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
