-- Default admin: admin@gmail.com / Admin123 (SHA-256 of "Admin123")
insert into admin_users (email, password_hash)
values ('admin@gmail.com', '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c')
on conflict (email) do update set password_hash = excluded.password_hash;

insert into team_members (name, title, email, phone, photo)
values
  ('Executive Director', 'Executive Director', 'info@uyisenganimanzi.org.rw', '+250 788 729 994', ''),
  ('Programs Manager', 'Programs Manager', 'info@uyisenganimanzi.org.rw', '', ''),
  ('Mental Health Lead', 'Psychosocial & Mental Health Lead', 'info@uyisenganimanzi.org.rw', '', ''),
  ('Child Protection Lead', 'Child Protection Lead', 'info@uyisenganimanzi.org.rw', '', ''),
  ('Economic Empowerment Lead', 'Economic Empowerment Lead', 'info@uyisenganimanzi.org.rw', '', ''),
  ('Finance & Admin', 'Finance & Administration', 'info@uyisenganimanzi.org.rw', '', '')
on conflict do nothing;

insert into programs (title, description, image)
values
  ('Child Protection Program', 'Ensuring the safety and well-being of children through various initiatives.', ''),
  ('Mental Health Support', 'Providing psychosocial support to youth and families.', ''),
  ('Economic Empowerment', 'Empowering communities through economic opportunities.', '')
on conflict do nothing;

insert into gallery_items (title, image, description)
values
  ('Community Event', '/assets/gallery/1.jpg', 'A community gathering.')
on conflict do nothing;

insert into press_room_items (title, summary, category, image)
values
  ('New psychosocial support group launches in Kigali', 'Uyisenga Ni Imanzi has opened a new support circle for youth focused on mental health, trauma recovery and peer connection.', 'News', '/assets/hero.jpg'),
  ('Youth entrepreneurship training begins', 'A new cohort of young entrepreneurs started hands-on business training and seed support in Rugando.', 'News', '/assets/programs.jpg'),
  ('Community healing event brings families together', 'Families from three districts gathered to celebrate resilience and rebuild hope through shared storytelling.', 'News', '/assets/hero.jpg')
on conflict do nothing;

insert into site_content (key, value)
values
  ('mission', '"Our mission is to support Rwandan children, youth, and families."'::jsonb),
  ('vision', '"A future where every child thrives."'::jsonb),
  ('impact', '"We have impacted thousands of lives."'::jsonb),
  ('contact', '{"email":"info@uyisenganimanzi.org.rw","phone":"+250 788 729 994","address":"Kacyiru, Kigali-Rwanda"}'::jsonb),
  ('programsPage', '{"label":"Our Programs","heading":"Uyisenga Ni Imanzi''s Programs","description1":"Since its establishment, Uyisenga Ni Imanzi has implemented various programs to support Rwandan children, youth, and families. Our work focuses on psychosocial support, education, livelihoods and community resilience.","description2":"Through our strategic initiatives, we empower vulnerable populations and foster sustainable development across Rwanda. We prioritize holistic support, community engagement, and evidence-based practices."}'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();
