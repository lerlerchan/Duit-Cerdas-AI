-- Enable the pgvector extension to work with embeddings
create extension if not exists vector;

-- 1. Users table
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  dob date not null,
  bazi_element text check (bazi_element in ('Wood', 'Fire', 'Earth', 'Metal', 'Water')),
  risk_level text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Scam Patterns table for RAG
create table if not exists public.scam_patterns (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  embedding vector(1536), -- Dimension for text-embedding-004 or similar
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Simulations table
create table if not exists public.simulations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  scenario_title text not null,
  scammer_message text not null,
  choices jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Function for similarity search
create or replace function match_scam_patterns (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    scam_patterns.id,
    scam_patterns.content,
    scam_patterns.metadata,
    1 - (scam_patterns.embedding <=> query_embedding) as similarity
  from scam_patterns
  where 1 - (scam_patterns.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;
