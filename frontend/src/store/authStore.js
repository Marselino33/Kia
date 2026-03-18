import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

// ==================== DEMO MODE ====================
// Mode demo ini memungkinkan testing tanpa Supabase
// Untuk production, hapus demo mode dan gunakan Supabase Auth

const DEMO_MODE = !isSupabaseConfigured

const DEMO_USERS = {
  'demo@example.com': {
    password: 'demo1234',
    user: {
      id: 'demo-user-1',
      email: 'demo@example.com',
      user_metadata: { full_name: 'Demo User', role: 'user' }
    }
  },
  'john@example.com': {
    password: 'password123',
    user: {
      id: 'user-john-123',
      email: 'john@example.com',
      user_metadata: { full_name: 'John Doe', role: 'admin' }
    }
  }
}

// ====================================================

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            session: null,
            profile: null,
            role: 'user',
            loading: true,
            error: null,
            isDemoMode: DEMO_MODE,

            setUser: (user) => set({ user }),
            setSession: (session) => set({ session }),
            setProfile: (profile) => set({ profile }),
            setRole: (role) => set({ role }),
            isAdmin: () => get().role === 'admin',
            setLoading: (loading) => set({ loading }),
            setError: (error) => set({ error }),

            initialize: async () => {
                set({ loading: true })
                
                if (DEMO_MODE) {
                  console.log('🎭 Demo mode aktif - auth menggunakan mock data')
                  set({ 
                    loading: false,
                    error: 'ℹ️ Demo Mode: Gunakan email demo@example.com, password: demo1234'
                  })
                  return
                }

                if (!isSupabaseConfigured) {
                  set({ 
                    error: 'Supabase belum dikonfigurasi. Silakan atur VITE_SUPABASE_ANON_KEY di file .env',
                    loading: false 
                  })
                  return
                }

                try {
                  const { data: { session } } = await supabase.auth.getSession()
                  const role = session?.user?.user_metadata?.role || 'user'
                  set({
                    session,
                    user: session?.user ?? null,
                    role,
                    loading: false,
                  })

                  supabase.auth.onAuthStateChange((_event, session) => {
                    set({
                      session,
                      user: session?.user ?? null,
                    })
                  })
                } catch (err) {
                  console.error('Auth initialize error:', err)
                  set({ 
                    error: err.message,
                    loading: false 
                  })
                }
            },

            login: async (email, password) => {
                // Demo mode
                if (DEMO_MODE) {
                  const demoUser = DEMO_USERS[email]
                  if (!demoUser) {
                    throw new Error('Email tidak ditemukan di demo mode. Coba: demo@example.com')
                  }
                  if (demoUser.password !== password) {
                    throw new Error('Password salah. Gunakan: ' + demoUser.password)
                  }
                  
                  const mockSession = {
                    user: demoUser.user,
                    access_token: 'demo-token-' + Date.now(),
                    refresh_token: 'demo-refresh-' + Date.now(),
                  }
                  
                  set({ 
                    session: mockSession, 
                    user: demoUser.user, 
                    role: demoUser.user.user_metadata?.role || 'user',
                    error: null 
                  })
                  return mockSession
                }

                if (!isSupabaseConfigured) {
                  throw new Error('❌ Supabase belum dikonfigurasi. Buka LOGIN_TROUBLESHOOTING.md untuk panduan setup.')
                }
                
                try {
                  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
                  if (error) throw error
                  const role = data.user?.user_metadata?.role || 'user'
                  set({ session: data.session, user: data.user, role, error: null })
                  return data
                } catch (err) {
                  set({ error: err.message })
                  throw err
                }
            },

            register: async (email, password, fullName) => {
                // Demo mode
                if (DEMO_MODE) {
                  if (DEMO_USERS[email]) {
                    throw new Error('Email sudah terdaftar di demo mode. Gunakan email lain.')
                  }
                  
                  // Add to demo users
                  DEMO_USERS[email] = {
                    password,
                    user: {
                      id: 'user-' + Math.random().toString(36).substr(2, 9),
                      email,
                      user_metadata: { full_name: fullName }
                    }
                  }
                  
                  console.log('✅ Demo mode: Akun berhasil dibuat. Silakan login.')
                  return { user: DEMO_USERS[email].user }
                }

                if (!isSupabaseConfigured) {
                  throw new Error('❌ Supabase belum dikonfigurasi. Buka LOGIN_TROUBLESHOOTING.md untuk panduan setup.')
                }

                try {
                  const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { full_name: fullName } },
                  })
                  if (error) throw error
                  set({ error: null })
                  return data
                } catch (err) {
                  set({ error: err.message })
                  throw err
                }
            },

            logout: async () => {
                try {
                  if (!DEMO_MODE && isSupabaseConfigured) {
                    await supabase.auth.signOut()
                  }
                  set({ user: null, session: null, profile: null, error: null })
                } catch (err) {
                  set({ error: err.message })
                  throw err
                }
            },

            isAuthenticated: () => !!get().session,
        }),
        {
            name: 'kia-auth',
            partialize: (state) => ({ user: state.user, isDemoMode: state.isDemoMode }),
        }
    )
)

export default useAuthStore
