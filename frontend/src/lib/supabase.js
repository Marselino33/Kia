import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Log konfigurasi (tanpa expose kunci penuh)
if (typeof window !== 'undefined') {
  console.log('Supabase Config:', {
    url: supabaseUrl,
    keyConfigured: supabaseAnonKey !== 'your-anon-key'
  })
}

// Validasi konfigurasi
const isConfigured = !supabaseAnonKey.includes('your-anon-key') && !supabaseUrl.includes('your-project')

if (!isConfigured) {
  console.warn('⚠️ Supabase tidak dikonfigurasi dengan benar. Silakan atur VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const isSupabaseConfigured = isConfigured
