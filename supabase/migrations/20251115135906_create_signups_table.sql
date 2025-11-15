-- Create signups table for storing form submissions
CREATE TABLE IF NOT EXISTS public.signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create unique index on email to prevent duplicate signups
CREATE UNIQUE INDEX IF NOT EXISTS signups_email_unique_idx ON public.signups(email);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_signups_updated_at
  BEFORE UPDATE ON public.signups
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add RLS (Row Level Security) policies
ALTER TABLE public.signups ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for public signup form)
CREATE POLICY "Allow public insert" ON public.signups
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone (including anonymous) to read signups (for counting on public landing page)
CREATE POLICY "Allow public read" ON public.signups
  FOR SELECT
  USING (true);

