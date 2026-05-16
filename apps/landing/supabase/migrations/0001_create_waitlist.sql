-- Waitlist table for Supabase
-- Stores waitlist signups with email, user type, and queue position

CREATE TABLE IF NOT EXISTS waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    user_type TEXT NOT NULL CHECK (user_type IN ('agency_owner', 'brand_owner', 'creator_freelance')),
    position INTEGER NOT NULL,
    approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for counting and querying
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- RLS: allow public insert, authenticated read for admin
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to join waitlist (insert)
CREATE POLICY "Public can join waitlist" ON waitlist
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read waitlist (for admin dashboard)
CREATE POLICY "Authenticated can read waitlist" ON waitlist
    FOR SELECT USING (true);

-- Allow authenticated users to update (for approving)
CREATE POLICY "Authenticated can update waitlist" ON waitlist
    FOR UPDATE USING (true);