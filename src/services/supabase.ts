import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check for real credentials (not placeholders from .env.example)
const isReal =
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co') &&
  !supabaseUrl.includes('your-project') &&
  supabaseAnonKey.length > 50 &&
  !supabaseAnonKey.includes('your-anon-key')

if (!isReal) {
  console.info(
    '[Poet\'s Sanctuary] Running in static mode — Supabase not configured. Add real credentials to .env to enable auth and CMS.',
  )
}

// When not configured use a safe placeholder so createClient doesn't throw,
// but disable all network activity (no auth refresh, no session persistence).
const _url = isReal ? supabaseUrl : 'https://placeholder.supabase.co'
// A valid-format JWT with no real signing — Supabase accepts it at creation time
const _key = isReal
  ? supabaseAnonKey
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0.Q_q7B7jFXHHYVsRFRNhKPY5GZlKtNbg9Oqu3cHbMaJk'

export const supabase = createClient(_url, _key, {
  auth: {
    autoRefreshToken: isReal,
    persistSession: isReal,
    detectSessionInUrl: isReal,
  },
})

export const isSupabaseReady = isReal

export type SupabaseClient = typeof supabase
