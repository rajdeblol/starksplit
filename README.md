# StarkSplit

## What is StarkSplit
StarkSplit is a gasless onchain bill splitting app built for Starknet mainnet. Create a shared bill, send each participant a personal pay link, and keep immutable payment proof onchain.

## Demo
![Demo GIF Placeholder](./public/demo.gif)

## How it works
- Create a bill with total amount, currency, and participant list.
- StarkSplit stores bill metadata in Supabase and creates unique participant pay links.
- Participants pay via one-click gasless transaction through Starkzap, which records payment on the Cairo contract.
- The backend updates payment status in Supabase and the creator dashboard reflects live paid/unpaid progress.

## Built with
- Next.js
- Starkzap SDK
- Cairo
- Supabase
- Starknet

## Deploy your own
1. Clone repo
2. Install deps: `npm install`
3. Set env vars from `.env.local.example`
4. Deploy Cairo contract on Starknet mainnet and set `NEXT_PUBLIC_CONTRACT_ADDRESS`
5. Deploy frontend: `npx vercel`

## Supabase schema

```sql
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
  bill_id uuid references bills(id),
  name text not null,
  share_amount numeric not null,
  wallet_address text,
  paid boolean default false,
  tx_hash text,
  paid_at timestamptz,
  created_at timestamptz default now()
);
```
