// PRIMA Overview Dashboard Page
// Based on RFC-001: Authentication & Base Infrastructure + RFC-002: Data Layer
// This demonstrates data layer integration - will be fully implemented in RFC-004

'use client'

import { useAuth } from '@/lib/auth/auth-context'
import { useGetVenuesQuery, useGetPortfolioMetricsQuery } from '@/lib/store/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function OverviewPage() {
  const { user, getDataAccessLevel, switchRole } = useAuth()
  
  // RFC-002: Data Layer Integration Demo
  const { data: venues = [], isLoading: venuesLoading, error: venuesError } = useGetVenuesQuery()
  const { data: portfolioMetrics, isLoading: metricsLoading, error: metricsError } = useGetPortfolioMetricsQuery({
    from: '2024-09-01T00:00:00Z',
    to: '2024-09-18T23:59:59Z'
  })

  const dataAccess = getDataAccessLevel()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your venues today.
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {user?.role}
          </Badge>
          <Badge variant={dataAccess === 'FULL' ? 'default' : dataAccess === 'LIMITED' ? 'secondary' : 'destructive'}>
            {dataAccess} Access
          </Badge>
        </div>
      </div>

      {/* Role Demo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Role-Based Access Demo</CardTitle>
          <CardDescription>
            Switch between different user roles to see how data access changes.
            This demonstrates the M8 requirement for role-based data masking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Button 
              variant={user?.role === 'ADMIN' ? 'default' : 'outline'}
              size="sm"
              onClick={() => switchRole('ADMIN')}
            >
              Admin (Full Access)
            </Button>
            <Button 
              variant={user?.role === 'MANAGER' ? 'default' : 'outline'}
              size="sm"
              onClick={() => switchRole('MANAGER')}
            >
              Manager (Limited)
            </Button>
            <Button 
              variant={user?.role === 'COORDINATOR' ? 'default' : 'outline'}
              size="sm"
              onClick={() => switchRole('COORDINATOR')}
            >
              Coordinator (Masked)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* RFC-002: Data Layer Integration Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Data Layer Integration (RFC-002)</CardTitle>
          <CardDescription>
            Demonstrating RTK Query integration with MSW mock API. Real data fetching with caching and optimistic updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Venues Data */}
            <div>
              <h4 className="font-medium mb-2">Available Venues</h4>
              {venuesLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              ) : venuesError ? (
                <p className="text-sm text-destructive">Failed to load venues</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {venues.map(venue => (
                    <Badge key={venue.id} variant="outline">
                      {venue.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Portfolio Metrics */}
            <div>
              <h4 className="font-medium mb-2">Portfolio Metrics (Last 18 days)</h4>
              {metricsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : metricsError ? (
                <p className="text-sm text-destructive">Failed to load metrics</p>
              ) : portfolioMetrics ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-lg font-semibold">${portfolioMetrics.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                    <p className="text-lg font-semibold">{portfolioMetrics.totalBookings}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Guests</p>
                    <p className="text-lg font-semibold">{portfolioMetrics.totalGuests}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Avg Booking Value</p>
                    <p className="text-lg font-semibold">${portfolioMetrics.averageBookingValue.toFixed(2)}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for future RFC-004 implementation */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Features (RFC-004)</CardTitle>
          <CardDescription>
            The full dashboard with KPIs, charts, and venue management will be implemented in RFC-004.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Revenue Charts</h3>
              <p className="text-sm text-muted-foreground">Coming in RFC-004</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Booking Trends</h3>
              <p className="text-sm text-muted-foreground">Coming in RFC-004</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Promoter Performance</h3>
              <p className="text-sm text-muted-foreground">Coming in RFC-004</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Venue Comparison</h3>
              <p className="text-sm text-muted-foreground">Coming in RFC-004</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Info Section */}
      <Card>
        <CardHeader>
          <CardTitle>User Session Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>User ID:</strong> {user?.id}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Venue Access:</strong> {user?.venueAccess.join(', ')}</p>
            <p><strong>Login Time:</strong> {user?.loginTime ? new Date(user.loginTime).toLocaleString() : 'N/A'}</p>
            <p><strong>Data Access Level:</strong> {dataAccess}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
