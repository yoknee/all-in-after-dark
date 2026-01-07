# Casino Night Registration System

A registration system for a school event with real-time grade-level tracking, email confirmations, and admin dashboard.

## Features

- **Registration Form**: Collects parent names, email, phone, grade level, dietary restrictions, and number of adults
- **First 10 Tracking**: Tracks the first 10 registrations per grade with special badges
- **Real-time Counters**: Live updates showing spots remaining per grade
- **Email Confirmations**: Automated confirmation emails with event details
- **Admin Dashboard**: View registrations, export to CSV, and monitor statistics
- **1920s Speakeasy Theme**: Dark brown and gold color scheme with art deco styling

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Real-time**: Supabase real-time subscriptions

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Run the migration file to create the database schema:
   ```bash
   # Using Supabase CLI
   supabase db push
   
   # Or manually run the SQL in supabase/migrations/001_initial_schema.sql
   ```

### 2. Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For the Edge Function, set these environment variables in Supabase Dashboard:
- `EVENT_PASSWORD`: Password for event entry (defaults to 'CASINO2024')
- `RESEND_API_KEY` (optional): If using Resend for emails
- Or configure SendGrid/other email service

### 3. Deploy Edge Function

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy send-confirmation
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## Routes

- `/` - Registration form
- `/admin` - Admin dashboard (no authentication, use secret URL)

## Email Configuration

The Edge Function currently logs email content to the console. To enable actual email sending:

1. **Option 1: Resend**
   - Sign up at https://resend.com
   - Get your API key
   - Set `RESEND_API_KEY` in Supabase Edge Function environment variables
   - Uncomment the Resend code in `supabase/functions/send-confirmation/index.ts`

2. **Option 2: SendGrid**
   - Sign up at https://sendgrid.com
   - Get your API key
   - Add SendGrid integration code to the Edge Function

3. **Option 3: Supabase Email**
   - Configure Supabase's built-in email service if available

## Database Schema

The `registrations` table includes:
- Basic contact information (parent names, email, phone)
- Grade level (K through 8th)
- Dietary restrictions (optional)
- Number of adults (1 or 2)
- First 10 status flag
- Registration number per grade
- Timestamps and confirmation status

## Features in Detail

### Grade Tracking
- Each grade (K-8) tracks up to 10 "first" registrations
- Real-time counters show spots remaining
- After 10 registrations, the system continues accepting but without "first 10" status

### Admin Dashboard
- Total registration count
- Breakdown by grade
- List of first 10 registrations per grade
- Real-time registration feed
- CSV export functionality

### Form Validation
- Required field validation
- Email format validation
- Phone number format validation
- Real-time error display

## Styling

The app uses a 1920s speakeasy aesthetic:
- Dark brown background (#2d1810)
- Gold accents (#d4af37)
- Art deco typography
- Smooth animations
- Mobile responsive design

## License

MIT

