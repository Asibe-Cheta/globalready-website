-- Courses (path_category, icon, tint_color, display_order) + virtual_sessions table
-- Run in Supabase SQL Editor. Mobile app reads from both tables.

-- ============================================================
-- 1. Add path/display columns to courses (for admin + mobile)
-- ============================================================
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS path_category TEXT,
  ADD COLUMN IF NOT EXISTS icon TEXT,
  ADD COLUMN IF NOT EXISTS tint_color TEXT DEFAULT '#0d6cf2',
  ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- path_category: one of side_hustle, tech_career, language (enforced in app)
COMMENT ON COLUMN public.courses.path_category IS 'One of: side_hustle, tech_career, language';

-- ============================================================
-- 2. Create virtual_sessions table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.virtual_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  session_date TIMESTAMPTZ NOT NULL,
  timezone TEXT DEFAULT 'GMT',
  location TEXT,
  meeting_link TEXT,
  duration_minutes INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.virtual_sessions ENABLE ROW LEVEL SECURITY;

-- Public read for active sessions (mobile app)
DROP POLICY IF EXISTS "Public can view active virtual_sessions" ON public.virtual_sessions;
CREATE POLICY "Public can view active virtual_sessions"
  ON public.virtual_sessions FOR SELECT
  USING (is_active = true);

CREATE INDEX IF NOT EXISTS idx_virtual_sessions_course_id ON public.virtual_sessions (course_id);
CREATE INDEX IF NOT EXISTS idx_virtual_sessions_session_date ON public.virtual_sessions (session_date);
