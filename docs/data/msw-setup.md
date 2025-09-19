# MSW Setup & Configuration

Mock Service Worker (MSW) configuration and handlers for the PRIMA Partner Dashboard prototype. MSW enables realistic API mocking for development and testing.

## 🎯 Overview

MSW provides API mocking at the network level, intercepting HTTP requests and returning realistic responses with configurable latency and error scenarios.

## 📁 Project Structure

```
src/
├── lib/
│   └── mocks/
│       ├── browser.ts              # Browser MSW setup
│       ├── server.ts               # Node.js MSW setup (testing)
│       ├── handlers/
│       │   ├── index.ts            # Handler exports
│       │   ├── auth.ts             # Authentication handlers
│       │   ├── venues.ts           # Venue management handlers
│       │   ├── bookings.ts         # Booking management handlers
│       │   ├── promoters.ts        # Promoter management handlers
│       │   ├── pricing.ts          # Pricing configuration handlers
│       │   ├── incentives.ts       # Incentive program handlers
│       │   ├── commissions.ts      # Commission management handlers
│       │   ├── finance.ts          # Financial data handlers
│       │   └── metrics.ts          # Analytics and metrics handlers
│       ├── data/
│       │   ├── index.ts            # Data exports
│       │   ├── venues.ts           # Venue mock data
│       │   ├── users.ts            # User and role mock data
│       │   ├── bookings.ts         # Booking mock data
│       │   ├── promoters.ts        # Promoter mock data
│       │   ├── pricing.ts          # Pricing mock data
│       │   ├── incentives.ts       # Incentive program mock data
│       │   ├── commissions.ts      # Commission structure mock data
│       │   └── finance.ts          # Financial mock data
│       └── utils/
│           ├── generators.ts       # Data generation utilities
│           ├── seeders.ts          # Data seeding functions
│           └── helpers.ts          # Mock helper functions
```

## 🛠️ Setup Configuration

### Browser Setup (`src/lib/mocks/browser.ts`)
```typescript
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

// Enable mocking conditionally
if (process.env.NODE_ENV === 'development' && 
    process.env.NEXT_PUBLIC_MSW_ENABLED === 'true') {
  worker.start({
    onUnhandledRequest: 'warn',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  })
}
```

### Server Setup (`src/lib/mocks/server.ts`)
```typescript
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)

// Setup for testing
export function setupMockServer() {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())
}
```

### Handler Index (`src/lib/mocks/handlers/index.ts`)
```typescript
import { authHandlers } from './auth'
import { venueHandlers } from './venues'
import { bookingHandlers } from './bookings'
import { promoterHandlers } from './promoters'
import { pricingHandlers } from './pricing'
import { incentiveHandlers } from './incentives'
import { commissionHandlers } from './commissions'
import { financeHandlers } from './finance'
import { metricsHandlers } from './metrics'

export const handlers = [
  ...authHandlers,
  ...venueHandlers,
  ...bookingHandlers,
  ...promoterHandlers,
  ...pricingHandlers,
  ...incentiveHandlers,
  ...commissionHandlers,
  ...financeHandlers,
  ...metricsHandlers,
]
```

## 📊 Handler Implementation Patterns

### Basic Handler Pattern
```typescript
// Example: Venue handlers
import { http, HttpResponse } from 'msw'
import { venues } from '../data/venues'
import { addLatency, handleError } from '../utils/helpers'

export const venueHandlers = [
  // Get user's venues
  http.get('/api/venues', async ({ request }) => {
    await addLatency()
    
    const url = new URL(request.url)
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return handleError('AUTH_REQUIRED', 'User authentication required')
    }
    
    const userVenues = venues.filter(venue => 
      venue.userAccess.some(access => access.userId === userId)
    )
    
    return HttpResponse.json({
      success: true,
      data: userVenues,
      timestamp: new Date().toISOString(),
    })
  }),

  // Get specific venue
  http.get('/api/venues/:venueId', async ({ params }) => {
    await addLatency()
    
    const { venueId } = params
    const venue = venues.find(v => v.id === venueId)
    
    if (!venue) {
      return handleError('VENUE_NOT_FOUND', 'Venue not found')
    }
    
    return HttpResponse.json({
      success: true,
      data: venue,
      timestamp: new Date().toISOString(),
    })
  }),
]
```

