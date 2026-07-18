
-- Storage policies for datasets bucket (owner-scoped path like <uid>/...)
CREATE POLICY "Users read own dataset files" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'datasets' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users upload own dataset files" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'datasets' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own dataset files" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'datasets' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own dataset files" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'datasets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Harden touch_updated_at (search path)
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Restrict handle_new_user execution (SECURITY DEFINER only runs from trigger)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
