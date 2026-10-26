-- Operator maintenance: run periodically (e.g. daily/weekly cron or manually in Supabase SQL editor)
-- to keep tables compact and prune expired authentication artifacts.

-- 1. Remove expired or old consumed login codes
DELETE FROM cms_login_codes 
WHERE expires_at < now() 
   OR (consumed_at IS NOT NULL AND created_at < now() - interval '1 day');

-- 2. Remove expired sessions
DELETE FROM cms_sessions 
WHERE expires_at < now();

-- 3. Prune old rate limit windows
DELETE FROM cms_rate_limits 
WHERE window_start < now() - interval '1 hour';
