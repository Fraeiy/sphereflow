-- SphereFlow Treasury Schema
-- Run in Supabase SQL editor when connecting to production backend

create extension if not exists "uuid-ossp";

create table if not exists treasury_policies (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null unique,
  reserve_balance numeric not null default 0,
  daily_spend_limit numeric not null default 100,
  weekly_spend_limit numeric not null default 500,
  monthly_budget numeric not null default 2000,
  max_single_transaction numeric not null default 50,
  auto_approve_threshold numeric not null default 10,
  allowed_wallets text[] default '{}',
  blocked_wallets text[] default '{}',
  emergency_freeze boolean not null default false,
  version integer not null default 1,
  updated_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  type text not null,
  recipient text not null,
  amount numeric not null,
  status text not null default 'pending',
  category text not null default 'Operations',
  memo text,
  scheduled_at timestamptz,
  executed_at timestamptz,
  transfer_id text,
  delivery_pending boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists activity_log (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  type text not null,
  title text not null,
  description text not null,
  metadata jsonb,
  timestamp timestamptz not null default now()
);

create table if not exists chat_messages (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  role text not null,
  content text not null,
  plan jsonb,
  timestamp timestamptz not null default now()
);

create table if not exists policy_history (
  id uuid primary key default uuid_generate_v4(),
  policy_id uuid references treasury_policies(id),
  changes jsonb not null,
  source text not null default 'manual',
  timestamp timestamptz not null default now()
);

create index if not exists idx_payments_user on payments(user_id);
create index if not exists idx_activity_user on activity_log(user_id);
create index if not exists idx_chat_user on chat_messages(user_id);