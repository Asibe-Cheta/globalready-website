# Web Team Handoff: New Pricing & Plans (May 2026)

**Status:** Mobile app OTA shipped (runtime 2.2.4). All in-app upgrade buttons now send users to **`https://globalready.tech/upgrade`**. The website must match the plans below or users will see a mismatch at checkout.

**Remove:** Application Boost Bundle (deprecated — overlaps with 7-Day Access).

---

## Where mobile sends users

The app opens this URL pattern:

```
https://globalready.tech/upgrade?uid={SUPABASE_USER_UUID}&plan={PLAN_ID}
```

| Query param | Required | Values |
|-------------|----------|--------|
| `uid` | Strongly recommended | Supabase auth user UUID |
| `plan` | Optional (pre-select) | `seven_day` \| `monthly_pro` \| `four_month_pro` \| `yearly_pro` |

Examples:

- Generic upgrade: `https://globalready.tech/upgrade?uid=abc-123-...`
- Pre-selected Monthly Pro: `https://globalready.tech/upgrade?uid=abc-123-...&plan=monthly_pro`
- Pre-selected 7-Day Access: `https://globalready.tech/upgrade?uid=abc-123-...&plan=seven_day`

**Your `/upgrade` page should:**

1. Read `uid` from the query string and keep it through checkout.
2. Read `plan` and highlight / pre-select that plan if present.
3. Pass `uid` as `user_id` (or `supabase_user_id`) in **Stripe Checkout Session metadata** on every purchase.
4. On success, redirect to something like `/upgrade-success` and tell the user to reopen the mobile app.

---

## Final pricing structure (must match app + Terms)

| Plan ID | Name | Price | Billing | Auto-renew | Duration |
|---------|------|-------|---------|------------|----------|
| `free` | Free Plan | €0 | — | No | — |
| `seven_day` | 7-Day Access | **€1.99** | One-time | **No** | 7 days |
| `monthly_pro` | Monthly Pro | **€9.99/month** | Recurring | **Yes** | Until cancelled |
| `four_month_pro` | 4-Month Pro | **€24.99** | One-time | **No** | 4 months |
| `yearly_pro` | Yearly Pro | **€69.99/year** | Recurring | **Yes** | Until cancelled |

All charges in **EUR**.

---

## What each plan unlocks

### Free Plan — €0

**Can:**

- Create/build **1 CV** in the app
- **Preview** CV inside the app (limited sections — name, headline, partial layout)
- View **limited job listings** and **limited job previews**

**Cannot:**

- Download CV
- Access direct application links
- Fully tailor CV to job descriptions
- Full job fit check
- Full cover letters
- Full interview practice
- Unlimited premium jobs

### 7-Day Access — €1.99 (one-time, 7 days)

Unlocks for **7 days**, then user returns to Free automatically:

- CV download
- Premium job application links
- CV tailoring
- Job fit check
- Cover letter generation
- Interview practice
- Saved jobs / application tracker (if available)
- Premium job access

### Monthly Pro — €9.99/month (recurring)

Everything in 7-Day Access, plus:

- Saved jobs & application tracker
- Weekly job match alerts (when available)
- Premium resource hub (when available)

Renews monthly until cancelled.

### 4-Month Pro — €24.99 (one-time, 4 months)

Everything in Monthly Pro for **4 months**. No auto-renewal.

**Badge (UI):** “Best for serious applicants”  
**Message:** “Get 4 months of premium access for less than 3 monthly payments.”

### Yearly Pro — €69.99/year (recurring)

Everything in Monthly Pro and 4-Month Pro.

**Badge (UI):** “Best Value”

---

## Copy to use everywhere (pricing, checkout, account, Terms)

**Main upgrade message (headline / hero):**

> Unlock job application links, download your CV, tailor your CV, check your fit, generate cover letters and apply with more confidence.

**Download CV prompt (when free user tries to download):**

> Your CV is ready. Upgrade to download your CV, unlock job application links, tailor your CV to jobs, check your job fit, and apply with more confidence.

**Checkout disclosure (all paid plans):**

> Premium access activates immediately after successful payment. When access expires or is cancelled, you return to the Free Plan automatically unless stated otherwise at checkout.

**One-time plans (7-Day, 4-Month):** clearly state **no auto-renewal** and exact access duration.

**Recurring plans (Monthly, Yearly):** state price, billing interval, auto-renewal, and how to cancel.

---

## Pages / surfaces to update on globalready.tech

| Surface | Action |
|---------|--------|
| `/upgrade` | Show all 4 paid plans + Free comparison; honor `uid` + `plan` query params |
| Pricing / marketing pages | Remove old tiers ($7 ATS, $10 rewrite, Application Boost Bundle, etc.) |
| Stripe Checkout | One Stripe Price per paid plan (see below) |
| Checkout success | Confirm plan name + “Reopen the GlobalReady app” |
| Account / subscription page | Show current plan name, expiry/renewal date, cancel (for recurring only) |
| Terms of Service | Align with mobile (already updated in app) |
| Privacy Policy | Mention multiple paid plans (not only “GlobalReady Pro”) |

---

## Stripe setup (recommended)

Create **four products/prices** in Stripe (EUR):

| Plan ID | Stripe Checkout `mode` | Suggested Stripe metadata |
|---------|------------------------|---------------------------|
| `seven_day` | `payment` (one-time) | `plan_type: seven_day`, `user_id: {uid}` |
| `monthly_pro` | `subscription` | `plan_type: monthly_pro`, `user_id: {uid}` |
| `four_month_pro` | `payment` (one-time) | `plan_type: four_month_pro`, `user_id: {uid}` |
| `yearly_pro` | `subscription` | `plan_type: yearly_pro`, `user_id: {uid}` |

