-- Legal workflow: extra kolommen voor escalatie, consent PDF, en dynamische documenten
-- Handmatig uitvoeren in Supabase SQL Editor

ALTER TABLE claims ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS consent_pdf_filename TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS claim_filed_at TIMESTAMPTZ;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS airline_reminder_1_sent_at TIMESTAMPTZ;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS airline_reminder_2_sent_at TIMESTAMPTZ;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS airline_reminder_3_sent_at TIMESTAMPTZ;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS verjaring_warned_at TIMESTAMPTZ;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS escalated_at TIMESTAMPTZ;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS escalated_to TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS auto_status_suggestion TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS cancellation_notice_filename TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS denial_notice_filename TEXT;

-- Indexes voor escalation cron
CREATE INDEX IF NOT EXISTS idx_claims_claim_filed ON claims (claim_filed_at) WHERE claim_filed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_claims_status_filed ON claims (status) WHERE status = 'claim_filed';