### Error Simulation
```typescript
// Error handling utilities
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

// Random error simulation
export function maybeError(rate = 0.05) {
  if (Math.random() < rate) {
    return handleError('INTERNAL_ERROR', 'Simulated server error', 500)
  }
  return null
}
```

### Latency Simulation
```typescript
// Realistic latency patterns
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
```

## 🔄 Dynamic Data Generation

### Booking Handler with Dynamic Data
```typescript
export const bookingHandlers = [
  http.get('/api/bookings', async ({ request }) => {
    await addLatency()
    
    const url = new URL(request.url)
    const venueId = url.searchParams.get('venueId')
    const status = url.searchParams.getAll('status')
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')
    const page = parseInt(url.searchParams.get('page') || '1')
    const size = parseInt(url.searchParams.get('size') || '50')
    
    // Error simulation
    const error = maybeError()
    if (error) return error
    
    let filteredBookings = [...bookings]
    
    // Apply filters
    if (venueId) {
      filteredBookings = filteredBookings.filter(b => b.venueId === venueId)
    }
    
    if (status.length > 0) {
      filteredBookings = filteredBookings.filter(b => status.includes(b.status))
    }
    
    if (from && to) {
      const fromDate = new Date(from)
      const toDate = new Date(to)
      filteredBookings = filteredBookings.filter(b => {
        const bookingDate = new Date(b.bookingTime)
        return bookingDate >= fromDate && bookingDate <= toDate
      })
    }
    
    // Pagination
    const total = filteredBookings.length
    const startIndex = (page - 1) * size
    const endIndex = startIndex + size
    const items = filteredBookings.slice(startIndex, endIndex)
    
    // Calculate summary stats
    const summary = {
      totalRevenue: filteredBookings.reduce((sum, b) => sum + b.fee, 0),
      averageBookingValue: filteredBookings.length > 0 
        ? filteredBookings.reduce((sum, b) => sum + b.fee, 0) / filteredBookings.length 
        : 0,
      totalDiners: filteredBookings.reduce((sum, b) => sum + b.diners, 0),
      statusBreakdown: filteredBookings.reduce((acc, b) => {
        acc[b.status] = (acc[b.status] || 0) + 1
        return acc
      }, {} as Record<string, number>),
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        items,
        total,
        page,
        size,
        hasNext: endIndex < total,
        hasPrevious: page > 1,
        summary,
        filters: {
          applied: { venueId, status, from, to },
          available: {
            venues: getAvailableVenues(),
            statuses: ['PENDING', 'CONFIRMED', 'CANCELLED', 'NO_SHOW'],
          },
        },
      },
      timestamp: new Date().toISOString(),
    })
  }),
  
  // Optimistic update handler
  http.patch('/api/bookings/:id', async ({ params, request }) => {
    await addLatency(50, 200) // Faster response for updates
    
    const { id } = params
    const updates = await request.json()
    
    const bookingIndex = bookings.findIndex(b => b.id === id)
    if (bookingIndex === -1) {
      return handleError('BOOKING_NOT_FOUND', 'Booking not found', 404)
    }
    
    // Update booking
    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      ...updates,
      updatedAt: new Date(),
    }
    
    return HttpResponse.json({
      success: true,
      data: bookings[bookingIndex],
      affectedMetrics: ['overview', 'finance'],
      timestamp: new Date().toISOString(),
    })
  }),
]
```

## 🎛️ Environment Configuration

