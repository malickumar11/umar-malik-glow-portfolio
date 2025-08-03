-- Ensure admin user exists in profiles (in case signup didn't trigger the function)
INSERT INTO public.profiles (user_id, email, role)
SELECT 
  id,
  email,
  'admin'
FROM auth.users 
WHERE email = 'malickirfan00@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Create tables for services and reviews
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  icon text,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name text NOT NULL,
  client_image text,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  project_type text,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for services
CREATE POLICY "Services are viewable by everyone" 
ON public.services 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify services" 
ON public.services 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- RLS policies for reviews
CREATE POLICY "Reviews are viewable by everyone" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify reviews" 
ON public.reviews 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Update projects table to add more fields for admin management
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS client_name text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS project_date timestamp with time zone;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS social_links jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS thumbnail_url text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS show_on_home boolean DEFAULT false;

-- Add triggers for updated_at
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample services
INSERT INTO public.services (title, description, icon, is_featured) VALUES
('UI/UX Design', 'Creating intuitive and beautiful user experiences that convert visitors into customers.', 'Monitor', true),
('Video Editing', 'Professional video editing, including color grading, motion graphics, and storytelling.', 'Film', true),
('Graphic Design', 'Visual communication through typography, photography, and illustration.', 'Palette', true),
('Web Development', 'Building fast, responsive websites with modern technologies and best practices.', 'Code', true);

-- Insert sample reviews  
INSERT INTO public.reviews (client_name, rating, review_text, project_type, is_featured) VALUES
('Nike Design Team', 5, 'Outstanding work on our brand identity refresh. The attention to detail and creative vision exceeded our expectations.', 'Graphic Design', true),
('TechCorp CEO', 5, 'The website redesign increased our conversion rate by 40%. Professional, efficient, and results-driven.', 'Website Development', true),
('Creative Director', 5, 'Instagram reels that actually convert! Our engagement went through the roof.', 'Instagram Reels', true);

-- Update existing projects with show_on_home flag
UPDATE public.projects SET show_on_home = true WHERE is_featured = true;