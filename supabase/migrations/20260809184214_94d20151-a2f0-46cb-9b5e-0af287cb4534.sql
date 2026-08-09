ALTER TABLE public.programs
  ADD COLUMN IF NOT EXISTS has_image boolean GENERATED ALWAYS AS (image IS NOT NULL AND image <> '') STORED,
  ADD COLUMN IF NOT EXISTS has_cover boolean GENERATED ALWAYS AS (cover_image IS NOT NULL AND cover_image <> '') STORED;

ALTER TABLE public.sub_programs
  ADD COLUMN IF NOT EXISTS has_image boolean GENERATED ALWAYS AS (image IS NOT NULL AND image <> '') STORED,
  ADD COLUMN IF NOT EXISTS has_cover boolean GENERATED ALWAYS AS (cover_image IS NOT NULL AND cover_image <> '') STORED;

ALTER TABLE public.press_room_items
  ADD COLUMN IF NOT EXISTS has_image boolean GENERATED ALWAYS AS (image IS NOT NULL AND image <> '') STORED,
  ADD COLUMN IF NOT EXISTS has_cover boolean GENERATED ALWAYS AS (cover_image IS NOT NULL AND cover_image <> '') STORED;

ALTER TABLE public.gallery_items
  ADD COLUMN IF NOT EXISTS has_image boolean GENERATED ALWAYS AS (image IS NOT NULL AND image <> '') STORED,
  ADD COLUMN IF NOT EXISTS has_cover boolean GENERATED ALWAYS AS (cover_image IS NOT NULL AND cover_image <> '') STORED;