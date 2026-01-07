-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_names TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  grade_level TEXT NOT NULL CHECK (grade_level IN ('K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th')),
  dietary_restrictions TEXT,
  num_adults INTEGER NOT NULL CHECK (num_adults IN (1, 2)),
  is_first_10 BOOLEAN NOT NULL DEFAULT false,
  registration_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  confirmation_sent BOOLEAN NOT NULL DEFAULT false
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_registrations_grade_level ON registrations(grade_level);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_is_first_10 ON registrations(is_first_10) WHERE is_first_10 = true;

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert registrations
CREATE POLICY "Allow public insert" ON registrations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Allow anyone to read registrations (needed for real-time counters and admin)
CREATE POLICY "Allow public read" ON registrations
  FOR SELECT
  TO public
  USING (true);

-- Create a function to automatically set registration_number per grade
CREATE OR REPLACE FUNCTION set_registration_number()
RETURNS TRIGGER AS $$
DECLARE
  next_number INTEGER;
BEGIN
  SELECT COALESCE(MAX(registration_number), 0) + 1
  INTO next_number
  FROM registrations
  WHERE grade_level = NEW.grade_level;
  
  NEW.registration_number := next_number;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set registration_number
CREATE TRIGGER trigger_set_registration_number
  BEFORE INSERT ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION set_registration_number();

-- Create a function to check and set is_first_10 flag
CREATE OR REPLACE FUNCTION check_first_10()
RETURNS TRIGGER AS $$
DECLARE
  current_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO current_count
  FROM registrations
  WHERE grade_level = NEW.grade_level;
  
  -- If this is the 10th or earlier registration for this grade
  -- (current_count is the count BEFORE this insert, so < 10 means this will be 1-10)
  IF current_count < 10 THEN
    NEW.is_first_10 := true;
  ELSE
    NEW.is_first_10 := false;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to check first 10 status
CREATE TRIGGER trigger_check_first_10
  BEFORE INSERT ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION check_first_10();

