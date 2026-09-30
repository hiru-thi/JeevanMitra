import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// `supabase` is null when no project is configured yet, so the rest of the
// app can fall back to demo data instead of crashing.
export const supabase = url && key ? createClient(url, key) : null
export const READINGS_TABLE = 'readings'
export const PROFILES_TABLE = 'profiles'
