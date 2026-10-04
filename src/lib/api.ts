import axios from 'axios';

// در Production: /api (که از طریق Vercel به VPS proxy می‌شود)
// در Development: http://localhost:5000/api (مستقیم به Backend محلی)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // برای ارسال cookies (مهم برای Authentication)
});

// Interceptor برای خطاها
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // خطای 401 برای /auth/me را نادیده بگیر (کاربر لاگین نکرده)
    if (error.config?.url?.includes('/auth/me') && error.response?.status === 401) {
      return Promise.reject(error);
    }

    if (error.response) {
      // خطای از سمت سرور
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // درخواست ارسال شد اما پاسخی دریافت نشد
      console.error('Network Error:', error.request);
    } else {
      // خطای دیگر
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
