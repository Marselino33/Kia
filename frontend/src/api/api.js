import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Error Handling
api.interceptors.response.use(
  (response) => {
    // Kita cek struktur { error: false, data: ... }
    if (response.data && response.data.error === true) {
       return Promise.reject(response.data);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
