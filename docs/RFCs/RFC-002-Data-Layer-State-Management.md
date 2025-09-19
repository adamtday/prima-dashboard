# RFC-002: Data Layer & State Management

## Summary

Establish the data layer and state management architecture for the PRIMA Partner Dashboard. This RFC implements RTK Query for server state management, MSW for API mocking, and creates the foundational data patterns that all subsequent modules will build upon.

## Features Addressed

- RTK Query store configuration and API integration
- MSW (Mock Service Worker) setup with realistic data patterns
- Core data models and type definitions
- Caching strategies and optimistic updates
- Error handling and loading state patterns
- Multi-venue data structure foundation

## Technical Approach

### State Management Strategy
- **RTK Query**: Server state management with intelligent caching
- **MSW Integration**: Realistic API mocking with proper latency
- **Type Safety**: Comprehensive TypeScript coverage for all data
- **Optimistic Updates**: Immediate UI feedback with rollback capability

### Architecture Considerations
- Builds upon RFC-001 authentication context
- Provides data layer foundation for all subsequent RFCs
- Establishes patterns for multi-venue data handling
- Creates reusable data fetching and mutation patterns

## Dependencies
- **Builds Upon**: RFC-001 (Authentication & Base Infrastructure)
- **Enables**: RFC-003 (Layout Shell), RFC-004 (Overview Dashboard)

## Complexity: Medium
- Complex RTK Query configuration with multiple endpoints
- Sophisticated MSW handlers with realistic data patterns
- Multi-venue data architecture considerations
- Caching and invalidation strategy design

## Detailed Requirements

### 1. RTK Query Store Configuration

#### Base Store Setup
```typescript
// src/lib/store/store.ts
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { primaApi } from './api/prima-api'
import { authSlice } from './slices/auth-slice'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    [primaApi.reducerPath]: primaApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [primaApi.actions],
      },
    }).concat(primaApi.middleware),
})

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

#### Base API Configuration
```typescript
// src/lib/store/api/prima-api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'

export const primaApi = createApi({
  reducerPath: 'primaApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      // Add authentication headers
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      
      // Add user context for multi-venue filtering
      const user = (getState() as RootState).auth.user
      if (user?.id) {
        headers.set('x-user-id', user.id)
      }
      
      return headers
    },
  }),
  tagTypes: [
    'Venue',
    'Booking', 
    'Promoter',
    'Pricing',
    'Commission',
    'Incentive',
    'Payout',
    'Transaction',
    'Metrics'
  ],
  endpoints: () => ({}),
})

// Export hooks for usage in components
export const {
  // Will be populated by endpoint injections
} = primaApi
```

### 2. Core Data Models

#### Base Data Types
```typescript
// src/types/data.ts

// Base entity interface
interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

// Venue types
export interface Venue extends BaseEntity {
  name: string
  type: 'RESTAURANT' | 'HOTEL' | 'EVENT_SPACE' | 'BAR' | 'CAFE' | 'OTHER'
  tier: 'CASUAL' | 'MID_TIER' | 'HIGH_END' | 'PREMIUM'
  location: {
    address: string
    city: string
    state: string
    country: string
    coordinates?: { lat: number; lng: number }
  }
  capacity: {
    seated: number
    standing?: number
    private?: number
  }
  settings: {
    currency: string
    timezone: string
    language: string
  }
  metrics: {
    averageDailyBookings: number
    primeRatio: number
    averageBookingValue: number
  }
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
}

// User-Venue relationship
export interface UserVenueAccess {
  userId: string
  venueId: string
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'COORDINATOR'
  grantedAt: string
  grantedBy: string
}

// Booking types
export interface Booking extends BaseEntity {
  venueId: string
  promoterId?: string
  guestId: string
  guestName: string
  guestEmail: string
  guestPhone?: string
  diners: number
  bookingTime: string
  duration: number
  type: 'PRIME' | 'NON_PRIME'
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'NO_SHOW' | 'COMPLETED'
  source: 'DIRECT' | 'PROMOTER' | 'PARTNER' | 'WALK_IN' | 'PHONE'
  pricing: {
    baseAmount: number
    platformFee: number
    totalAmount: number
    currency: string
  }
  notes?: string
  metadata: {
    ipAddress?: string
    userAgent?: string
    referrer?: string
  }
}

