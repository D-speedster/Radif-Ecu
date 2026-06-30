import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  // Send cookies (httpOnly token) with every cross-origin request
  withCredentials: true,
})

export default api
