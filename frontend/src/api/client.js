import axios from "axios"
import toast from "react-hot-toast"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://heart-sycc.vercel.app/api"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
      toast.error("Session expired. Please login again.")
    } else if (error.response?.status === 403) {
      toast.error("Access denied")
    } else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.")
    }
    return Promise.reject(error)
  },
)

export default apiClient
