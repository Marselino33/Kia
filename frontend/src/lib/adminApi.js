import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1'

const adminApi = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
})

// Storage key for admin token
const ADMIN_TOKEN_KEY = 'sejiwa-admin-token'

export function getAdminToken() {
    return localStorage.getItem(ADMIN_TOKEN_KEY)
}

export function setAdminToken(token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token)
}

export function clearAdminToken() {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
}

export function isAdminLoggedIn() {
    return !!getAdminToken()
}

// Attach admin JWT to every request
adminApi.interceptors.request.use((config) => {
    const token = getAdminToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Handle 401/403 gracefully
adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            clearAdminToken()
            window.location.href = '/admin/login'
        }
        return Promise.reject(error)
    }
)

export default adminApi