### Development Environment
```typescript
// .env.local
NEXT_PUBLIC_MSW_ENABLED=true
NEXT_PUBLIC_API_DELAY_MIN=150
NEXT_PUBLIC_API_DELAY_MAX=500
NEXT_PUBLIC_ERROR_RATE=0.05
NEXT_PUBLIC_SPIKE_CHANCE=0.1
```

### Testing Environment
```typescript
// jest.setup.js
import { setupMockServer } from './src/lib/mocks/server'

// Setup MSW for testing
setupMockServer()

// Configure faster responses for testing
process.env.NEXT_PUBLIC_API_DELAY_MIN = '10'
process.env.NEXT_PUBLIC_API_DELAY_MAX = '50'
process.env.NEXT_PUBLIC_ERROR_RATE = '0'
```

## 🔧 Utility Functions

### Data Generators
```typescript
// Generate realistic IDs
export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Generate realistic dates
export function generateDateRange(daysBack = 30): { from: Date; to: Date } {
  const to = new Date()
  const from = new Date(to.getTime() - (daysBack * 24 * 60 * 60 * 1000))
  return { from, to }
}

// Generate realistic booking patterns
export function generateBookingsByDay(venue: Venue, date: Date): Booking[] {
  const dayOfWeek = date.getDay()
  const baseBookings = venue.averageDailyBookings || 12
  
  // Apply day-of-week multipliers
  const multipliers = [0.7, 0.8, 0.9, 1.0, 1.3, 1.6, 1.4] // Sun-Sat
  const expectedBookings = Math.round(baseBookings * multipliers[dayOfWeek])
  
  return Array.from({ length: expectedBookings }, () => 
    generateBooking(venue.id, date)
  )
}
```

### Role-Based Data Filtering
```typescript
export function filterDataByRole(data: any[], userRole: UserRole): any[] {
  switch (userRole) {
    case 'ADMIN':
      return data // Full access
      
    case 'MANAGER':
      return data.map(item => ({
        ...item,
        // Mask PII
        guestName: maskName(item.guestName),
        guestEmail: maskEmail(item.guestEmail),
        guestPhone: maskPhone(item.guestPhone),
      }))
      
    case 'COORDINATOR':
      return data.filter(item => !item.isFinancialData)
                 .map(item => ({
                   ...item,
                   // Remove PII entirely
                   guestName: '[HIDDEN]',
                   guestEmail: '[HIDDEN]',
                   guestPhone: '[HIDDEN]',
                 }))
                 
    default:
      return []
  }
}
```

## 🧪 Testing Integration

### Test Utilities
```typescript
// Mock data helpers for tests
export function createMockBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    id: generateId('booking'),
    venueId: 'venue_1',
    guestName: 'John Doe',
    diners: 4,
    status: 'CONFIRMED',
    fee: 120,
    bookingTime: new Date(),
    createdAt: new Date(),
    ...overrides,
  }
}

// Handler overrides for specific tests
export function mockBookingError() {
  server.use(
    http.get('/api/bookings', () => {
      return handleError('INTERNAL_ERROR', 'Test error', 500)
    })
  )
}
```

## 📋 Handler Development Checklist

For each new handler:
- [ ] Implement basic CRUD operations
- [ ] Add realistic latency simulation
- [ ] Include error scenarios (5% error rate)
- [ ] Support filtering and pagination
- [ ] Implement role-based data masking
- [ ] Add optimistic update support
- [ ] Include validation for request data
- [ ] Generate realistic response metadata
- [ ] Support demo scenario requirements
- [ ] Add comprehensive test coverage

## 🎯 Demo Data Requirements

Each handler should support these demo scenarios:
1. **Portfolio Management**: Multi-venue data with aggregation
2. **Revenue Control**: Pricing changes with impact calculations
3. **Loss Management**: Booking status updates with metric recalculation
4. **Commission Strategy**: Promoter tier changes with preview
5. **RBAC Preview**: Role-based data visibility differences

---

This MSW setup provides a robust foundation for realistic API mocking that supports all PRIMA Partner Dashboard development and testing needs.
