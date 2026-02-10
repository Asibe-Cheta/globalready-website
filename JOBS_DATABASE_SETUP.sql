-- Jobs & In-Demand Roles — Database Setup
-- Run this in the Supabase SQL Editor. Creates in_demand_roles, RLS on jobs/saved_jobs, RPCs, and seeds.

-- ============================================================
-- 1. Create jobs table (if not exists)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  country TEXT,
  city TEXT,
  job_type TEXT,
  sector TEXT,
  visa_sponsorship TEXT,
  salary_range TEXT,
  description TEXT,
  apply_url TEXT,
  posted_date TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  requirements JSONB DEFAULT '{}'::jsonb,
  view_count INTEGER DEFAULT 0,
  application_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Public read for active jobs only (mobile app feed)
DROP POLICY IF EXISTS "Public can view active jobs" ON public.jobs;
CREATE POLICY "Public can view active jobs"
  ON public.jobs FOR SELECT
  USING (is_active = true);

-- ============================================================
-- 2. Create saved_jobs table (if not exists)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

-- Users can manage their own saved jobs
DROP POLICY IF EXISTS "Users can insert own saved_jobs" ON public.saved_jobs;
CREATE POLICY "Users can insert own saved_jobs"
  ON public.saved_jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can select own saved_jobs" ON public.saved_jobs;
CREATE POLICY "Users can select own saved_jobs"
  ON public.saved_jobs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own saved_jobs" ON public.saved_jobs;
CREATE POLICY "Users can delete own saved_jobs"
  ON public.saved_jobs FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS saved_jobs_user_id_idx ON public.saved_jobs (user_id);
CREATE INDEX IF NOT EXISTS saved_jobs_job_id_idx ON public.saved_jobs (job_id);

-- ============================================================
-- 3. Create in_demand_roles table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.in_demand_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rank INTEGER NOT NULL,
  title TEXT NOT NULL,
  icon TEXT NOT NULL,
  accent_color TEXT DEFAULT '#3b82f6',
  reason TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(rank)
);

ALTER TABLE public.in_demand_roles ENABLE ROW LEVEL SECURITY;

-- Public read for active roles only
DROP POLICY IF EXISTS "Public can view active in_demand_roles" ON public.in_demand_roles;
CREATE POLICY "Public can view active in_demand_roles"
  ON public.in_demand_roles FOR SELECT
  USING (is_active = true);

-- ============================================================
-- 4. Seed Top 10 In-Demand Tech Roles
-- ============================================================
INSERT INTO public.in_demand_roles (rank, title, icon, accent_color, reason, is_active) VALUES
  (1,  'Software Developer',      'code',             '#3b82f6', 'Critical for building and maintaining applications across industries.', true),
  (2,  'Data Scientist',          'analytics',        '#8b5cf6', 'Demand for data-driven decision making continues to grow.', true),
  (3,  'Cybersecurity Analyst',    'shield',           '#ef4444', 'Organizations prioritize protecting systems and data.', true),
  (4,  'Cloud Engineer',          'cloud',            '#0ea5e9', 'Cloud adoption drives need for infrastructure and DevOps skills.', true),
  (5,  'DevOps Specialist',       'settings',         '#10b981', 'Bridges development and operations for faster delivery.', true),
  (6,  'AI/ML Engineer',          'psychology',       '#ec4899', 'AI and machine learning are transforming every sector.', true),
  (7,  'UI/UX Designer',          'design-services',  '#f59e0b', 'User experience is a key differentiator for products.', true),
  (8,  'Full Stack Engineer',     'layers',           '#06b6d4', 'Versatile developers who can work across the stack.', true),
  (9,  'Mobile App Developer',    'smartphone',       '#6366f1', 'Mobile-first experiences remain in high demand.', true),
  (10, 'IT Systems Architect',     'account-tree',      '#84cc16', 'Designs and oversees complex technology systems.', true)
ON CONFLICT (rank) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  accent_color = EXCLUDED.accent_color,
  reason = EXCLUDED.reason,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- ============================================================
-- 5. RPC: Increment job view count
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_job_views(job_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.jobs SET view_count = COALESCE(view_count, 0) + 1 WHERE id = job_uuid;
END;
$$;

-- ============================================================
-- 6. RPC: Increment job application count
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_job_applications(job_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.jobs SET application_count = COALESCE(application_count, 0) + 1 WHERE id = job_uuid;
END;
$$;
