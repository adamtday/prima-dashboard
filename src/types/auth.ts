// Authentication types for PRIMA Partner Dashboard
// Based on RFC-001: Authentication & Base Infrastructure

export type UserRoleId = 'ADMIN' | 'MANAGER' | 'COORDINATOR'

export type Permission = 
  | 'READ_BOOKINGS'
  | 'WRITE_BOOKINGS'
  | 'READ_FINANCIALS'
  | 'WRITE_FINANCIALS'
  | 'READ_PROMOTERS'
  | 'WRITE_PROMOTERS'
  | 'READ_PRICING'
  | 'WRITE_PRICING'
  | 'READ_INCENTIVES'
  | 'WRITE_INCENTIVES'
  | 'READ_COMMISSIONS'
  | 'WRITE_COMMISSIONS'
  | 'READ_TEAM'
  | 'WRITE_TEAM'
  | 'READ_SETTINGS'
  | 'WRITE_SETTINGS'

export type DataAccessLevel = 'FULL' | 'LIMITED' | 'MASKED' | 'NONE'

export interface UserRole {
  id: UserRoleId
  name: string
  permissions: Permission[]
  dataAccess: DataAccessLevel
  description: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRoleId
  venueAccess: string[] // Array of venue IDs user has access to
  loginTime: string
}

export interface DemoUser {
  id: string
  email: string
  password: string // Demo only - never store passwords in real apps
  firstName: string
  lastName: string
  role: UserRoleId
  venueAccess: string[]
}

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
}

export interface AuthContextType {
  // Authentication state
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Authentication actions
  login: (email: string, password: string) => Promise<AuthResult>
  logout: () => void
  
  // Demo features for RBAC demonstration
  switchRole: (roleId: UserRoleId) => void
  
  // Permission helpers
  hasPermission: (permission: Permission) => boolean
  getDataAccessLevel: () => DataAccessLevel
}
