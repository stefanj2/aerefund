-- Aerefund — volledige database setup
-- Kopieer en plak dit in Supabase Dashboard → SQL Editor → New query → Run

-- ── Tabel aanmaken ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS claims (
  id                   UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  token                VARCHAR(10)   UNIQUE NOT NULL,
  status               VARCHAR(50)   NOT NULL DEFAULT 'result_viewed',

  -- Vlucht + compensatie
  flight_data          JSONB,
  compensation         JSONB,
  passengers           INTEGER,

  -- Klantgegevens
  first_name           VARCHAR(100),
  last_name            VARCHAR(100),
  email                VARCHAR(255),
  phone                VARCHAR(50),
  address              VARCHAR(255),
  postal_code          VARCHAR(20),
  city                 VARCHAR(100),
  iban                 VARCHAR(50),

  -- Documenten + medereizgers
  co_passengers        JSONB         DEFAULT '[]'::jsonb,
  boarding_pass_filename VARCHAR(500),

  -- Admin kolommen
  notes                JSONB         DEFAULT '[]'::jsonb,
  admin_notes          TEXT,
  invoice_number       VARCHAR(50),
  paid_at              TIMESTAMPTZ,

  -- Tijdstempels
  submitted_at         TIMESTAMPTZ,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- ── Kolommen toevoegen als tabel al bestaat ────────────────────────────────────
ALTER TABLE claims ADD COLUMN IF NOT EXISTS notes            JSONB        DEFAULT '[]'::jsonb;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS admin_notes      TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS invoice_number   VARCHAR(50);
ALTER TABLE claims ADD COLUMN IF NOT EXISTS paid_at          TIMESTAMPTZ;

-- ── Indexen ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS claims_status_idx       ON claims(status);
CREATE INDEX IF NOT EXISTS claims_token_idx        ON claims(token);
CREATE INDEX IF NOT EXISTS claims_email_idx        ON claims(email);
CREATE INDEX IF NOT EXISTS claims_created_at_idx   ON claims(created_at DESC);
CREATE INDEX IF NOT EXISTS claims_submitted_at_idx ON claims(submitted_at DESC NULLS LAST);

-- ── Row Level Security (optioneel maar aanbevolen) ────────────────────────────
-- Schakel RLS uit zodat de service-role key altijd volledige toegang heeft
ALTER TABLE claims DISABLE ROW LEVEL SECURITY;
