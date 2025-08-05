-- Add draft status to projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';

-- Create enum for project status
DO $$ BEGIN
  CREATE TYPE project_status AS ENUM ('draft', 'published');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Update the status column to use the enum (after creating enum)
ALTER TABLE public.projects ALTER COLUMN status TYPE project_status USING status::project_status;
ALTER TABLE public.projects ALTER COLUMN status SET DEFAULT 'published';