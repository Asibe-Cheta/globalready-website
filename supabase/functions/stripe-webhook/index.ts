// Supabase Edge Function: stripe-webhook
// Deploy with:
// npx supabase functions deploy stripe-webhook --project-ref bwgqzoplcgxguylerqsn

import Stripe from 'https://esm.sh/stripe@20.4.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type SubscriptionRow = {
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  status: string
  current_period_end: string | null
  cancel_at_period_end: boolean
  plan_type?: string | null
  updated_at?: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function getEnv(name: string): string {
  const value = Deno.env.get(name)
  if (!value) throw new Error(`${name} is not set`)
  return value
}

function getSupabase() {
  return createClient(getEnv('SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'))
}

function isoFromUnix(unixSeconds: number | null | undefined): string | null {
  if (!unixSeconds) return null
  return new Date(unixSeconds * 1000).toISOString()
}

function addAccessDuration(planType: string | null | undefined): string | null {
  const now = new Date()
  if (planType === 'seven_day') {
    now.setDate(now.getDate() + 7)
    return now.toISOString()
  }
  if (planType === 'four_month_pro') {
    now.setMonth(now.getMonth() + 4)
    return now.toISOString()
  }
  return null
}

async function upsertSubscription(row: SubscriptionRow) {
  const supabase = getSupabase()
  const payload = {
    ...row,
    updated_at: new Date().toISOString(),
  }
  const { error } = await supabase.from('subscriptions').upsert(payload, { onConflict: 'user_id' })
  if (error) throw error
}

async function getUserIdByCustomerId(customerId: string | null): Promise<string | null> {
  if (!customerId) return null
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data?.user_id ?? null
}

function getPlanTypeFromMetadata(metadata: Stripe.Metadata | null | undefined): string | null {
  if (!metadata) return null
  return metadata.plan_type ?? null
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function userMatchesEmail(user: { email?: string | null; identities?: Array<{ identity_data?: Record<string, unknown> }> }, normalizedEmail: string): boolean {
  if (user.email?.toLowerCase() === normalizedEmail) return true
  const identities = user.identities ?? []
  return identities.some((identity) => {
    const identityEmail =
      typeof identity.identity_data?.email === 'string'
        ? identity.identity_data.email
        : null
    return identityEmail?.toLowerCase() === normalizedEmail
  })
}

async function findAuthUserIdByEmail(email: string): Promise<string | null> {
  const supabase = getSupabase()
  const normalizedEmail = normalizeEmail(email)
  let page = 1
  const perPage = 1000

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })
    if (error) throw error

    const match = data.users.find((user) => userMatchesEmail(user, normalizedEmail))
    if (match?.id) return match.id

    if (data.users.length < perPage) break
    page += 1
  }

  return null
}

function getCheckoutEmail(session: Stripe.Checkout.Session): string | null {
  return (
    session.customer_email ??
    session.customer_details?.email ??
    session.metadata?.email ??
    null
  )
}

async function resolveCheckoutUserId(session: Stripe.Checkout.Session): Promise<string | null> {
  if (session.metadata?.user_id) return session.metadata.user_id

  const email = getCheckoutEmail(session)
  if (!email) return null

  return findAuthUserIdByEmail(email)
}

async function handleCheckoutCompleted(stripe: Stripe, session: Stripe.Checkout.Session) {
  const userId = await resolveCheckoutUserId(session)
  const customerId = typeof session.customer === 'string' ? session.customer : null
  const planType = getPlanTypeFromMetadata(session.metadata)

  if (!userId) {
    throw new Error('checkout.session.completed: could not resolve user_id from metadata or customer email')
  }

  if (session.mode === 'subscription') {
    if (!session.subscription || typeof session.subscription !== 'string') {
      throw new Error('checkout.session.completed subscription mode missing subscription id')
    }

    const subscription = await stripe.subscriptions.retrieve(session.subscription)

    await upsertSubscription({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      current_period_end: isoFromUnix(subscription.current_period_end),
      cancel_at_period_end: subscription.cancel_at_period_end ?? false,
      plan_type: getPlanTypeFromMetadata(subscription.metadata) ?? planType,
    })
    return
  }

  // One-time plans: represent access duration in DB without Stripe subscription row.
  const currentPeriodEnd = addAccessDuration(planType)
  if (!currentPeriodEnd) {
    throw new Error(`Unsupported one-time plan_type: ${planType ?? 'null'}`)
  }

  await upsertSubscription({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: null,
    status: 'active',
    current_period_end: currentPeriodEnd,
    cancel_at_period_end: false,
    plan_type: planType,
  })
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription, statusOverride?: string) {
  const customerId = typeof subscription.customer === 'string' ? subscription.customer : null
  const userId = subscription.metadata?.user_id || await getUserIdByCustomerId(customerId)

  if (!userId) {
    // We intentionally don't fail the webhook for unmapped subscriptions.
    console.warn(`No user mapping found for subscription ${subscription.id}`)
    return
  }

  await upsertSubscription({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    status: statusOverride || subscription.status,
    current_period_end: isoFromUnix(subscription.current_period_end),
    cancel_at_period_end: subscription.cancel_at_period_end ?? false,
    plan_type: getPlanTypeFromMetadata(subscription.metadata),
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const stripe = new Stripe(getEnv('STRIPE_SECRET_KEY'))
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return new Response(JSON.stringify({ error: 'Missing stripe-signature header' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const payload = await req.text()
    const event = await stripe.webhooks.constructEventAsync(
      payload,
      signature,
      getEnv('STRIPE_WEBHOOK_SECRET'),
    )

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(stripe, event.data.object as Stripe.Checkout.Session)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription, 'canceled')
        break
      default:
        break
    }

    return new Response(JSON.stringify({ received: true, event: event.type }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('stripe-webhook error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Webhook processing failed' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