// Promoter types
export interface Promoter extends BaseEntity {
  venueId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  title?: string
  company?: string
  bio?: string
  socialMedia?: {
    instagram?: string
    tiktok?: string
    twitter?: string
    linkedIn?: string
  }
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL'
  tier: 'STANDARD' | 'PREMIUM' | 'VIP'
  joinedAt: string
  lastActiveAt?: string
  metrics: PromoterMetrics
}

export interface PromoterMetrics {
  totalBookings: number
  totalRevenue: number
  averageBookingValue: number
  conversionRate: number
  noShowRate: number
  cancelRate: number
  thisMonth: {
    bookings: number
    revenue: number
    newGuests: number
    repeatGuests: number
  }
}

// Financial types
export interface Commission extends BaseEntity {
  promoterId: string
  venueId: string
  bookingId: string
  tier: 'STANDARD' | 'PREMIUM' | 'VIP'
  model: 'PER_COVER' | 'PERCENT_OF_SPEND'
  rate: number
  baseAmount: number
  calculatedAmount: number
  status: 'PENDING' | 'CONFIRMED' | 'PAID'
}

export interface Payout extends BaseEntity {
  venueId: string
  promoterId: string
  amount: number
  currency: string
  period: {
    from: string
    to: string
  }
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  scheduledFor: string
  processedAt?: string
  method: 'BANK_TRANSFER' | 'CHECK' | 'DIGITAL_WALLET'
  reference?: string
  breakdown: {
    commissions: number
    incentives: number
    adjustments: number
    fees: number
  }
  holds: PayoutHold[]
}

export interface PayoutHold {
  id: string
  amount: number
  reason: string
  holdUntil?: string
  createdBy: string
  createdAt: string
  releasedBy?: string
  releasedAt?: string
}
```

#### API Response Types
```typescript
// src/types/api.ts

// Standard API response wrapper
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  timestamp: string
}

// Paginated response
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  hasNext: boolean
  hasPrevious: boolean
}

// Error response
export interface ApiError {
  success: false
  errors: {
    code: string
    message: string
    field?: string
  }[]
  timestamp: string
}

// Filter and sort types
export interface DateRangeFilter {
  from: string
  to: string
}

export interface BookingFilters {
  venueId?: string
  status?: Booking['status'][]
  type?: Booking['type'][]
  promoterId?: string
  dateRange?: DateRangeFilter
  search?: string
}

export interface PromoterFilters {
  venueId?: string
  status?: Promoter['status'][]
  tier?: Promoter['tier'][]
  search?: string
}

export type SortOrder = 'asc' | 'desc'

export interface SortConfig {
  field: string
  order: SortOrder
}
```

### 3. MSW Handlers Setup

#### MSW Configuration
```typescript
// src/lib/mocks/browser.ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

// Start worker in development
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_MSW_ENABLED === 'true') {
  worker.start({
    onUnhandledRequest: 'warn',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  })
}
```

#### Venue Handlers
```typescript
// src/lib/mocks/handlers/venues.ts
import { http, HttpResponse } from 'msw'
import { venues } from '../data/venues'
import { addLatency, handleError, getUserFromHeaders } from '../utils'

export const venueHandlers = [
  // Get user's venues
  http.get('/api/venues', async ({ request }) => {
    await addLatency()
    
    const user = getUserFromHeaders(request)
    if (!user) {
      return handleError('AUTH_REQUIRED', 'Authentication required', 401)
    }
    
    // Filter venues based on user access
    const userVenues = venues.filter(venue => 
      user.venueAccess.includes(venue.id)
    )
    
    return HttpResponse.json({
      success: true,
      data: userVenues,
      timestamp: new Date().toISOString(),
    })
  }),

  // Get specific venue
  http.get('/api/venues/:venueId', async ({ params, request }) => {
    await addLatency()
    
    const { venueId } = params
    const user = getUserFromHeaders(request)
    
    if (!user) {
      return handleError('AUTH_REQUIRED', 'Authentication required', 401)
    }
    
    if (!user.venueAccess.includes(venueId as string)) {
      return handleError('ACCESS_DENIED', 'Access denied to this venue', 403)
    }
    
    const venue = venues.find(v => v.id === venueId)
    
    if (!venue) {
      return handleError('VENUE_NOT_FOUND', 'Venue not found', 404)
    }
    
    return HttpResponse.json({
      success: true,
      data: venue,
      timestamp: new Date().toISOString(),
    })
  }),
]
```

#### Booking Handlers
```typescript
// src/lib/mocks/handlers/bookings.ts
import { http, HttpResponse } from 'msw'
import { bookings } from '../data/bookings'
import { addLatency, handleError, getUserFromHeaders, applyFilters, applyPagination } from '../utils'

