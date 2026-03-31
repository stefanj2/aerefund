CREATE TABLE IF NOT EXISTS public.funnel_events (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event             TEXT        NOT NULL,
  claim_type        TEXT,
  iata_prefix       TEXT,
  amount_per_person INTEGER,
  is_manual         BOOLEAN,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS funnel_events_event_created ON public.funnel_events (event, created_at);
CREATE INDEX IF NOT EXISTS funnel_events_created ON public.funnel_events (created_at);
