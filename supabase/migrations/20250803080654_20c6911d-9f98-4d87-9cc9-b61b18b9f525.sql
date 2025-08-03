-- Create admin user if not exists
-- Note: Since we can't directly insert into auth.users, we'll create a signup trigger
-- and insert profile for existing admin email when they sign up

-- Create or update the admin profile when admin user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, role)
  VALUES (
    NEW.id, 
    NEW.email,
    CASE 
      WHEN NEW.email = 'malickirfan00@gmail.com' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$function$;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update projects to have better sample data showing on home
UPDATE public.projects 
SET show_on_home = true, 
    is_featured = true,
    brand_name = CASE 
      WHEN title LIKE '%E-commerce%' THEN 'Nike Store'
      WHEN title LIKE '%Fashion%' THEN 'Adidas Fashion'
      WHEN title LIKE '%Product%' THEN 'Apple Inc.'
      WHEN title LIKE '%SaaS%' THEN 'Microsoft Corp'
      ELSE brand_name
    END,
    client_name = CASE 
      WHEN title LIKE '%E-commerce%' THEN 'Nike Global Team'
      WHEN title LIKE '%Fashion%' THEN 'Adidas Digital'
      WHEN title LIKE '%Product%' THEN 'Apple Marketing'
      WHEN title LIKE '%SaaS%' THEN 'Microsoft Azure'
      ELSE client_name
    END
WHERE id IN (SELECT id FROM public.projects LIMIT 4);