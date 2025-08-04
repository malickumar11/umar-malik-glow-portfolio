-- Create admin user signup function that bypasses email confirmation
CREATE OR REPLACE FUNCTION public.create_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Insert admin user directly if not exists
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    role,
    aud,
    confirmation_token,
    email_confirm_status
  )
  VALUES (
    gen_random_uuid(),
    'malickirfan00@gmail.com',
    crypt('Irfan@123#13', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated',
    'authenticated',
    '',
    1
  )
  ON CONFLICT (email) 
  DO UPDATE SET
    email_confirmed_at = now(),
    email_confirm_status = 1
  RETURNING id INTO admin_user_id;

  -- Create or update profile
  INSERT INTO public.profiles (user_id, email, role)
  VALUES (admin_user_id, 'malickirfan00@gmail.com', 'admin')
  ON CONFLICT (user_id) 
  DO UPDATE SET role = 'admin';
END;
$$;

-- Execute the function
SELECT public.create_admin_user();