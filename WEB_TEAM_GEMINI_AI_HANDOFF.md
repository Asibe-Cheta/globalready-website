# Web Team Handoff: Anthropic → Google Gemini AI Migration

**Date:** May 2026  
**Mobile/backend status:** Code migrated in `globalready-mobile` repo. Edge functions call **Google Gemini** (not Anthropic Claude).  
**Your action:** Align **globalready.tech** legal copy, privacy disclosures, and any server-side AI (if present) with this change.

---

## Summary

GlobalReady’s **mobile app AI features** now run on **Google Gemini** via Supabase Edge Functions. The React Native app **does not** call Gemini directly — it calls the same Supabase function URLs as before.

**Unchanged:** Mock **voice** interviews still use **Vapi** (separate from Gemini). Only **text/JSON AI** (CV analysis, tailoring, PDF parsing, cover letters, interview *feedback*, job matching) moved to Gemini.

---

## What changed on the backend (mobile team owns this)

| Edge function | Feature | Gemini model tier |
|---------------|---------|-------------------|
| `analyze-cv` | Job fit / CV vs job | Flash (`gemini-2.0-flash` default) |
| `tailor-cv` | CV tailoring to job | Pro (`gemini-2.5-pro` default) |
| `parse-cv` | Extract text from uploaded PDF | Flash |
| `generate-summary` | Professional summary | Pro |
| `work-experience-assist` | AI bullet suggestions | Pro |
| `generate-cover-letter` | Cover letter from job + CV | Flash |
| `analyze-interview` | Post-interview transcript feedback | Flash |
| `ai-job-matcher` | Daily job matches | Flash |
| `daily-job-notifier` | Push notification job scoring | Flash |

Shared client: `supabase/functions/_shared/gemini.ts`  
Secrets (Supabase → Edge Functions → Secrets):

| Secret | Required | Purpose |
|--------|----------|---------|
| `GEMINI_API_KEY` | **Yes** | Google AI Studio / Gemini API key |
| `GEMINI_MODEL_FLASH` | No | Override fast model (default `gemini-2.0-flash`) |
| `GEMINI_MODEL_PRO` | No | Override quality model (default `gemini-2.5-pro`) |

`ANTHROPIC_API_KEY` is **no longer used** by these functions after deploy.

**Deploy (mobile/ops):**

```bash
supabase secrets set GEMINI_API_KEY=your-key --project-ref bwgqzoplcgxguylerqsn

supabase functions deploy analyze-cv tailor-cv parse-cv generate-summary work-experience-assist generate-cover-letter analyze-interview ai-job-matcher daily-job-notifier --project-ref bwgqzoplcgxguylerqsn
```

---

## What the web team must do

### 1. Privacy Policy (globalready.tech) — **required**

Update user-facing privacy content to replace **Anthropic** with **Google (Gemini)** where AI processors are listed.

**In-app text already updated** (for next OTA):

> If we use third-party AI service providers (including **Google Gemini** for CV, job-fit, and interview feedback features), they may process limited data on our behalf…

**Website should match:**

| Section | Change |
|---------|--------|
| AI-powered features | State that CV tailoring, job-fit analysis, and interview *feedback* may be processed using **Google Gemini** |
| Third-party processors table | Replace `Anthropic` row with `Google (Gemini)` — purpose: AI-powered CV, job-fit, and interview feedback |
| Data sent to AI | CV content, job descriptions, interview transcripts (for feedback only) — processed to generate outputs; not sold |

**Do not claim** the live voice interviewer is Gemini — that remains **Vapi** (list separately).

Suggested processor table row:

| Service | Purpose |
|---------|---------|
| Google (Gemini) | AI-powered CV analysis, tailoring, summaries, cover letters, and interview feedback |
| Vapi | AI voice mock interview sessions |
| Stripe | Payment processing |
| Supabase | Database, auth, storage (EU) |

### 2. Terms of Service — **review**

No pricing/checkout changes required for Gemini. Ensure Terms do **not** name Anthropic as the sole AI provider. Generic “AI-powered tools” language is fine if it does not list a specific vendor, or update to “third-party AI providers including Google.”

### 3. Marketing / FAQ copy — **if applicable**

Search the Next.js repo and CMS for:

