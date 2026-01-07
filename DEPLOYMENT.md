# Deployment Guide - Casino Night Registration System

This guide will walk you through deploying the Casino Night registration system to Vercel with Supabase backend integration.

## Prerequisites

- A GitHub account (for Vercel integration)
- A Supabase account (free tier works fine)
- Node.js installed locally (for Supabase CLI, optional)

## Part 1: Supabase Setup

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - **Name**: Casino Night (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient
4. Click "Create new project"
5. Wait 2-3 minutes for the project to initialize

### Step 2: Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open the file `supabase/migrations/001_initial_schema.sql` from this project
4. Copy the entire contents and paste into the SQL Editor
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

This creates:
- The `registrations` table
- Indexes for performance
- Row Level Security policies
- Triggers for automatic registration numbering and first-10 tracking

### Step 3: Get Your Supabase Credentials

1. In Supabase dashboard, go to **Settings** → **API** (left sidebar)
2. Find these values (you'll need them for Vercel):
   - **Project URL** (under "Project URL") - This is your `VITE_SUPABASE_URL`
   - **anon public** key (under "Project API keys") - This is your `VITE_SUPABASE_ANON_KEY`
3. Copy both values and keep them handy

### Step 4: Deploy Edge Function (Optional - for email confirmations)

The edge function handles sending confirmation emails. You can deploy it now or later.

#### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   (Find your project ref in the Supabase dashboard URL: `https://app.supabase.com/project/[PROJECT_REF]`)

4. Deploy the function:
   ```bash
   supabase functions deploy send-confirmation
   ```

#### Option B: Using Supabase Dashboard

1. Go to **Edge Functions** in the Supabase dashboard
2. Click **Create a new function**
3. Name it `send-confirmation`
4. Copy the contents of `supabase/functions/send-confirmation/index.ts`
5. Paste into the function editor
6. Click **Deploy**

#### Configure Edge Function Environment Variables

1. In Supabase dashboard, go to **Edge Functions** → **send-confirmation** → **Settings**
2. Add environment variables:
   - `EVENT_PASSWORD`: Your event entry password (e.g., `CASINO2024`)
   - `RESEND_API_KEY`: (Optional) If using Resend for emails, get your API key from [resend.com](https://resend.com)

## Part 2: Vercel Deployment

### Step 1: Prepare Your Repository

1. Make sure your code is committed to a Git repository (GitHub, GitLab, or Bitbucket)
2. Push all changes to your repository

### Step 2: Create Vercel Project

1. Go to [https://vercel.com](https://vercel.com) and sign in (use GitHub/GitLab/Bitbucket)
2. Click **Add New...** → **Project**
3. Import your repository:
   - Select the repository containing this project
   - Click **Import**

### Step 3: Configure Vercel Project Settings

Vercel should auto-detect the settings from `vercel.json`, but verify:

1. **Framework Preset**: Vite (should be auto-detected)
2. **Root Directory**: Leave as root (`.`)
3. **Build Command**: `cd frontend && npm install && npm run build` (from vercel.json)
4. **Output Directory**: `frontend/dist` (from vercel.json)
5. **Install Command**: `cd frontend && npm install` (from vercel.json)

### Step 4: Add Environment Variables

1. In Vercel project settings, go to **Settings** → **Environment Variables**
2. Add the following variables:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `VITE_SUPABASE_URL` | Your Supabase Project URL | Production, Preview, Development |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon public key | Production, Preview, Development |

3. Click **Save** for each variable

### Step 5: Deploy

1. Click **Deploy** (or push a commit to trigger automatic deployment)
2. Wait for the build to complete (usually 1-2 minutes)
3. Once deployed, you'll get a URL like `your-project.vercel.app`

## Part 3: Verify Deployment

### Test All Routes

1. **Homepage** (`/`):
   - Should show the event landing page
   - "Reserve Your Spot" button should work

2. **Registration Page** (`/register`):
   - Form should load correctly
   - Grade counters should show "Loading availability..." then update
   - Form submission should work

3. **Admin Dashboard** (`/admin`):
   - Should load the admin interface
   - Should show registration statistics
   - CSV export should work

### Test Functionality

1. **Submit a Test Registration**:
   - Fill out the registration form
   - Submit and verify it appears in the admin dashboard
   - Check that grade counters update in real-time

2. **Check Supabase**:
   - Go to Supabase dashboard → **Table Editor** → **registrations**
   - Verify your test registration appears
   - Check that `registration_number` and `is_first_10` are set correctly

3. **Test Email Confirmation** (if edge function is deployed):
   - After submitting a registration, check Supabase Edge Functions logs
   - Verify the function was triggered (may need to manually trigger or wait for automatic trigger)

## Part 4: Custom Domain (Optional)

1. In Vercel project, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions
4. Wait for DNS propagation (can take up to 24 hours)

## Troubleshooting

### Build Fails

- **Error: Cannot find module**: Make sure `installCommand` runs in the `frontend` directory
- **Error: Build command failed**: Check that all dependencies are in `package.json`
- **TypeScript errors**: Run `npm run build` locally first to catch errors

### Routes Not Working (404 errors)

- Verify `vercel.json` has the rewrites configuration
- Make sure all routes are handled by React Router
- Check that `index.html` is in the output directory

### Supabase Connection Issues

- Verify environment variables are set correctly in Vercel
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Ensure Row Level Security policies allow public read/insert (they should from the migration)

### Real-time Updates Not Working

- Check Supabase dashboard → **Database** → **Replication**
- Ensure "Enable Replication" is turned on for the `registrations` table
- Verify your Supabase project is not paused (free tier pauses after inactivity)

### Email Confirmations Not Sending

- Check Edge Function logs in Supabase dashboard
- Verify `EVENT_PASSWORD` is set in Edge Function environment variables
- If using Resend, verify `RESEND_API_KEY` is set correctly
- Check that the function is being called (may need to add trigger in database)

## Environment Variables Reference

### Vercel Environment Variables

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Supabase Dashboard → Settings → API → Project API keys → anon public |

### Supabase Edge Function Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EVENT_PASSWORD` | Password for event entry | Yes |
| `RESEND_API_KEY` | API key for Resend email service | No (only if using Resend) |

## Security Notes

1. **Admin Dashboard**: The admin page has no authentication. Consider:
   - Using a secret URL path (e.g., `/admin-secret-path-12345`)
   - Adding password protection
   - Implementing proper authentication

2. **Row Level Security**: The current setup allows public read/write. For production, consider:
   - Restricting read access to admin only
   - Adding rate limiting
   - Implementing proper user authentication

3. **Environment Variables**: Never commit `.env` files to Git. Vercel handles this securely.

## Next Steps

- [ ] Set up email service (Resend, SendGrid, etc.) for confirmation emails
- [ ] Add authentication to admin dashboard
- [ ] Set up monitoring/analytics
- [ ] Configure custom domain
- [ ] Set up staging environment
- [ ] Add error tracking (Sentry, etc.)

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Supabase logs (Database → Logs, Edge Functions → Logs)
3. Verify all environment variables are set correctly
4. Test locally first with `npm run dev`

## Quick Reference Commands

```bash
# Local development
cd frontend && npm run dev

# Build locally
cd frontend && npm run build

# Deploy Supabase function
supabase functions deploy send-confirmation

# Check Supabase status
supabase status
```
