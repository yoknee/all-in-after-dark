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
  grade_level: string
  num_adults: number
  is_first_10: boolean
  registration_number: number
  created_at: string
  confirmation_sent: boolean
  needs_babysitting: boolean | null
  babysitting_notes: string | null
}

