-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);

-- Create policies for project images bucket
CREATE POLICY "Project images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'project-images');

CREATE POLICY "Admins can upload project images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'project-images' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update project images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'project-images' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete project images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'project-images' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Update projects table to add multiple image support and social date
ALTER TABLE projects 
ADD COLUMN images jsonb DEFAULT '[]'::jsonb,
ADD COLUMN social_date timestamp with time zone;

-- Update project_categories to ensure we have the three required categories
INSERT INTO project_categories (name, slug, description) VALUES 
('Graphic Design', 'graphic-design', 'Creative visual design projects'),
('Website Development', 'website-development', 'Web development and design projects'),
('Video Editing', 'video-editing', 'Video production and editing projects')
ON CONFLICT (slug) DO NOTHING;