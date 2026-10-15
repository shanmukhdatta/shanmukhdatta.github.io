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
