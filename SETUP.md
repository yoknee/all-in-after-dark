# Quick Setup Guide

## Prerequisites

- Node.js (v20+ recommended)
- A Supabase account (free tier works)
- npm or yarn

## Step 1: Create Supabase Project

1. Go to https://supabase.com and create a new project
2. Wait for the project to be fully initialized
3. Note your project URL and anon key from Settings > API

## Step 2: Set Up Database

1. In Supabase Dashboard, go to SQL Editor
2. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
3. Run the SQL script
4. Verify the `registrations` table was created in Table Editor

## Step 3: Configure Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`

## Step 4: Deploy Edge Function (Optional - for email confirmations)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link to your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   (Find your project ref in Supabase Dashboard URL)

4. Deploy the function:
   ```bash
   supabase functions deploy send-confirmation
   ```

5. Set environment variables in Supabase Dashboard:
   - Go to Edge Functions > send-confirmation > Settings
   - Add `EVENT_PASSWORD` (e.g., "CASINO2024")
   - (Optional) Add `RESEND_API_KEY` if using Resend for emails

## Step 5: Configure Email Service (Optional)

The Edge Function currently logs emails to the console. To enable actual email sending:

### Option A: Resend (Recommended)
1. Sign up at https://resend.com
2. Get your API key
3. Add `RESEND_API_KEY` to Edge Function environment variables
4. Uncomment the Resend code in `supabase/functions/send-confirmation/index.ts`
5. Update the `from` email address to your verified domain

### Option B: SendGrid
1. Sign up at https://sendgrid.com
2. Get your API key
3. Add SendGrid integration code to the Edge Function

## Testing

1. Open `http://localhost:5173` in your browser
2. Fill out the registration form
3. Check Supabase Dashboard > Table Editor > registrations to see the data
4. Visit `http://localhost:5173/admin` to see the admin dashboard

## Production Deployment

### Frontend
- Deploy to Vercel, Netlify, or similar
- Set environment variables in your hosting platform
- Build command: `npm run build`
- Output directory: `dist`

### Database
- Already hosted on Supabase (no additional setup needed)

### Edge Functions
- Already deployed via Supabase CLI (see Step 4)

## Troubleshooting

### "Supabase credentials not found"
- Make sure `.env` file exists in the `frontend` directory
- Verify environment variable names start with `VITE_`
- Restart the dev server after changing `.env`

### Real-time updates not working
- Check Supabase Dashboard > Database > Replication
- Ensure `registrations` table has replication enabled

### Email not sending
- Check Edge Function logs in Supabase Dashboard
- Verify email service API key is set correctly
- Check function logs for errors

### Database errors
- Verify the migration SQL ran successfully
- Check Row Level Security policies are set correctly
- Ensure table name matches exactly: `registrations`

