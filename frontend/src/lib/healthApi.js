import axios from 'axios'

const HEALTH_API_URL = import.meta.env.VITE_HEALTH_API_URL || 'http://localhost:8000/api/v1'

const healthApi = axios.create({
  baseURL: HEALTH_API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

export default healthApi
