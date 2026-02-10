-- Quick fix: Add missing columns to courses (run in Supabase SQL Editor if Add course fails with schema cache errors)
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS duration TEXT,
  ADD COLUMN IF NOT EXISTS image_url TEXT;
