-- Supabase Schema for OAK Partner Convening 2026

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_master BOOLEAN DEFAULT false
);

-- Participants Table
CREATE TABLE IF NOT EXISTS public.participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    qr_code_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Checkins Table
CREATE TABLE IF NOT EXISTS public.checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL DEFAULT CURRENT_DATE,
    check_in_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    attendance_status TEXT DEFAULT 'checked_in',
    checked_in_by UUID REFERENCES public.admins(id) ON DELETE SET NULL,
    UNIQUE(participant_id, check_in_date)
);

-- Sessions Table
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(session_id, participant_id)
);

-- Partners Table
CREATE TABLE IF NOT EXISTS public.partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

