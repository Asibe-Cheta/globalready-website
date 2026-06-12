export const OPERATOR_IDENTITY =
  'GlobalReady, Mastweg 83, 42349 Wuppertal, Germany'

export const AI_DISCLOSURE =
  'AI-generated feedback and suggestions are for informational and training purposes only and may not always be accurate or suitable for every situation.'

export const AI_THIRD_PARTY_NOTICE =
  'If we use third-party AI service providers (including Google Gemini for CV, job-fit, and interview feedback features), they may process limited data on our behalf to provide those features. We do not sell your data to AI providers.'

export const AI_VOICE_NOTICE =
  'Live mock interview voice sessions are powered by Vapi. Post-session interview feedback reports may be generated using Google Gemini.'

export const AI_PROCESSORS = [
  {
    service: 'Google (Gemini)',
    purpose: 'AI-powered CV analysis, tailoring, summaries, cover letters, and interview feedback',
  },
  {
    service: 'Vapi',
    purpose: 'AI voice mock interview sessions',
  },
  {
    service: 'Stripe',
    purpose: 'Payment processing',
  },
  {
    service: 'Supabase',
    purpose: 'Database, authentication, and storage (EU)',
  },
] as const
