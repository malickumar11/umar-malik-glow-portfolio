-- Update the handle_new_user function to automatically create admin profile
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