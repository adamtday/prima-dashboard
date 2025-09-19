'use client'

// Authentication Context for PRIMA Partner Dashboard
// Based on RFC-001: Authentication & Base Infrastructure

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { User, AuthContextType, AuthResult, Permission, DataAccessLevel, UserRoleId } from '@/types/auth'
import { DEMO_USERS, USER_ROLES } from './demo-data'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('prima_user')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load stored user:', error)
      localStorage.removeItem('prima_user')
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      // Simulate network delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Find demo user by email and password
      const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password)
      
      if (demoUser) {
        const authUser: User = {
          id: demoUser.id,
          email: demoUser.email,
          firstName: demoUser.firstName,
          lastName: demoUser.lastName,
          role: demoUser.role,
          venueAccess: demoUser.venueAccess,
          loginTime: new Date().toISOString()
        }
        
        setUser(authUser)
        localStorage.setItem('prima_user', JSON.stringify(authUser))
        
        return { success: true, user: authUser }
      }
      
      return { success: false, error: 'Invalid email or password' }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Login error:', error)
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('prima_user')
  }, [])

  const switchRole = useCallback((roleId: UserRoleId) => {
    if (user && USER_ROLES.some(role => role.id === roleId)) {
      const updatedUser = { ...user, role: roleId }
      setUser(updatedUser)
      localStorage.setItem('prima_user', JSON.stringify(updatedUser))
    }
  }, [user])

  const hasPermission = useCallback((permission: Permission): boolean => {
    if (!user) return false
    const role = USER_ROLES.find(r => r.id === user.role)
    return role?.permissions.includes(permission) || false
  }, [user])

  const getDataAccessLevel = useCallback((): DataAccessLevel => {
    if (!user) return 'NONE'
    const role = USER_ROLES.find(r => r.id === user.role)
    return role?.dataAccess || 'NONE'
  }, [user])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    switchRole,
    hasPermission,
    getDataAccessLevel,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
