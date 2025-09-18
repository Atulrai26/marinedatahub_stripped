-- Location: supabase/migrations/20250914135930_marine_auth_system.sql
-- Schema Analysis: FRESH_PROJECT - No existing schema detected
-- Integration Type: NEW_MODULE - Complete authentication system
-- Dependencies: auth.users (Supabase managed)

-- 1. Types
CREATE TYPE public.user_role AS ENUM ('admin', 'researcher', 'analyst', 'viewer');
CREATE TYPE public.account_status AS ENUM ('active', 'suspended', 'pending');

-- 2. Core Tables
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    organization TEXT,
    role public.user_role DEFAULT 'researcher'::public.user_role,
    account_status public.account_status DEFAULT 'active'::public.account_status,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Essential Indexes
CREATE INDEX idx_user_profiles_id ON public.user_profiles(id);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_status ON public.user_profiles(account_status);

-- 4. Functions (MUST be created before RLS policies)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id, 
    email, 
    full_name, 
    organization,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'organization', NULL),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'researcher'::public.user_role)
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_user_profile_updated()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- 5. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies (Pattern 1: Core User Table - Simple only)
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Allow users to view other profiles for collaboration features
CREATE POLICY "users_can_view_other_profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (account_status = 'active'::public.account_status);

-- Admin access policy using auth metadata (Pattern 6A: Safe admin access)
CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' = 'admin' 
         OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

CREATE POLICY "admin_full_access_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- 7. Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_user_profile_updated
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_profile_updated();

-- 8. Mock Data for Testing
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    researcher_uuid UUID := gen_random_uuid();
    analyst_uuid UUID := gen_random_uuid();
BEGIN
    -- Create complete auth.users records (required for proper authentication)
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@marine.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Marine Admin", "organization": "Marine Data Hub", "role": "admin"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (researcher_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'researcher@marine.com', crypt('researcher123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Dr. Marine Researcher", "organization": "Ocean Research Institute", "role": "researcher"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (analyst_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'analyst@marine.com', crypt('analyst123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Data Analyst", "organization": "Marine Analytics Corp", "role": "analyst"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- User profiles will be created automatically via trigger
    
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 9. Helper functions for application
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT COALESCE(up.role::TEXT, 'viewer'::TEXT)
FROM public.user_profiles up
WHERE up.id = user_uuid;
$$;

CREATE OR REPLACE FUNCTION public.is_user_active(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT COALESCE(up.account_status = 'active'::public.account_status, false)
FROM public.user_profiles up
WHERE up.id = user_uuid;
$$;

-- Comments
COMMENT ON TABLE public.user_profiles IS 'User profile information linked to auth.users';
COMMENT ON COLUMN public.user_profiles.id IS 'Foreign key to auth.users.id';
COMMENT ON COLUMN public.user_profiles.role IS 'User role for access control';
COMMENT ON COLUMN public.user_profiles.account_status IS 'Account status for user management';