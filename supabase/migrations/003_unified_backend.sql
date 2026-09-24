-- Unified backend. Idempotent; preserves legacy JSON tables in a private archive schema.
BEGIN;
CREATE SCHEMA IF NOT EXISTS oak_legacy;
REVOKE ALL ON SCHEMA oak_legacy FROM PUBLIC, anon, authenticated;
DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['partners','sessions','registrations','notes'] LOOP
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=t AND column_name='data') THEN
      EXECUTE format('ALTER TABLE public.%I SET SCHEMA oak_legacy',t);
      EXECUTE format('REVOKE ALL ON oak_legacy.%I FROM PUBLIC, anon, authenticated',t);
    END IF;
  END LOOP;
END $$;
-- Supabase Schema for OAK Partner Convening 2026



-- Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_master BOOLEAN DEFAULT false
);

-- Participants Table
CREATE TABLE IF NOT EXISTS public.participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    organization TEXT NOT NULL,
    sub_partner_program_area TEXT,
    role TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    dietary_requirements TEXT,
    accessibility_requirements TEXT,
    travel_requirements TEXT,
    accommodation_requirements TEXT,
    registration_status TEXT DEFAULT 'registered',
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    qr_code_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Checkins Table
CREATE TABLE IF NOT EXISTS public.checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL DEFAULT ((now() AT TIME ZONE 'Africa/Harare')::date),
    check_in_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
    attendance_status TEXT DEFAULT 'checked_in',
    checked_in_by UUID REFERENCES public.admins(id) ON DELETE SET NULL,
    UNIQUE(participant_id, check_in_date)
);

-- Sessions Table
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT,
    title TEXT NOT NULL,
    speaker TEXT,
    venue TEXT,
    description TEXT
);

-- Session Notes Table
CREATE TABLE IF NOT EXISTS public.session_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(session_id, participant_id)
);

