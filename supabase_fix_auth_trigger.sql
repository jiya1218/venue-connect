-- Fix for "Database error saving new user" during registration
-- The issue occurs because the trigger executes as the anon/unauthenticated user during creation,
-- but the `profiles` table has RLS enabled with no INSERT policy for anon users.
-- Adding "SECURITY DEFINER" ensures the function runs with postgres (admin) privileges.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user'
  );
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists and uses the fixed function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
