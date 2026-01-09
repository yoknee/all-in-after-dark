# Database Migration: Add Babysitting Fields

This document provides instructions for updating the Supabase database to support the new babysitting fields in the registration form.

## Overview

Two new fields are being added to the `registrations` table:
1. `needs_babysitting` (BOOLEAN) - Indicates whether the registrant needs babysitting services
2. `kids_info` (TEXT) - Contains kids' names and ages (only populated when `needs_babysitting` is true)

## Migration File

The migration file is located at: `supabase/migrations/002_add_babysitting_fields.sql`

## How to Apply the Migration

### Option 1: Using Supabase CLI (Recommended)

If you have the Supabase CLI installed and your project is linked:

```bash
# Navigate to your project root
cd /path/to/your/project

# Apply the migration
supabase db push
```

Or if you want to apply a specific migration:

```bash
supabase migration up
```

### Option 2: Using Supabase Dashboard

1. Log in to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the contents of `supabase/migrations/002_add_babysitting_fields.sql`:

```sql
-- Add babysitting fields to registrations table
ALTER TABLE registrations
ADD COLUMN IF NOT EXISTS needs_babysitting BOOLEAN,
ADD COLUMN IF NOT EXISTS kids_info TEXT;

-- Add comment to document the fields
COMMENT ON COLUMN registrations.needs_babysitting IS 'Indicates whether the registrant needs babysitting services (true = yes, false = no, null = not answered)';
COMMENT ON COLUMN registrations.kids_info IS 'Text field containing kids names and ages, only populated when needs_babysitting is true';
```

6. Click **Run** to execute the migration

### Option 3: Using psql (Direct Database Connection)

If you have direct database access:

```bash
# Connect to your Supabase database
psql -h <your-db-host> -U postgres -d postgres

# Then run the migration SQL
\i supabase/migrations/002_add_babysitting_fields.sql
```

## Verification

After applying the migration, verify the changes:

1. In Supabase Dashboard, go to **Table Editor**
2. Select the `registrations` table
3. Check that the new columns appear:
   - `needs_babysitting` (boolean, nullable)
   - `kids_info` (text, nullable)

Or run this SQL query in the SQL Editor:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'registrations'
  AND column_name IN ('needs_babysitting', 'kids_info');
```

Expected output:
```
column_name         | data_type | is_nullable
--------------------+-----------|-------------
needs_babysitting   | boolean   | YES
kids_info           | text      | YES
```

## Field Details

### `needs_babysitting`
- **Type**: BOOLEAN
- **Nullable**: Yes (allows null for existing records)
- **Values**: 
  - `true` - Registrant needs babysitting
  - `false` - Registrant does not need babysitting
  - `null` - Not answered (for existing records before migration)

### `kids_info`
- **Type**: TEXT
- **Nullable**: Yes
- **Usage**: Only populated when `needs_babysitting` is `true`
- **Format**: Free-form text field for parents to list children's names and ages
- **Example**: "Sarah, age 7; Jacob, age 5"

## Backward Compatibility

This migration is backward compatible:
- Existing records will have `NULL` values for both new fields
- The application handles `null` values gracefully
- No data loss or breaking changes

## Rollback (If Needed)

If you need to rollback this migration:

```sql
ALTER TABLE registrations
DROP COLUMN IF EXISTS needs_babysitting,
DROP COLUMN IF EXISTS kids_info;
```

**Warning**: This will permanently delete the babysitting data. Only run this if you're certain you want to remove these fields.

## Testing

After applying the migration, test the registration form:

1. Fill out the registration form
2. Select "Yes" for babysitting
3. Enter kids' names and ages in the text area
4. Submit the form
5. Verify in the database that:
   - `needs_babysitting` is set to `true`
   - `kids_info` contains the entered text

## Notes

- The migration uses `IF NOT EXISTS` to prevent errors if columns already exist
- Both fields are nullable to accommodate existing records
- The application validates that `kids_info` is provided when `needs_babysitting` is `true`
