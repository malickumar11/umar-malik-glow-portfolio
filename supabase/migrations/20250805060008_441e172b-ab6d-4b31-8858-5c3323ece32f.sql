-- Fix the column type issue and add draft functionality
-- First, add the column as project_status type directly
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS status project_status;

-- Set default value for status column
UPDATE public.projects SET status = 'published' WHERE status IS NULL;

-- Set default for future inserts
ALTER TABLE public.projects ALTER COLUMN status SET DEFAULT 'published';