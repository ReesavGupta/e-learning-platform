import React, { createContext, useState, useContext, useEffect } from 'react'
import { User } from '../types'
import { getProfile } from '../api/userApi'

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getProfile()
        setUser(userData)
      } catch (error) {
        console.error('Not authenticated', error)
      }
    }
    checkAuth()
  }, [])

  const login = (userData: User) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