-- Partners Table
CREATE TABLE IF NOT EXISTS public.partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    description TEXT,
    areas_of_work TEXT,
    contact_name TEXT,
    contact_email TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_participants_qr_code_id ON public.participants(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_participants_email ON public.participants(email);
CREATE INDEX IF NOT EXISTS idx_participants_registration_id ON public.participants(registration_id);
CREATE INDEX IF NOT EXISTS idx_checkins_date ON public.checkins(check_in_date);
CREATE INDEX IF NOT EXISTS idx_sessions_day_time ON public.sessions(day, start_time);


ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS credential_version integer NOT NULL DEFAULT 0;
ALTER TABLE public.participants ADD COLUMN IF NOT EXISTS consent boolean;
ALTER TABLE public.participants ADD COLUMN IF NOT EXISTS consent_at timestamptz;
ALTER TABLE public.participants ADD COLUMN IF NOT EXISTS recovery_token_hash text;
ALTER TABLE public.participants ADD COLUMN IF NOT EXISTS credential_version integer NOT NULL DEFAULT 0;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS region text;
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS partner_since integer;
ALTER TABLE public.session_notes ALTER COLUMN participant_id DROP NOT NULL;
ALTER TABLE public.session_notes ADD COLUMN IF NOT EXISTS admin_id uuid REFERENCES public.admins(id) ON DELETE CASCADE;
CREATE UNIQUE INDEX IF NOT EXISTS notes_admin_session_idx ON public.session_notes(session_id,admin_id);
ALTER TABLE public.session_notes DROP CONSTRAINT IF EXISTS notes_one_owner;
ALTER TABLE public.session_notes ADD CONSTRAINT notes_one_owner CHECK (num_nonnulls(participant_id,admin_id)=1);
ALTER TABLE public.checkins ALTER COLUMN check_in_date SET DEFAULT ((now() AT TIME ZONE 'Africa/Harare')::date);
CREATE TABLE IF NOT EXISTS public.auth_sessions (
  token_hash text PRIMARY KEY CHECK (token_hash ~ '^[a-f0-9]{64}$'),
  admin_id uuid REFERENCES public.admins(id) ON DELETE CASCADE,
  participant_id uuid REFERENCES public.participants(id) ON DELETE CASCADE,
  credential_version integer, expires_at timestamptz NOT NULL,
  CHECK (num_nonnulls(admin_id,participant_id)=1)
);
CREATE INDEX IF NOT EXISTS auth_sessions_admin_idx ON public.auth_sessions(admin_id);
CREATE INDEX IF NOT EXISTS auth_sessions_participant_idx ON public.auth_sessions(participant_id);
CREATE INDEX IF NOT EXISTS auth_sessions_expiry_idx ON public.auth_sessions(expires_at);
CREATE TABLE IF NOT EXISTS public.rate_limits (key text PRIMARY KEY, hits integer NOT NULL, expires_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS public.resources (id text PRIMARY KEY, name text NOT NULL, storage_path text);

-- Convert the older local implementation without deleting its originals.
DO $$ BEGIN
  IF to_regclass('oak_legacy.partners') IS NOT NULL THEN
    INSERT INTO public.partners(id,name,website_url,description,areas_of_work,contact_name,contact_email,region,partner_since)
    SELECT md5('legacy-partner:'||id)::uuid,data->>'name',data->>'website',data->>'about',
      (SELECT string_agg(v,', ') FROM jsonb_array_elements_text(data->'tags') v),data->>'contact',data->>'email',data->>'region',(data->>'since')::integer
    FROM oak_legacy.partners ON CONFLICT(id) DO NOTHING;
  END IF;
  IF to_regclass('oak_legacy.sessions') IS NOT NULL THEN
    INSERT INTO public.sessions(id,day,start_time,end_time,title,speaker,venue,description)
    SELECT md5('legacy-session:'||id)::uuid,'Day '||(data->>'day'),data->>'time',data->>'end',data->>'title',data->>'speaker',data->>'venue',data->>'description'
    FROM oak_legacy.sessions ON CONFLICT(id) DO NOTHING;
  END IF;
  IF to_regclass('oak_legacy.registrations') IS NOT NULL THEN
    INSERT INTO public.participants(id,registration_id,first_name,last_name,organization,role,email,phone,qr_code_id,registration_date,consent,consent_at,dietary_requirements,accessibility_requirements,travel_requirements,accommodation_requirements,sub_partner_program_area)
    SELECT id,coalesce(nullif(code,''),'OAK-2026-'||upper(replace(id::text,'-',''))),data->>'firstName',data->>'lastName',data->>'organisation',
      CASE data->>'role' WHEN 'Speaker' THEN 'Presenter' WHEN 'Facilitator' THEN 'Coordination Team' WHEN 'Guest' THEN 'Observer' ELSE data->>'role' END,
      lower(trim(email)),data->>'phone',CASE WHEN data->>'role'='Partner' THEN nullif(code,'') END,created_at,(data->>'consent')::boolean,
      CASE WHEN (data->>'consent')::boolean THEN created_at END,data->>'dietary',data->>'accessibility',data->>'travel',data->>'accommodation',data->>'programmeArea'
    FROM oak_legacy.registrations ON CONFLICT(id) DO NOTHING;
    INSERT INTO public.checkins(participant_id,check_in_date,check_in_time)
    SELECT id,(checked_in_at AT TIME ZONE 'Africa/Harare')::date,checked_in_at FROM oak_legacy.registrations WHERE checked_in_at IS NOT NULL
    ON CONFLICT(participant_id,check_in_date) DO NOTHING;
  END IF;
  IF to_regclass('oak_legacy.notes') IS NOT NULL THEN
    INSERT INTO public.session_notes(id,session_id,participant_id,note_text)
    SELECT md5('legacy-note:'||n.id)::uuid,s.id,p.id,n.data->>'text'
    FROM oak_legacy.notes n JOIN public.participants p ON p.id::text=n.data->>'ownerId'
    JOIN public.sessions s ON s.id=md5('legacy-session:'||(n.data->>'sessionId'))::uuid
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
-- If existing emails collide, stop the transaction rather than delete anyone's record.
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM public.participants GROUP BY lower(trim(email)) HAVING count(*)>1) THEN
   RAISE EXCEPTION 'Duplicate participant emails require review before migration; no records were deleted.';
 END IF;
END $$;
UPDATE public.participants SET email=lower(trim(email));
CREATE UNIQUE INDEX IF NOT EXISTS participants_email_unique ON public.participants(lower(email));

CREATE OR REPLACE FUNCTION public.invalidate_admin_sessions() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
 IF NEW.password_hash IS DISTINCT FROM OLD.password_hash THEN
   NEW.credential_version=OLD.credential_version+1;
   DELETE FROM public.auth_sessions WHERE admin_id=OLD.id;
 END IF;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS invalidate_admin_sessions ON public.admins;
CREATE TRIGGER invalidate_admin_sessions BEFORE UPDATE ON public.admins FOR EACH ROW EXECUTE FUNCTION public.invalidate_admin_sessions();
CREATE OR REPLACE FUNCTION public.invalidate_participant_sessions() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
 IF NEW.recovery_token_hash IS DISTINCT FROM OLD.recovery_token_hash THEN
   NEW.credential_version=OLD.credential_version+1;
   DELETE FROM public.auth_sessions WHERE participant_id=OLD.id;
 END IF;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS invalidate_participant_sessions ON public.participants;
CREATE TRIGGER invalidate_participant_sessions BEFORE UPDATE ON public.participants FOR EACH ROW EXECUTE FUNCTION public.invalidate_participant_sessions();

CREATE OR REPLACE FUNCTION public.take_rate_limit(bucket text,max_hits integer,window_seconds integer)
RETURNS boolean LANGUAGE plpgsql SET search_path=public AS $$
DECLARE hit_count integer;
BEGIN
 DELETE FROM public.rate_limits WHERE expires_at < now();
 DELETE FROM public.auth_sessions WHERE expires_at < now();
 INSERT INTO public.rate_limits(key,hits,expires_at) VALUES(bucket,1,now()+make_interval(secs=>window_seconds))
 ON CONFLICT(key) DO UPDATE SET hits=public.rate_limits.hits+1 RETURNING hits INTO hit_count;
 RETURN hit_count<=max_hits;
END $$;

CREATE OR REPLACE FUNCTION public.attendance_report(event_day date,search_name text DEFAULT '',search_org text DEFAULT '',filter_role text DEFAULT NULL,filter_status text DEFAULT NULL,page_number integer DEFAULT 1)
RETURNS jsonb LANGUAGE sql STABLE SET search_path=public AS $$
 WITH entries AS (
   SELECT p.id,p.first_name||' '||p.last_name AS full_name,p.organization,p.role,p.registration_date,c.check_in_time,
     CASE WHEN c.id IS NULL THEN 'pending' ELSE 'checked_in' END AS attendance_status
   FROM public.participants p LEFT JOIN public.checkins c ON c.participant_id=p.id AND c.check_in_date=event_day
 ), filtered AS (
   SELECT * FROM entries WHERE strpos(lower(full_name),lower(search_name))>0 AND strpos(lower(organization),lower(search_org))>0
     AND (filter_role IS NULL OR role=filter_role) AND (filter_status IS NULL OR attendance_status=filter_status)
 ), paged AS (SELECT * FROM filtered ORDER BY full_name,id LIMIT 50 OFFSET (greatest(1,page_number)-1)*50),
 totals AS (SELECT count(*) AS registered,count(*) FILTER(WHERE attendance_status='checked_in') AS checked,count(*) FILTER(WHERE role='Partner') AS partners FROM entries),
 breakdown AS (SELECT role,count(*) AS count FROM entries GROUP BY role)
 SELECT jsonb_build_object('date',event_day,'page',page_number,'page_size',50,'total', (SELECT count(*) FROM filtered),
   'stats',jsonb_build_object('total_registered',registered,'total_checked_in',checked,'total_partners',partners,
     'attendance_percentage',CASE WHEN registered=0 THEN 0 ELSE round(checked*100.0/registered) END,
     'role_breakdown',coalesce((SELECT jsonb_object_agg(role,count) FROM breakdown),'{}'::jsonb)),
   'participants',coalesce((SELECT jsonb_agg(to_jsonb(paged)) FROM paged),'[]'::jsonb)) FROM totals;
$$;

-- All application access uses the server service role after application authorization.
DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['admins','participants','checkins','sessions','session_notes','partners','auth_sessions','rate_limits','resources'] LOOP
   EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
   EXECUTE format('REVOKE ALL ON public.%I FROM PUBLIC, anon, authenticated',t);
   EXECUTE format('GRANT ALL ON public.%I TO service_role',t);
 END LOOP;
END $$;
REVOKE ALL ON FUNCTION public.take_rate_limit(text,integer,integer),public.attendance_report(date,text,text,text,text,integer),public.invalidate_admin_sessions(),public.invalidate_participant_sessions() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.take_rate_limit(text,integer,integer),public.attendance_report(date,text,text,text,text,integer) TO service_role;

CREATE OR REPLACE FUNCTION public.register_participant(payload jsonb,session_hash text,recovery_hash text,session_expires timestamptz,old_session_hashes text[])
RETURNS jsonb LANGUAGE plpgsql SET search_path=public AS $$
DECLARE r public.participants;
BEGIN
 INSERT INTO public.participants(registration_id,first_name,last_name,organization,role,email,phone,sub_partner_program_area,dietary_requirements,accessibility_requirements,travel_requirements,accommodation_requirements,qr_code_id,consent,consent_at,recovery_token_hash)
 VALUES(payload->>'registration_id',payload->>'first_name',payload->>'last_name',payload->>'organization',payload->>'role',payload->>'email',payload->>'phone',payload->>'sub_partner_program_area',payload->>'dietary_requirements',payload->>'accessibility_requirements',payload->>'travel_requirements',payload->>'accommodation_requirements',payload->>'qr_code_id',(payload->>'consent')::boolean,now(),recovery_hash) RETURNING * INTO r;
 INSERT INTO public.auth_sessions(token_hash,participant_id,credential_version,expires_at) VALUES(session_hash,r.id,r.credential_version,session_expires);
 DELETE FROM public.auth_sessions WHERE token_hash=ANY(old_session_hashes);
 RETURN jsonb_build_object('id',r.id,'registration_id',r.registration_id,'role',r.role,'email',r.email,'first_name',r.first_name,'last_name',r.last_name,'organization',r.organization,'qr_code_id',r.qr_code_id);
END $$;
REVOKE ALL ON FUNCTION public.register_participant(jsonb,text,text,timestamptz,text[]) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.register_participant(jsonb,text,text,timestamptz,text[]) TO service_role;
-- Supabase Storage is optional in local PostgreSQL tests; the event bucket is always private.
DO $$ BEGIN
 IF to_regclass('storage.buckets') IS NOT NULL THEN
   INSERT INTO storage.buckets(id,name,public,file_size_limit) VALUES('event-resources','event-resources',false,209715200)
   ON CONFLICT(id) DO UPDATE SET public=false;
 END IF;
END $$;

COMMIT;
