'use client'

// Protected Route Component for PRIMA Partner Dashboard
// Based on RFC-001: Authentication & Base Infrastructure

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './auth-context'
import { Skeleton } from '@/components/ui/skeleton'
import type { Permission } from '@/types/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: Permission
  fallback?: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  requiredPermission,
  fallback = <div className="p-4 text-center text-muted-foreground">Access denied</div>,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { isAuthenticated, hasPermission, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
        <Skeleton className="h-4 w-[250px]" />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Check for required permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Higher-order component for page-level protection
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission?: Permission
) {
  const AuthenticatedComponent = (props: P) => (
    <ProtectedRoute requiredPermission={requiredPermission}>
      <Component {...props} />
    </ProtectedRoute>
  )

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`
  
  return AuthenticatedComponent
}
