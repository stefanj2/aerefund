-- Add id_copy_filename column for ID/passport copy uploaded via /aanvullen
ALTER TABLE claims ADD COLUMN IF NOT EXISTS id_copy_filename TEXT;
