-- Payout tracking columns voor directe uitbetaling model
-- Uitvoeren via: https://supabase.com/dashboard/project/klvlrkzwfteyhvufeanj/sql/new

ALTER TABLE claims
  ADD COLUMN IF NOT EXISTS payout_status        text           DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payout_amount        numeric(10,2)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS payout_net_amount    numeric(10,2)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS payout_received_at   timestamptz    DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS payout_sent_at       timestamptz    DEFAULT NULL;

-- payout_amount = bruto ontvangen van airline (bijv. 250.00)
-- payout_net_amount = netto naar klant (bruto - 42 - 10%), handmatig override mogelijk

CREATE INDEX IF NOT EXISTS idx_claims_payout_status
  ON claims (payout_status, status)
  WHERE status IN ('won', 'compensation_paid');
