import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://globalready.tech'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
  return new Stripe(key)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const uid = typeof body?.uid === 'string' ? body.uid.trim() : null

    if (!uid) {
      return NextResponse.json(
        { error: 'Missing user ID. Open the GlobalReady app and use Subscribe — you’ll be sent here with your account linked.' },
        { status: 400 }
      )
    }

    const priceId = process.env.STRIPE_PRICE_ID
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
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        user_id: uid,
      },
      subscription_data: {
        metadata: {
          user_id: uid,
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
