-- Registration System Overhaul Migration
-- Adds global registration tracking, multi-grade selection, voting, and VIP logic

-- Add new columns (keeping old columns for backward compatibility)
ALTER TABLE registrations
ADD COLUMN IF NOT EXISTS registration_id INTEGER,
ADD COLUMN IF NOT EXISTS grade_levels TEXT[],
ADD COLUMN IF NOT EXISTS vote_count INTEGER,
ADD COLUMN IF NOT EXISTS is_vip BOOLEAN NOT NULL DEFAULT false;

-- Create sequence for global registration_id
CREATE SEQUENCE IF NOT EXISTS registration_id_seq START 1;

-- Create function to set registration_id from sequence
CREATE OR REPLACE FUNCTION set_registration_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Only set registration_id if it's not already set (for backward compatibility)
  IF NEW.registration_id IS NULL THEN
    NEW.registration_id := nextval('registration_id_seq');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set registration_id
DROP TRIGGER IF EXISTS trigger_set_registration_id ON registrations;
CREATE TRIGGER trigger_set_registration_id
  BEFORE INSERT ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION set_registration_id();

-- Create function to set vote_count from num_adults
CREATE OR REPLACE FUNCTION set_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.vote_count := NEW.num_adults;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set vote_count
DROP TRIGGER IF EXISTS trigger_set_vote_count ON registrations;
CREATE TRIGGER trigger_set_vote_count
  BEFORE INSERT OR UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION set_vote_count();

-- Create function to set is_vip based on registration_id
CREATE OR REPLACE FUNCTION set_is_vip()
RETURNS TRIGGER AS $$
BEGIN
  -- Only set is_vip if registration_id is set and <= 50
  IF NEW.registration_id IS NOT NULL AND NEW.registration_id <= 50 THEN
    NEW.is_vip := true;
  ELSE
    NEW.is_vip := false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set is_vip
DROP TRIGGER IF EXISTS trigger_set_is_vip ON registrations;
CREATE TRIGGER trigger_set_is_vip
  BEFORE INSERT OR UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION set_is_vip();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_registrations_registration_id ON registrations(registration_id);
CREATE INDEX IF NOT EXISTS idx_registrations_is_vip ON registrations(is_vip) WHERE is_vip = true;
CREATE INDEX IF NOT EXISTS idx_registrations_grade_levels ON registrations USING GIN(grade_levels);

-- Add comments to document the new fields
COMMENT ON COLUMN registrations.registration_id IS 'Global auto-incrementing registration ID (starts at 1)';
COMMENT ON COLUMN registrations.grade_levels IS 'Array of selected grade levels (replaces single grade_level for new registrations)';
COMMENT ON COLUMN registrations.vote_count IS 'Number of votes based on number of adults attending (equals num_adults)';
COMMENT ON COLUMN registrations.is_vip IS 'True if registration_id <= 50 (first 50 registrations globally)';
