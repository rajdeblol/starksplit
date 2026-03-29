create extension if not exists pgcrypto;

create table if not exists bills (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  total_amount numeric not null,
  currency text default 'STRK',
  creator_address text,
  contract_bill_id text,
  status text default 'open',
  created_at timestamptz default now()
);

create table if not exists participants (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid references bills(id) on delete cascade,
  name text not null,
  share_amount numeric not null,
  wallet_address text,
  paid boolean default false,
  tx_hash text,
  paid_at timestamptz,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table bills enable row level security;
alter table participants enable row level security;

-- Performance Indexes
create index if not exists idx_bills_slug on bills(slug);
create index if not exists idx_participants_bill_id on participants(bill_id);

-- Simple RLS Policies (Public Read Access)
create policy "Allow public read access on bills" on bills
  for select using (true);

create policy "Allow public read access on participants" on participants
  for select using (true);

-- API/Service Role can do everything (default in Supabase)
