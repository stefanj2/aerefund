-- Public flight delay records
-- Populated automatically when users look up real delayed flights in the funnel.
-- No personal data stored — only flight metadata.

create table if not exists public_delays (
  id           bigserial primary key,
  iata         text        not null,          -- airline IATA prefix, e.g. 'KL'
  flight_number text       not null,          -- e.g. 'KL1234'
  origin       text        not null,          -- departure airport IATA
  destination  text        not null,          -- arrival airport IATA
  route        text        not null,          -- display string 'AMS → BCN'
  delay_minutes integer    not null,          -- actual delay in minutes
  delay_label  text        not null,          -- display string '4u 15m'
  compensation integer     not null,          -- EC 261 amount in euros (250/400/600)
  flight_date  date        not null,
  created_at   timestamptz not null default now()
);

-- Deduplicate: same flight on the same day only stored once
create unique index if not exists public_delays_unique
  on public_delays (flight_number, flight_date);

-- Fast lookup per airline
create index if not exists public_delays_iata_date
  on public_delays (iata, flight_date desc);

-- Auto-clean entries older than 90 days (run as a cron or pg_cron)
-- Alternatively handled in the cron job.
