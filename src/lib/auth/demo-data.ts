// Demo users and role definitions for PRIMA Partner Dashboard
// Based on RFC-001: Authentication & Base Infrastructure

import type { UserRole, DemoUser, Permission } from '@/types/auth'

// Role definitions with permissions and data access levels
export const USER_ROLES: UserRole[] = [
  {
    id: 'ADMIN',
    name: 'Venue Admin',
    description: 'Full access to all features and data',
    permissions: [
      'READ_BOOKINGS', 'WRITE_BOOKINGS',
      'READ_FINANCIALS', 'WRITE_FINANCIALS',
      'READ_PROMOTERS', 'WRITE_PROMOTERS',
      'READ_PRICING', 'WRITE_PRICING',
      'READ_INCENTIVES', 'WRITE_INCENTIVES',
      'READ_COMMISSIONS', 'WRITE_COMMISSIONS',
      'READ_TEAM', 'WRITE_TEAM',
      'READ_SETTINGS', 'WRITE_SETTINGS'
    ],
    dataAccess: 'FULL'
  },
  {
    id: 'MANAGER',
    name: 'Operations Manager',
    description: 'Read-only financial data, full operational access',
    permissions: [
      'READ_BOOKINGS', 'WRITE_BOOKINGS',
      'READ_FINANCIALS', // No WRITE_FINANCIALS
      'READ_PROMOTERS', 'WRITE_PROMOTERS',
      'READ_PRICING', 'WRITE_PRICING',
      'READ_INCENTIVES', 'WRITE_INCENTIVES',
      'READ_COMMISSIONS', // No WRITE_COMMISSIONS
      'READ_TEAM', // No WRITE_TEAM
      'READ_SETTINGS' // No WRITE_SETTINGS
    ],
    dataAccess: 'LIMITED'
  },
  {
    id: 'COORDINATOR',
    name: 'Event Coordinator',
    description: 'Booking management only, masked financial data',
    permissions: [
      'READ_BOOKINGS', 'WRITE_BOOKINGS',
      // No financial access
      'READ_PROMOTERS', // No WRITE_PROMOTERS
      // No pricing, incentives, commissions, team, or settings access
    ],
    dataAccess: 'MASKED'
  }
]

// Demo venue IDs for multi-venue context
export const DEMO_VENUE_IDS = [
  'venue-1', // Rooftop Lounge
  'venue-2', // Garden Terrace  
  'venue-3', // Sky Bar
  'venue-4'  // Private Club
]

// Demo users for authentication testing
export const DEMO_USERS: DemoUser[] = [
  {
    id: 'user-admin-1',
    email: 'admin@prima.com',
    password: 'admin123', // Demo only
    firstName: 'Sarah',
    lastName: 'Chen',
    role: 'ADMIN',
    venueAccess: DEMO_VENUE_IDS // Admin has access to all venues
  },
  {
    id: 'user-manager-1',
    email: 'manager@prima.com',
    password: 'manager123', // Demo only
    firstName: 'Michael',
    lastName: 'Rodriguez',
    role: 'MANAGER',
    venueAccess: ['venue-1', 'venue-2'] // Manager has access to 2 venues
  },
  {
    id: 'user-coordinator-1',
    email: 'coordinator@prima.com',
    password: 'coordinator123', // Demo only
    firstName: 'Emma',
    lastName: 'Thompson',
    role: 'COORDINATOR',
    venueAccess: ['venue-1'] // Coordinator has access to 1 venue
  }
]

// Helper function to get role by ID
export function getRoleById(roleId: string): UserRole | undefined {
  return USER_ROLES.find(role => role.id === roleId)
}

// Helper function to check if user has permission
export function hasPermission(userRole: string, permission: Permission): boolean {
  const role = getRoleById(userRole)
  return role?.permissions.includes(permission) || false
}

// Helper function to get data access level for role
export function getDataAccessLevel(userRole: string) {
  const role = getRoleById(userRole)
  return role?.dataAccess || 'NONE'
}
