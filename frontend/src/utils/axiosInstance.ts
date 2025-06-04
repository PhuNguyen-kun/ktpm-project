import axios from 'axios'
import { useLoadingStore } from '@/stores/Common/loadingStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
const loadingStore = useLoadingStore()

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

axiosInstance.interceptors.request.use(
  (config) => {
    loadingStore.startLoading()
    const token = localStorage.getItem('user-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    loadingStore.finishLoading()
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => {
    loadingStore.finishLoading()
    return response
  },
  (error) => {
    loadingStore.finishLoading()
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('user-token')
        localStorage.removeItem('user-info')

        const currentPath = window.location.pathname
        if (currentPath !== '/login' && currentPath !== '/login') {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
