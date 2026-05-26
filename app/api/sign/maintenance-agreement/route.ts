import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { MAINTENANCE_AGREEMENT_REF } from '@/lib/maintenance-agreement'

export const runtime = 'nodejs'

type AgreementRow = {
  id: string
  agreement_ref: string
  justice_signature: string | null
  justice_signed_at: string | null
  client_signature: string | null
  client_name: string | null
  client_title: string | null
  client_signed_at: string | null
  is_fully_executed: boolean
  created_at: string
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase URL or service role key is not set')
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

function isSignatureImage(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('data:image/png;base64,') && value.length > 200
}

async function getOrCreateAgreement() {
  const supabase = getSupabaseAdmin()
  const existing = await supabase
    .from('maintenance_agreement_signatures')
    .select('*')
    .eq('agreement_ref', MAINTENANCE_AGREEMENT_REF)
    .maybeSingle<AgreementRow>()

  if (existing.error) throw existing.error
  if (existing.data) return existing.data

  const created = await supabase
    .from('maintenance_agreement_signatures')
    .insert({ agreement_ref: MAINTENANCE_AGREEMENT_REF })
    .select('*')
    .single<AgreementRow>()

  if (created.error) throw created.error
  return created.data
}

export async function GET() {
  try {
    const agreement = await getOrCreateAgreement()
    return NextResponse.json({ agreement })
  } catch (error) {
    console.error('maintenance agreement GET error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load agreement signatures' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const role = typeof body.role === 'string' ? body.role : ''
    const signature = body.signature

    if (!isSignatureImage(signature)) {
      return NextResponse.json({ error: 'A valid signature image is required.' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const agreement = await getOrCreateAgreement()
    const now = new Date().toISOString()

    if (role === 'justice') {
      if (agreement.justice_signature) {
        return NextResponse.json({ error: 'Justice Asibe has already signed this agreement.' }, { status: 409 })
      }

      const { data, error } = await supabase
        .from('maintenance_agreement_signatures')
        .update({
          justice_signature: signature,
          justice_signed_at: now,
        })
        .eq('agreement_ref', MAINTENANCE_AGREEMENT_REF)
        .select('*')
        .single<AgreementRow>()

      if (error) throw error
      return NextResponse.json({ agreement: data })
    }

    if (role === 'client') {
      if (!agreement.justice_signature) {
        return NextResponse.json({ error: 'Justice Asibe must sign before GlobalReady.' }, { status: 409 })
      }
      if (agreement.client_signature) {
        return NextResponse.json({ error: 'GlobalReady has already signed this agreement.' }, { status: 409 })
      }

      const clientName = typeof body.client_name === 'string' ? body.client_name.trim() : ''
      const clientTitle = typeof body.client_title === 'string' ? body.client_title.trim() : ''
      if (!clientName || !clientTitle) {
        return NextResponse.json({ error: 'Full name and job title are required.' }, { status: 400 })
      }

      const { data, error } = await supabase
        .from('maintenance_agreement_signatures')
        .update({
          client_signature: signature,
          client_name: clientName,
          client_title: clientTitle,
          client_signed_at: now,
          is_fully_executed: true,
        })
        .eq('agreement_ref', MAINTENANCE_AGREEMENT_REF)
        .select('*')
        .single<AgreementRow>()

      if (error) throw error
      return NextResponse.json({ agreement: data })
    }

    return NextResponse.json({ error: 'Unknown signing role.' }, { status: 400 })
  } catch (error) {
    console.error('maintenance agreement POST error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save signature' },
      { status: 500 }
    )
  }
}
