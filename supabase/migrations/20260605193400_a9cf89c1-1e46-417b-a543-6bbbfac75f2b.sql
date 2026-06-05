
ALTER FUNCTION public.set_updated_at() SET search_path = public;
ALTER FUNCTION public.bump_support_count() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.bump_support_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- Storage policies for report-images bucket
CREATE POLICY "Report images public read" ON storage.objects FOR SELECT USING (bucket_id = 'report-images');
CREATE POLICY "Users upload own report images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'report-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own report images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'report-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own report images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'report-images' AND auth.uid()::text = (storage.foldername(name))[1]);
