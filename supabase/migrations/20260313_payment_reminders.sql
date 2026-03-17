-- Migration: payment reminder tracking columns
-- Run via Supabase dashboard SQL editor:
-- https://supabase.com/dashboard/project/klvlrkzwfteyhvufeanj/sql/new

ALTER TABLE claims
  ADD COLUMN IF NOT EXISTS payment_status           text        DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_reminder_1_sent_at timestamptz DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS payment_reminder_2_sent_at timestamptz DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS payment_reminder_3_sent_at timestamptz DEFAULT NULL;

-- Index so the cron query stays fast
CREATE INDEX IF NOT EXISTS idx_claims_payment_reminders
  ON claims (status, payment_status, submitted_at)
  WHERE status = 'submitted' AND payment_status != 'paid';
