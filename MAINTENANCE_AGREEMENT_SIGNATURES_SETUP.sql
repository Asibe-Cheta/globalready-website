-- Maintenance Agreement Digital Signatures
-- Run this in the Supabase SQL Editor before using /sign/maintenance-agreement.

CREATE TABLE IF NOT EXISTS public.maintenance_agreement_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_ref TEXT UNIQUE NOT NULL,
  justice_signature TEXT,
  justice_signed_at TIMESTAMPTZ,
  client_signature TEXT,
  client_name TEXT,
  client_title TEXT,
  client_signed_at TIMESTAMPTZ,
  is_fully_executed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS maintenance_agreement_signatures_ref_idx
  ON public.maintenance_agreement_signatures (agreement_ref);

ALTER TABLE public.maintenance_agreement_signatures ENABLE ROW LEVEL SECURITY;

-- Signatures are written through server-side API routes using the service role key.
-- No public table policies are needed.
