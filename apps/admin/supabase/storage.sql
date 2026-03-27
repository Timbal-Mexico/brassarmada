insert into storage.buckets (id, name, public)
values
  ('artists-public', 'artists-public', true),
  ('artists-private', 'artists-private', false)
on conflict (id) do nothing;

create policy "artists_public_read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'artists-public');

create policy "artists_public_write_own_folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'artists-public'
  and owner = auth.uid()
  and name like auth.uid() || '/%'
);

create policy "artists_public_update_own_folder"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'artists-public'
  and owner = auth.uid()
  and name like auth.uid() || '/%'
)
with check (
  bucket_id = 'artists-public'
  and owner = auth.uid()
  and name like auth.uid() || '/%'
);

create policy "artists_public_delete_own_folder"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'artists-public'
  and owner = auth.uid()
  and name like auth.uid() || '/%'
);

create policy "artists_private_read_own_folder"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'artists-private'
  and owner = auth.uid()
  and name like auth.uid() || '/%'
);

create policy "artists_private_write_own_folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'artists-private'
  and owner = auth.uid()
  and name like auth.uid() || '/%'
);

create policy "artists_private_update_own_folder"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'artists-private'
  and owner = auth.uid()
  and name like auth.uid() || '/%'
)
with check (
  bucket_id = 'artists-private'
  and owner = auth.uid()
  and name like auth.uid() || '/%'
);

create policy "artists_private_delete_own_folder"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'artists-private'
  and owner = auth.uid()
  and name like auth.uid() || '/%'
);

