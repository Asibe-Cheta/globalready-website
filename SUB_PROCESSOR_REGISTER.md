# GlobalReady — Sub-Processor Register (Internal)

**Controller:** GlobalReady, Mastweg 83, 42349 Wuppertal, Germany  
**Last updated:** May 2026  
**Owner:** Ops / Legal  
**Public mirror:** [Privacy Policy](https://globalready.tech/privacy) (user-facing summary)

This register records third parties that process personal data on GlobalReady’s behalf. Update it when vendors change, contracts renew, or new features add processors.

---

## Current sub-processors

| Sub-processor | Purpose | Categories of data processed | Location / notes | Status |
|---------------|---------|------------------------------|------------------|--------|
| **Supabase** | Database, authentication, file storage, Edge Functions hosting | Account data (email, profile), CV/career content, job listings, subscription metadata, usage logs | EU (project region per Supabase dashboard) | Active |
| **Google (Gemini)** | AI text features: CV analysis, tailoring, summaries, cover letters, work-experience assist, interview *feedback*, job matching, notification scoring | CV/résumé text, job descriptions, interview transcripts (feedback only), prompts/outputs | US / global (Google AI Studio / Gemini API — confirm DPA & terms in Google Cloud console) | **Active (from May 2026)** |
| **Vapi** | Live AI voice mock interview sessions | Voice audio, session metadata, transcripts as configured in product | Confirm in Vapi account / DPA | Active |
| **Stripe** | Website card checkout, subscriptions, billing | Email, payment method metadata, transaction IDs, plan type | US / EU (Stripe entity per account) | Active |
| **Selar** | Alternative checkout (mobile app; some web flows) | Email, purchase metadata for plan activation | Nigeria / Selar terms | Active |
| **Vercel** | Website hosting (globalready.tech), serverless API routes | Request logs, env secrets (no CV content stored by default) | US / EU edge (per Vercel plan) | Active |

---

## Change log

| Date | Change | Action taken |
|------|--------|--------------|
| **May 2026** | **Removed:** Anthropic (Claude) as AI sub-processor for CV/job-fit/interview feedback features | Mobile/backend migrated to Google Gemini; `ANTHROPIC_API_KEY` deprecated in Supabase Edge Functions after validation |
| **May 2026** | **Added:** Google (Gemini) for text/JSON AI features | `GEMINI_API_KEY` set in Supabase; privacy policy & terms updated on globalready.tech |
| **May 2026** | **Clarified:** Vapi remains separate for **live voice** interviews; Gemini used for post-session feedback only | Reflected in Privacy Policy and Terms |

---

## Data not sent to AI providers

- Full payment card numbers (handled by Stripe / Selar)
- Passwords (hashed via Supabase Auth)

## Retention / removal

- Follow Privacy Policy and account-deletion process for user-initiated erasure requests.
- When offboarding a sub-processor, record removal date in the change log and verify data deletion or return per contract.

---

## Ops checklist (recurring)

- [ ] Google Cloud / AI Studio: DPA or equivalent accepted; API key access restricted
- [ ] Vapi: DPA / privacy terms on file
- [ ] Stripe & Selar: PCI / payment terms current
- [ ] Supabase: project region and RLS reviewed annually
- [ ] Vercel: env audit — no unused `ANTHROPIC_API_KEY`; only required secrets present
- [ ] This register reviewed when adding a new vendor or feature

---

## Related documents

- `WEB_TEAM_GEMINI_AI_HANDOFF.md` — Gemini migration (May 2026)
- `app/privacy/page.tsx` — public processor table
- `lib/legal.ts` — shared processor list for website copy
