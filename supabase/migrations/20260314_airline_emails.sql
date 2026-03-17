-- Stores airline email responses (both manual entries and inbound webhook)
ALTER TABLE claims ADD COLUMN IF NOT EXISTS airline_emails JSONB DEFAULT '[]'::jsonb;
