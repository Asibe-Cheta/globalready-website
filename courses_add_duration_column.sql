-- Quick fix: Add missing 'duration' column to courses (e.g. "8 weeks")
-- Run this in Supabase SQL Editor if you see: "Could not find the 'duration' column of 'courses' in the schema cache"
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS duration TEXT;
