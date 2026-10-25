-- Apply once to a dedicated Postgres database. Use a database role with limited privileges.
CREATE TABLE IF NOT EXISTS cms_records (
 kind text NOT NULL CHECK (kind IN ('profile','work','blog','experience','achievement','skill','credential','gallery','roadmap')),
 id text NOT NULL CHECK (id ~ '^[a-z0-9][a-z0-9-]{0,89}$'),
 status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','hidden')),
 payload jsonb NOT NULL CHECK (jsonb_typeof(payload)='object'),
 version integer NOT NULL DEFAULT 1,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY (kind,id)
);
CREATE INDEX IF NOT EXISTS cms_public_records ON cms_records(kind,status);

CREATE TABLE IF NOT EXISTS cms_login_codes (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 email text NOT NULL,
 code_hash text NOT NULL,
 expires_at timestamptz NOT NULL,
 consumed_at timestamptz,
 attempts integer NOT NULL DEFAULT 0,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cms_login_recent ON cms_login_codes(email,created_at DESC);

CREATE TABLE IF NOT EXISTS cms_sessions (
 token_hash text PRIMARY KEY,
 email text NOT NULL,
 expires_at timestamptz NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cms_sessions_exp ON cms_sessions(expires_at);

CREATE TABLE IF NOT EXISTS cms_rate_limits (
 action text NOT NULL,
 key_hash text NOT NULL,
 window_start timestamptz NOT NULL DEFAULT now(),
 attempts integer NOT NULL DEFAULT 1,
 PRIMARY KEY(action,key_hash)
);

-- Operator maintenance: DELETE expired OTPs and sessions periodically and old rate-limit rows.
-- No user-facing route executes DDL. Do not put secrets or raw OTPs in this database.
