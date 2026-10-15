-- Apply in a private Supabase project's SQL editor. Keep service role key on server only.
create table if not exists public.portfolio_documents (
  key text primary key check(key in ('site','milestones','mindTopics','skills','projects')),
  draft jsonb,
  published jsonb,
  revision integer not null default 0,
  updated_at timestamptz not null default now()
);
create table if not exists public.portfolio_otp (
  email text primary key,
  code_hash text not null,
  expires_at timestamptz not null,
  attempts integer not null default 0
);
create table if not exists public.portfolio_inbox (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  message text not null,
  provider_id text,
  created_at timestamptz not null default now()
);
create table if not exists public.portfolio_limits (
  key text primary key,
  window_start timestamptz not null,
  hits integer not null
);
create or replace function public.consume_rate_limit(p_key text,p_limit integer,p_window_seconds integer)
returns boolean language plpgsql security definer set search_path=public as $$
declare n integer;
begin
 if length(p_key)>180 or p_limit<1 or p_window_seconds<1 then return false; end if;
 insert into portfolio_limits(key,window_start,hits) values(p_key,now(),1)
 on conflict(key) do update set
 hits=case when portfolio_limits.window_start<now()-make_interval(secs=>p_window_seconds) then 1 else portfolio_limits.hits+1 end,
 window_start=case when portfolio_limits.window_start<now()-make_interval(secs=>p_window_seconds) then now() else portfolio_limits.window_start end
 returning hits into n;
 return n<=p_limit;
end $$;
revoke all on public.portfolio_documents,public.portfolio_otp,public.portfolio_inbox,public.portfolio_limits from anon,authenticated;
revoke all on function public.consume_rate_limit(text,integer,integer) from public,anon,authenticated;
grant execute on function public.consume_rate_limit(text,integer,integer) to service_role;
-- Create a *public* portfolio-media Storage bucket in the Supabase dashboard.
-- Admin uploads require the service role key; no direct visitor uploads.

-- Atomic revision guard: two editors cannot overwrite each other after the same read.
create or replace function public.save_portfolio_document(p_key text,p_draft jsonb,p_published jsonb,p_revision integer)
returns setof public.portfolio_documents language plpgsql security definer set search_path=public as $$
begin
 if p_revision=0 then
  return query insert into portfolio_documents(key,draft,published,revision)
   values(p_key,p_draft,p_published,1) on conflict(key) do nothing returning *;
 else
  return query update portfolio_documents set draft=p_draft,published=p_published,
   revision=p_revision+1,updated_at=now() where key=p_key and revision=p_revision returning *;
 end if;
end $$;
-- A code can create at most one session, even with simultaneous correct requests.
create or replace function public.consume_portfolio_otp(p_email text,p_hash text)
returns boolean language plpgsql security definer set search_path=public as $$
declare entry portfolio_otp%rowtype;
begin
 select * into entry from portfolio_otp where email=p_email for update;
 if not found or entry.attempts>=5 or entry.expires_at<=now() then return false; end if;
 if entry.code_hash=p_hash then delete from portfolio_otp where email=p_email;return true; end if;
 update portfolio_otp set attempts=attempts+1 where email=p_email;
 return false;
end $$;
revoke all on function public.save_portfolio_document(text,jsonb,jsonb,integer) from public,anon,authenticated;
revoke all on function public.consume_portfolio_otp(text,text) from public,anon,authenticated;
grant execute on function public.save_portfolio_document(text,jsonb,jsonb,integer) to service_role;
grant execute on function public.consume_portfolio_otp(text,text) to service_role;
alter table public.portfolio_documents enable row level security;
alter table public.portfolio_otp enable row level security;
alter table public.portfolio_inbox enable row level security;
alter table public.portfolio_limits enable row level security;

-- Private revision snapshots are created in the same transaction as the edit.
create table if not exists public.portfolio_history (
 id bigint generated always as identity primary key,
 key text not null,
 revision integer not null,
 action text not null,
 snapshot jsonb not null,
 created_at timestamptz not null default now()
);
alter table public.portfolio_history enable row level security;
revoke all on public.portfolio_history from anon,authenticated;
create or replace function public.record_portfolio_revision()
returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into portfolio_history(key,revision,action,snapshot)
 values(new.key,new.revision,case when tg_op='INSERT' then 'created' when new.published is distinct from old.published then 'published' else 'draft updated' end,to_jsonb(new));
 return new;
end $$;
revoke all on function public.record_portfolio_revision() from public,anon,authenticated;
drop trigger if exists portfolio_revision_history on public.portfolio_documents;
create trigger portfolio_revision_history after insert or update on public.portfolio_documents for each row execute function public.record_portfolio_revision();

-- Extend editable documents while keeping the editorial register out of public feeds.
alter table public.portfolio_documents drop constraint if exists portfolio_documents_key_check;
alter table public.portfolio_documents add constraint portfolio_documents_key_check check(key in ('site','milestones','mindTopics','skills','projects','articles','research','seo','knowledge','intro','skillLinks','register'));