export const bookingHandlers = [
  // Get bookings with filtering and pagination
  http.get('/api/bookings', async ({ request }) => {
    await addLatency()
    
    const user = getUserFromHeaders(request)
    if (!user) {
      return handleError('AUTH_REQUIRED', 'Authentication required', 401)
    }
    
    const url = new URL(request.url)
    const filters: BookingFilters = {
      venueId: url.searchParams.get('venueId') || undefined,
      status: url.searchParams.getAll('status') as Booking['status'][],
      type: url.searchParams.getAll('type') as Booking['type'][],
      promoterId: url.searchParams.get('promoterId') || undefined,
      search: url.searchParams.get('search') || undefined,
      dateRange: {
        from: url.searchParams.get('from') || '',
        to: url.searchParams.get('to') || '',
      },
    }
    
    const page = parseInt(url.searchParams.get('page') || '1')
    const size = parseInt(url.searchParams.get('size') || '50')
    
    // Filter bookings based on user access
    let filteredBookings = bookings.filter(booking => 
      user.venueAccess.includes(booking.venueId)
    )
    
    // Apply filters
    filteredBookings = applyFilters(filteredBookings, filters)
    
    // Apply sorting
    const sortBy = url.searchParams.get('sortBy') || 'bookingTime'
    const sortOrder = url.searchParams.get('sortOrder') || 'desc'
    
    filteredBookings.sort((a, b) => {
      const aVal = a[sortBy as keyof Booking]
      const bVal = b[sortBy as keyof Booking]
      
      if (sortOrder === 'desc') {
        return aVal > bVal ? -1 : 1
      }
      return aVal > bVal ? 1 : -1
    })
    
    // Apply pagination
    const paginatedData = applyPagination(filteredBookings, page, size)
    
    return HttpResponse.json({
      success: true,
      data: paginatedData,
      timestamp: new Date().toISOString(),
    })
  }),

  // Update booking status
  http.patch('/api/bookings/:id', async ({ params, request }) => {
    await addLatency(50, 200) // Faster for updates
    
    const { id } = params
    const updates = await request.json()
    const user = getUserFromHeaders(request)
    
    if (!user) {
      return handleError('AUTH_REQUIRED', 'Authentication required', 401)
    }
    
    const bookingIndex = bookings.findIndex(b => b.id === id)
    if (bookingIndex === -1) {
      return handleError('BOOKING_NOT_FOUND', 'Booking not found', 404)
    }
    
    const booking = bookings[bookingIndex]
    
    // Check venue access
    if (!user.venueAccess.includes(booking.venueId)) {
      return handleError('ACCESS_DENIED', 'Access denied', 403)
    }
    
    // Update booking
    bookings[bookingIndex] = {
      ...booking,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    
    return HttpResponse.json({
      success: true,
      data: bookings[bookingIndex],
      affectedMetrics: ['overview', 'promoters', 'finance'],
      timestamp: new Date().toISOString(),
    })
  }),
]
```

### 4. Data Utilities and Helpers

#### MSW Utilities
```typescript
// src/lib/mocks/utils/helpers.ts
export async function addLatency(
  min = 150,
  max = 500,
  spikeChance = 0.1,
  spikeDelay = 2000
) {
  const isSpike = Math.random() < spikeChance
  const delay = isSpike 
    ? spikeDelay 
    : Math.floor(Math.random() * (max - min + 1)) + min
    
  await new Promise(resolve => setTimeout(resolve, delay))
}

export function handleError(code: string, message: string, status = 400) {
  return HttpResponse.json(
    {
      success: false,
      errors: [{ code, message }],
      timestamp: new Date().toISOString(),
    },
    { status }
  )
}

export function getUserFromHeaders(request: Request) {
  const userId = request.headers.get('x-user-id')
  if (!userId) return null
  
  // In a real app, this would validate the token
  // For demo, we'll use a simple lookup
  return DEMO_USERS.find(u => u.id === userId) || null
}

export function applyFilters<T>(items: T[], filters: any): T[] {
  return items.filter(item => {
    // Implement generic filtering logic
    for (const [key, value] of Object.entries(filters)) {
      if (!value) continue
      
      if (Array.isArray(value) && value.length > 0) {
        if (!value.includes(item[key as keyof T])) return false
      } else if (typeof value === 'string') {
        if (key === 'search') {
          // Implement search across relevant fields
          const searchableFields = ['guestName', 'guestEmail', 'notes']
          const searchMatch = searchableFields.some(field => 
            String(item[field as keyof T] || '').toLowerCase().includes(value.toLowerCase())
          )
          if (!searchMatch) return false
        } else if (item[key as keyof T] !== value) {
          return false
        }
      }
    }
    return true
  })
}

export function applyPagination<T>(
  items: T[], 
  page: number, 
  size: number
): PaginatedResponse<T> {
  const total = items.length
  const startIndex = (page - 1) * size
  const endIndex = startIndex + size
  const paginatedItems = items.slice(startIndex, endIndex)
  
  return {
    items: paginatedItems,
    total,
    page,
    size,
    hasNext: endIndex < total,
    hasPrevious: page > 1,
  }
}
```

### 5. Redux Integration

#### Store Provider Setup
```typescript
// src/lib/store/provider.tsx
'use client'

import { Provider } from 'react-redux'
import { store } from './store'

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}
```

#### Typed Hooks
```typescript
// src/lib/store/hooks.ts
import { useDispatch, useSelector, useStore } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './store'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppStore = useStore
```

### 6. Error Handling Patterns

#### Error Boundary Component
```typescript
// src/components/error-boundary.tsx
'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; retry: () => void }> },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} retry={this.handleRetry} />
      }

      return (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription className="mt-2">
            {this.state.error?.message || 'An unexpected error occurred'}
          </AlertDescription>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={this.handleRetry}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </Button>
        </Alert>
      )
    }

    return this.props.children
  }
}
```

#### Query Error Handling
```typescript
// src/lib/store/utils/error-handling.ts
export function isRTKQueryError(error: any): error is RTKQueryError {
  return error && typeof error === 'object' && 'status' in error
}

