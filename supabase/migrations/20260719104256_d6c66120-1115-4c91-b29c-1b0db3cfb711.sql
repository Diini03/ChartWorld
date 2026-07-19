-- Allow authenticated users to read all profiles for @mention lookups
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
CREATE POLICY "Authenticated read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);