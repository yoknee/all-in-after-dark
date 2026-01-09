-- Add babysitting fields to registrations table
ALTER TABLE registrations
ADD COLUMN IF NOT EXISTS needs_babysitting BOOLEAN,
ADD COLUMN IF NOT EXISTS kids_info TEXT;

-- Add comment to document the fields
COMMENT ON COLUMN registrations.needs_babysitting IS 'Indicates whether the registrant needs babysitting services (true = yes, false = no, null = not answered)';
COMMENT ON COLUMN registrations.kids_info IS 'Text field containing kids names and ages, only populated when needs_babysitting is true';
