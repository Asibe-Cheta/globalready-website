import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://globalready.tech'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
  return new Stripe(key)
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase URL or service role key is not set')
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const uid = typeof body?.uid === 'string' ? body.uid.trim() : null
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : null

    let userId: string | null = uid

    if (!userId && email) {
      const supabaseAdmin = getSupabaseAdmin()
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
      if (error) {
        console.error('Supabase listUsers error:', error.message, error)
        return NextResponse.json(
          { message: 'Could not look up account.' },
          { status: 500 }
        )
      }
      const match = data.users.find((u) => u.email?.toLowerCase() === email)
      if (!match) {
        return NextResponse.json(
          { message: 'No GlobalReady account found with that email. Please sign up in the app first.' },
          { status: 404 }
        )
      }
      userId = match.id
    }

    if (!userId) {
      return NextResponse.json(
        { message: 'uid or email required.' },
        { status: 400 }
      )
    }

    const priceId = process.env.STRIPE_PRICE_ID || process.env.STRIPE_PRO_PRICE_ID
    if (!process.env.STRIPE_SECRET_KEY || !priceId) {
      console.error('Missing STRIPE_SECRET_KEY or STRIPE_PRICE_ID')
      return NextResponse.json(
        { error: 'Checkout is not configured.' },
        { status: 500 }
      )
    }

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      client_reference_id: userId,
      allow_promotion_codes: true,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        user_id: userId,
      },
      subscription_data: {
        metadata: {
          user_id: userId,
        },
      },
      success_url: `${BASE_URL}/upgrade-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/#pricing`,
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Could not create checkout session.' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('create-checkout-session error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Checkout failed.' },
      { status: 500 }
    )
  }
}
