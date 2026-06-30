import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // On mount, verify the httpOnly cookie with the server
    const rehydrate = async () => {
      try {
        const { data } = await api.get('/auth/me')
        if (data.success) setUser(data.user)
      } catch {
        // No valid session cookie — user is logged out
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    rehydrate()
  }, [])

  // login: server has already set the httpOnly cookie; just store user state
  const login = (userData) => {
    setUser(userData)
  }

  // logout: call the server to clear the cookie, then clear local state
  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // proceed regardless
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
