import axios from 'axios'
import { supabase } from './supabase'
import useAuthStore from '../store/authStore'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use(async (config) => {
    const store = useAuthStore.getState()
    let token = null
    if (store.isDemoMode) {
        token = store.session?.access_token
    } else {
        const { data: { session } } = await supabase.auth.getSession()
        token = session?.access_token
    }
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Handle 401 gracefully
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // in demo mode we expect backend to allow demo-token; if still 401, skip auto-logout
            const isDemo = useAuthStore.getState().isDemoMode
            if (!isDemo) {
                await supabase.auth.signOut()
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api
