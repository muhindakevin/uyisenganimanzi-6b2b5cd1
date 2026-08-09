ALTER TABLE public.press_room_items
  ADD COLUMN IF NOT EXISTS has_document boolean GENERATED ALWAYS AS (document IS NOT NULL AND document <> '') STORED;