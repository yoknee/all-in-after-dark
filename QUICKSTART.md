# Quick Start Guide

## Prerequisites Check

- ✅ Node.js installed (v20+ recommended, but v21 works)
- ✅ npm installed
- ✅ Supabase account (free tier works)

## 5-Minute Setup

### Step 1: Create Supabase Project (2 minutes)

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in:
   - Name: Casino Night Registration
   - Database Password: (save this!)
   - Region: Choose closest to you
4. Wait ~2 minutes for project to initialize

### Step 2: Set Up Database (1 minute)

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and click **Run** (or press Cmd/Ctrl + Enter)
5. Verify: Go to **Table Editor** → you should see `registrations` table

### Step 3: Configure Frontend (1 minute)

1. Open terminal in project root
2. Navigate to frontend:
   ```bash
   cd frontend
   ```
3. Copy environment template:
   ```bash
   cp .env.example .env
   ```
4. Edit `.env` file and add your Supabase credentials:
   - Get `VITE_SUPABASE_URL` from: Supabase Dashboard → Settings → API → Project URL
   - Get `VITE_SUPABASE_ANON_KEY` from: Supabase Dashboard → Settings → API → anon public key

### Step 4: Run the App (1 minute)

1. Install dependencies (if not already done):
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open browser to `http://localhost:5173`

4. Test registration:
   - Fill out the form
   - Submit
   - Check Supabase Dashboard → Table Editor → registrations to see your data

5. View admin dashboard:
   - Go to `http://localhost:5173/admin`

## Enable Real-time Updates

1. In Supabase Dashboard, go to **Database** → **Replication**
2. Find `registrations` table
3. Toggle **Enable** for replication
4. Refresh your app - counters should update in real-time!

## Enable Email Confirmations (Optional)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login:
   ```bash
   supabase login
   ```

3. Link project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   (Find project ref in Supabase Dashboard URL: `https://app.supabase.com/project/YOUR_PROJECT_REF`)

4. Deploy function:
   ```bash
   supabase functions deploy send-confirmation
   ```

5. Set environment variables in Supabase Dashboard:
   - Go to **Edge Functions** → **send-confirmation** → **Settings**
   - Add `EVENT_PASSWORD` = "CASINO2024" (or your password)
   - (Optional) Add `RESEND_API_KEY` if using Resend for emails

## Troubleshooting

### "Supabase credentials not found"
- Make sure `.env` file exists in `frontend/` directory
- Check variable names start with `VITE_`
- Restart dev server after changing `.env`

### Real-time not working
- Enable replication in Supabase Dashboard (see above)
- Check browser console for errors
- Verify RLS policies allow SELECT

### Build errors
- Make sure you're using Tailwind CSS v3 (not v4)
- Run `npm install` again
- Check Node.js version (v20+ recommended)

### Database errors
- Verify migration SQL ran successfully
- Check table name is exactly `registrations`
- Verify RLS policies are enabled

## Next Steps

- Customize event details in email template (`supabase/functions/send-confirmation/index.ts`)
- Add your email service (Resend/SendGrid) for production emails
- Deploy frontend to Vercel/Netlify for production
- Customize styling/colors in `frontend/tailwind.config.js`

## Production Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### Database
- Already hosted on Supabase (no action needed)

### Edge Functions
- Already deployed via Supabase CLI (see above)

