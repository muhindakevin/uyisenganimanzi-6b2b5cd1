
create policy "team write" on public.team_members for all to anon, authenticated using (true) with check (true);
create policy "programs write" on public.programs for all to anon, authenticated using (true) with check (true);
create policy "gallery write" on public.gallery_items for all to anon, authenticated using (true) with check (true);
create policy "press write" on public.press_room_items for all to anon, authenticated using (true) with check (true);
create policy "site content write" on public.site_content for all to anon, authenticated using (true) with check (true);
create policy "contact read" on public.contact_messages for select to anon, authenticated using (true);
create policy "contact delete" on public.contact_messages for delete to anon, authenticated using (true);
grant insert, update, delete on public.team_members, public.programs, public.gallery_items, public.press_room_items to anon, authenticated;
grant insert, update, delete on public.site_content to anon, authenticated;
grant select, delete on public.contact_messages to anon, authenticated;