Store price IDs in your web env (examples):

```
STRIPE_PRICE_SEVEN_DAY=price_xxx
STRIPE_PRICE_MONTHLY_PRO=price_xxx
STRIPE_PRICE_FOUR_MONTH_PRO=price_xxx
STRIPE_PRICE_YEARLY_PRO=price_xxx
```

### Example: one-time 7-Day checkout session

```javascript
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: [{ price: process.env.STRIPE_PRICE_SEVEN_DAY, quantity: 1 }],
  customer_email: userEmail, // optional if you have it
  metadata: {
    user_id: uid,           // from ?uid= query param — REQUIRED
    plan_type: 'seven_day',
  },
  success_url: 'https://globalready.tech/upgrade-success?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://globalready.tech/upgrade',
});
```

### Example: recurring Monthly Pro checkout session

```javascript
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [{ price: process.env.STRIPE_PRICE_MONTHLY_PRO, quantity: 1 }],
  metadata: { user_id: uid, plan_type: 'monthly_pro' },
  subscription_data: {
    metadata: { user_id: uid, plan_type: 'monthly_pro' },
  },
  success_url: 'https://globalready.tech/upgrade-success?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://globalready.tech/upgrade',
});
```

Apply the same pattern for `four_month_pro` (`mode: 'payment'`) and `yearly_pro` (`mode: 'subscription'`).

---

## Supabase `subscriptions` table — what to write after payment

The mobile app treats a user as **premium** when:

```sql
status IN ('active', 'trialing')
AND current_period_end > now()
```

After **every successful checkout**, upsert into `public.subscriptions` for that `user_id`:

| Field | One-time (7-day / 4-month) | Recurring (monthly / yearly) |
|-------|----------------------------|------------------------------|
| `user_id` | Supabase UUID from metadata | Same |
| `stripe_customer_id` | From Stripe session/customer | Same |
| `stripe_subscription_id` | `NULL` (or omit) | Stripe `sub_xxx` |
| `status` | `'active'` | `'active'` |
| `current_period_end` | **now + 7 days** or **now + 4 months** | From Stripe subscription `current_period_end` |
| `cancel_at_period_end` | `false` | From Stripe subscription |
| `plan_type` | `'seven_day'` or `'four_month_pro'` | `'monthly_pro'` or `'yearly_pro'` |

> **`plan_type` column:** add if missing (`TEXT`, nullable). Mobile reads it for plan labels on the billing screen. If absent, app still works but may show a generic “Pro” name.

### Webhook events to handle

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Activate access; set `plan_type` + `current_period_end` (compute for one-time) |
| `customer.subscription.updated` | Update status, period end, cancel flag (recurring only) |
| `customer.subscription.deleted` | Set `status: 'canceled'` or clear premium when period ends |

Existing webhook endpoint (confirm with backend):

```
https://bwgqzoplcgxguylerqsn.supabase.co/functions/v1/stripe-webhook
```

Mobile **restore/sync** also calls:

```
POST /functions/v1/sync-subscription
```

That function checks the DB first (for one-time plans), then Stripe subscriptions. **One-time plans must be written to the DB by your webhook** — Stripe has no subscription object for them.

---

## Mobile ↔ web alignment checklist

- [ ] `/upgrade` shows **Free + 4 paid plans** at the prices above
- [ ] Application Boost Bundle **removed** everywhere
- [ ] `?uid=` passed into Stripe metadata as `user_id`
- [ ] `?plan=` pre-selects the correct plan card
- [ ] One-time checkouts set `current_period_end` (7 days / 4 months) in DB
- [ ] Recurring checkouts store `stripe_subscription_id` + renewal date
- [ ] `plan_type` stored on every successful purchase
- [ ] Account page shows plan name + expiry/renewal
- [ ] Terms / checkout copy matches mobile app
- [ ] End-to-end test: pay on web → force-close app → reopen → **Profile → Plans & Billing** shows premium

---

## Reference: mobile source of truth

Plan IDs, prices, features, and upgrade URLs are defined in the mobile repo:

```
constants/plans.ts
```

If pricing changes again, update **both** the mobile constants and this document + the website.

---

## Selar (web + mobile)

- Edge function: `https://bwgqzoplcgxguylerqsn.supabase.co/functions/v1/selar-webhook`
- Selar sends a webhook on purchase; we match the buyer **by email** to a Supabase user and upsert `subscriptions` with the same `plan_type` / `current_period_end` rules as Stripe.

**Website:** `/upgrade` has secondary **Pay with Selar instead** buttons (env-driven). Post-payment redirect: `https://globalready.tech/upgrade-success`.

**Product codes** (set as `NEXT_PUBLIC_*` in Vercel / `.env.local`):

| Plan | Env var | Code |
|------|---------|------|
| Monthly Pro | `NEXT_PUBLIC_SELAR_PRODUCT_MONTHLY_PRO` | `r636f00tdn` |
| 4-Month Pro | `NEXT_PUBLIC_SELAR_PRODUCT_FOUR_MONTH_PRO` | `3c740226s3` |
| Yearly Pro | `NEXT_PUBLIC_SELAR_PRODUCT_YEARLY_PRO` | `c899qx619s` |
| 7-Day Access | — | **Stripe only** (Selar minimum ~$3; plan is €1.99) |

---

## Related docs

- `WEB_TEAM_SUBSCRIPTION_GUIDE.md` — older single-plan guide (partially outdated; use **this document** for pricing)
- `WEB_TEAM_SUBSCRIPTION_ADMIN_HANDOFF.md` — admin API for subscribed-user reporting
