import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import authApi from '../lib/authApi'

// Demo mode: aktifkan dengan VITE_DEMO_MODE=true
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

const DEMO_USERS = {
  'demo@example.com': {
    password: 'demo1234',
    user: {
      id: 'demo-user-1',
      email: 'demo@example.com',
      user_metadata: { full_name: 'Demo User', role: 'user' },
    },
  },
  'john@example.com': {
    password: 'password123',
    user: {
      id: 'user-john-123',
      email: 'john@example.com',
      user_metadata: { full_name: 'John Doe', role: 'admin' },
    },
  },
}

function buildUserFromBackend(pengguna) {
  if (!pengguna) return null
  return {
    id: pengguna.id,
    email: pengguna.email,
    user_metadata: {
      full_name: pengguna.nama,
      role: pengguna.role,
      desa: pengguna.desa,
    },
  }
}

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: true,
      error: null,
      isDemoMode: DEMO_MODE,

      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      setError: (error) => set({ error }),
      setLoading: (loading) => set({ loading }),

      initialize: async () => {
        set({ loading: true })

        if (DEMO_MODE) {
          console.log('🎭 Demo mode aktif - auth menggunakan mock data')
          set({
            loading: false,
            error: 'ℹ️ Demo Mode: Gunakan email demo@example.com, password: demo1234',
          })
          return
        }

        const { accessToken, refreshToken } = get()
        if (!accessToken || !refreshToken) {
          set({ loading: false })
          return
        }

        try {
          const resp = await authApi.post('/auth/refresh', { refresh_token: refreshToken })
          const data = resp.data?.data
          const user = buildUserFromBackend(data?.pengguna)
          set({
            user,
            accessToken: data?.access_token,
            refreshToken: data?.refresh_token,
            error: null,
            loading: false,
          })
        } catch (err) {
          console.error('Auth initialize error:', err)
          set({ user: null, accessToken: null, refreshToken: null, loading: false })
        }
      },

      login: async (email, password) => {
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
            accessToken: 'demo-token-' + Date.now(),
            refreshToken: 'demo-refresh-' + Date.now(),
          }

          set({
            user: demoUser.user,
            accessToken: mockSession.accessToken,
            refreshToken: mockSession.refreshToken,
            error: null,
          })
          return mockSession
        }

        try {
          const resp = await authApi.post('/auth/login', {
            email,
            password,
          })
          const data = resp.data?.data
          const user = buildUserFromBackend(data?.pengguna)

          set({
            user,
            accessToken: data?.access_token,
            refreshToken: data?.refresh_token,
            error: null,
          })
          return data
        } catch (err) {
          const message = err?.response?.data?.message || err.message || 'Login gagal'
          set({ error: message })
          throw new Error(message)
        }
      },

      register: async (email, password, fullName) => {
        if (DEMO_MODE) {
          if (DEMO_USERS[email]) {
            throw new Error('Email sudah terdaftar di demo mode. Gunakan email lain.')
          }

          DEMO_USERS[email] = {
            password,
            user: {
              id: 'user-' + Math.random().toString(36).substr(2, 9),
              email,
              user_metadata: { full_name: fullName, role: 'user' },
            },
          }

          console.log('✅ Demo mode: Akun berhasil dibuat. Silakan login.')
          return { user: DEMO_USERS[email].user }
        }

        try {
          const resp = await authApi.post('/auth/register', {
            nama: fullName,
            email,
            password,
            role: 'ibu',
          })
          const data = resp.data?.data
          const user = buildUserFromBackend(data?.pengguna)

          set({
            user,
            accessToken: data?.access_token,
            refreshToken: data?.refresh_token,
            error: null,
          })
          return data
        } catch (err) {
          const message = err?.response?.data?.message || err.message || 'Gagal membuat akun'
          set({ error: message })
          throw new Error(message)
        }
      },

      refresh: async () => {
        const { refreshToken } = get()
        if (!refreshToken) throw new Error('Refresh token tidak tersedia')
        try {
          const resp = await authApi.post('/auth/refresh', { refresh_token: refreshToken })
          const data = resp.data?.data
          const user = buildUserFromBackend(data?.pengguna)
          set({
            user,
            accessToken: data?.access_token,
            refreshToken: data?.refresh_token,
            error: null,
          })
          return data
        } catch (err) {
          const message = err?.response?.data?.message || err.message || 'Gagal refresh token'
          set({ error: message })
          throw new Error(message)
        }
      },

      logout: async () => {
        set({ user: null, accessToken: null, refreshToken: null, error: null })
      },

      isAuthenticated: () => !!get().accessToken || !!get().user,
      isAdmin: () => get().user?.user_metadata?.role === 'admin',
    }),
    {
      name: 'kia-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isDemoMode: state.isDemoMode,
      }),
    }
  )
)

export default useAuthStore