- `Anthropic`
- `Claude`
- `sk-ant`

Remove or replace with neutral wording (“AI-powered”) or **Google Gemini** where you describe how the product works.

### 4. Website server-side AI — **audit required**

The mobile app does **not** depend on the website for AI. If **globalready.tech** has its own AI calls (e.g. Anthropic in API routes, chat widgets, admin tools):

- Audit all `anthropic`, `claude`, `ANTHROPIC_API_KEY` references in the **website repo**
- Either migrate those to Gemini using the same API patterns, or remove unused integrations
- Rotate/remove `ANTHROPIC_API_KEY` from Vercel/hosting env when nothing uses it

**If the website has zero server-side AI:** no code changes — **privacy/legal copy only**.

### 5. Stripe / Selar / subscriptions — **no change**

Gemini migration does **not** affect checkout, webhooks, or `subscriptions` table logic. Continue using `WEB_TEAM_PRICING_PLANS_HANDOFF.md` for billing.

### 6. GDPR / DPA — **ops (not necessarily web code)**

- Confirm Google AI / Gemini terms and data processing settings for your Google Cloud / AI Studio account
- Update internal records of sub-processors (Anthropic → Google)
- EU users: review Google’s data processing terms and whether you need Standard Contractual Clauses or Google’s DPA

---

## What does **not** change for the website

| Area | Status |
|------|--------|
| `/upgrade` URL params (`uid`, `plan`) | Unchanged |
| Stripe checkout & metadata | Unchanged |
| `stripe-webhook` → `subscriptions` | Unchanged (separate workstream) |
| Selar (app-only checkout) | Unchanged |
| Mobile app API contracts | Unchanged — same function names and JSON shapes |
| Vapi voice interviews | Unchanged |

---

## User-visible behaviour (for support docs)

After backend deploy + `GEMINI_API_KEY` set:

- Same screens and buttons in the app
- Possible minor differences in AI wording/style (Gemini vs Claude)
- PDF upload parsing quality should be re-tested on real CVs
- Interview **voice** still Vapi; only **feedback report** after the call uses Gemini

If AI features return errors, check Supabase function logs for `GEMINI_API_KEY is not configured` or Gemini quota errors.

---

## Web team checklist

- [x] Privacy Policy on globalready.tech lists **Google (Gemini)**, not Anthropic
- [x] Third-party table includes Vapi (voice) and Gemini (text AI) separately
- [x] Terms / FAQ / marketing scanned for Anthropic/Claude references (none in website repo)
- [x] Website repo audited for server-side Anthropic usage — **none**; privacy/legal copy only
- [ ] Remove unused `ANTHROPIC_API_KEY` from website hosting env (if present — Vercel audit)
- [x] Internal sub-processor list updated — see `SUB_PROCESSOR_REGISTER.md`
- [ ] Confirm with mobile that edge functions are deployed and `GEMINI_API_KEY` is set in Supabase

---

## Mobile team checklist (for “done when”)

- [ ] `GEMINI_API_KEY` set in Supabase secrets
- [ ] All 9 AI edge functions redeployed
- [ ] Smoke test: job fit, tailor CV, PDF upload parse, cover letter, interview feedback
- [ ] Optional OTA if in-app Privacy Policy text should ship immediately
- [ ] Remove `ANTHROPIC_API_KEY` from Supabase after validation (or keep temporarily for rollback)

---

## Reference files (mobile repo)

| File | Purpose |
|------|---------|
| `supabase/functions/_shared/gemini.ts` | Shared Gemini API client |
| `EDGE_FUNCTIONS_DEPLOY.md` | Secrets and deploy commands |
| `app/privacy-policy.tsx` | In-app privacy (Gemini mention) |
| `docs/INTERVIEW_FLOW.md` | Interview architecture |
| `WEB_TEAM_PRICING_PLANS_HANDOFF.md` | Billing (unchanged by Gemini) |
| `SUB_PROCESSOR_REGISTER.md` | Internal sub-processor register (Anthropic → Google, May 2026) |

---

## Questions?

Contact mobile/backend for:

- Supabase project ref and function deploy status
- Whether `GEMINI_API_KEY` is live in production
- E2E test results after cutover

Contact legal/ops for:

- DPA and sub-processor register updates