export function getErrorMessage(error: unknown): string {
  if (isRTKQueryError(error)) {
    if ('data' in error && error.data) {
      const errorData = error.data as ApiError
      return errorData.errors?.[0]?.message || 'An error occurred'
    }
    return `Request failed with status ${error.status}`
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'An unexpected error occurred'
}
```

## API Contracts

### Venue Endpoints
```typescript
// GET /api/venues
// Response: ApiResponse<Venue[]>

// GET /api/venues/:id
// Response: ApiResponse<Venue>
```

### Booking Endpoints
```typescript
// GET /api/bookings?page=1&size=50&venueId=...&status[]=...
// Response: ApiResponse<PaginatedResponse<Booking>>

// PATCH /api/bookings/:id
// Body: Partial<Booking>
// Response: ApiResponse<Booking>

// POST /api/bookings
// Body: CreateBookingRequest
// Response: ApiResponse<Booking>
```

### Promoter Endpoints
```typescript
// GET /api/promoters?venueId=...&tier[]=...
// Response: ApiResponse<Promoter[]>

// GET /api/promoters/:id
// Response: ApiResponse<Promoter>

// PATCH /api/promoters/:id
// Body: Partial<Promoter>
// Response: ApiResponse<Promoter>
```

## State Management Patterns

### Cache Invalidation Strategy
```typescript
// src/lib/store/api/cache-tags.ts
export const cacheInvalidationMap = {
  // When bookings change, invalidate related data
  Booking: ['Metrics', 'Promoter', 'Payout'],
  
  // When promoters change, invalidate their metrics
  Promoter: ['Metrics'],
  
  // When pricing changes, invalidate calculations
  Pricing: ['Metrics'],
  
  // When payouts change, invalidate finance data
  Payout: ['Metrics', 'Commission'],
}

export function getInvalidationTags(changedTag: string): string[] {
  return [changedTag, ...(cacheInvalidationMap[changedTag] || [])]
}
```

### Optimistic Updates Pattern
```typescript
// src/lib/store/api/optimistic-updates.ts
export function createOptimisticUpdate<T>(
  queryName: string,
  updateFn: (draft: T, update: any) => void
) {
  return (dispatch: AppDispatch, update: any, id: string) => {
    // Apply optimistic update
    dispatch(
      primaApi.util.updateQueryData(queryName, { id }, (draft) => {
        updateFn(draft as T, update)
      })
    )
    
    return {
      undo: () => {
        dispatch(primaApi.util.invalidateTags([{ type: queryName, id }]))
      }
    }
  }
}
```

## Performance Considerations

### Caching Strategy
- **Long-lived data**: Venues, user profiles (5 minutes)
- **Medium-lived data**: Promoter lists, pricing configs (2 minutes)
- **Short-lived data**: Bookings, metrics (30 seconds)
- **Real-time data**: Live updates via polling (10 seconds)

### Bundle Impact
- **RTK Query**: ~25KB additional bundle size
- **MSW**: Development only, no production impact
- **Type definitions**: No runtime impact

### Memory Management
- **Query cache size limits**: 50MB maximum
- **Automatic cleanup**: Unused queries cleaned after 5 minutes
- **Subscription management**: Automatic cleanup on component unmount

## Testing Strategy

### RTK Query Tests
```typescript
// src/lib/store/api/__tests__/venues.test.ts
describe('Venues API', () => {
  test('fetches user venues', async () => {
    const { result } = renderHook(() => useGetVenuesQuery(), {
      wrapper: createTestWrapper()
    })
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    
    expect(result.current.data).toHaveLength(4)
    expect(result.current.data[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      type: expect.any(String),
    })
  })

  test('handles authentication errors', async () => {
    // Mock unauthenticated request
    server.use(
      http.get('/api/venues', () => {
        return HttpResponse.json(
          { success: false, errors: [{ code: 'AUTH_REQUIRED', message: 'Authentication required' }] },
          { status: 401 }
        )
      })
    )
    
    const { result } = renderHook(() => useGetVenuesQuery(), {
      wrapper: createTestWrapper()
    })
    
    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    
    expect(result.current.error).toMatchObject({
      status: 401
    })
  })
})
```

### MSW Handler Tests
```typescript
// src/lib/mocks/handlers/__tests__/bookings.test.ts
describe('Booking Handlers', () => {
  test('filters bookings by venue access', async () => {
    const response = await fetch('/api/bookings', {
      headers: { 'x-user-id': 'user_manager_001' }
    })
    
    const data = await response.json()
    
    expect(data.success).toBe(true)
    expect(data.data.items.every(booking => 
      ['venue_prima_downtown', 'venue_prima_bistro'].includes(booking.venueId)
    )).toBe(true)
  })

  test('applies filters correctly', async () => {
    const response = await fetch('/api/bookings?status=CONFIRMED&venueId=venue_prima_downtown', {
      headers: { 'x-user-id': 'user_admin_001' }
    })
    
    const data = await response.json()
    
    expect(data.success).toBe(true)
    expect(data.data.items.every(booking => 
      booking.status === 'CONFIRMED' && booking.venueId === 'venue_prima_downtown'
    )).toBe(true)
  })
})
```

## Acceptance Criteria

### Core Data Layer
- [ ] RTK Query store configured with proper base query and auth headers
- [ ] MSW handlers implemented for all core entities (venues, bookings, promoters)
- [ ] Comprehensive TypeScript types for all data models
- [ ] Error handling and loading states for all queries
- [ ] Optimistic updates for mutation operations

### Multi-Venue Support
- [ ] User venue access filtering in all API endpoints
- [ ] Venue context properly passed in request headers
- [ ] Data isolation between venues enforced
- [ ] Portfolio-level data aggregation support

### Performance & Caching
- [ ] Intelligent caching strategy with appropriate TTLs
- [ ] Cache invalidation based on data relationships
- [ ] Optimistic updates with rollback capability
- [ ] Memory usage within defined limits

### Integration Ready
- [ ] Authentication integration with RFC-001 user context
- [ ] Provider setup ready for app-wide usage
- [ ] Typed hooks exported for component usage
- [ ] Error boundaries and fallback components

### Testing Coverage
- [ ] Unit tests for all RTK Query endpoints
- [ ] Integration tests for MSW handlers
- [ ] Error handling and edge case testing
- [ ] Performance and memory usage testing

---

This RFC establishes the complete data layer foundation that all subsequent RFCs will build upon, providing robust state management, realistic API mocking, and comprehensive type safety.
