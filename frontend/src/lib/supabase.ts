import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Registration {
  id: string
  parent_names: string
  email: string
  // Legacy field - kept for backward compatibility with old registrations
  grade_level?: string
  // New field - array of selected grades
  grade_levels?: string[]
  num_adults: number
  // Legacy field - kept for backward compatibility
  is_first_10?: boolean
  // Legacy field - kept for backward compatibility
  registration_number?: number
  // New field - global registration ID
  registration_id?: number
  // New field - number of votes (equals num_adults)
  vote_count?: number
  // New field - VIP status (true if registration_id <= 50)
  is_vip?: boolean
  created_at: string
  confirmation_sent: boolean
  needs_babysitting: boolean | null
  babysitting_notes: string | null
}

