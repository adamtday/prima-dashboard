# Unit Testing Guidelines

Comprehensive guidelines for writing effective unit tests in the PRIMA Partner Dashboard, focusing on business logic, utilities, and component functions.

## 🎯 Unit Testing Philosophy

**Purpose**: Validate individual functions, calculations, and business logic in isolation to ensure correctness and prevent regressions.

**Coverage Target**: >85% statement coverage for business logic
**Test-to-Code Ratio**: Aim for 1:1 ratio in critical business logic modules

## 🧪 What to Unit Test

### High Priority (Must Test)
1. **Financial Calculations** - Pricing, commissions, payouts
2. **Business Logic** - Booking validation, status transitions
3. **Data Transformations** - API response formatting, aggregations
4. **Utility Functions** - Date formatting, validation, filtering
5. **State Management** - Reducers, selectors, derived state

### Medium Priority (Should Test)
1. **Form Validation** - Input validation rules
2. **Sorting & Filtering** - List manipulation logic
3. **Format Functions** - Currency, date, percentage formatting
4. **Configuration Logic** - Feature flags, environment setup

### Low Priority (Optional)
1. **Simple Getters/Setters** - Basic property access
2. **Pure UI Logic** - Styling decisions, layout calculations
3. **Third-party Integrations** - External library wrappers

## 📊 Business Logic Testing

### Pricing Calculations
```typescript
// src/lib/pricing/__tests__/calculations.test.ts
import { 
  calculatePrimePricing, 
  calculateNonPrimePricing,
  calculatePlatformFee,
  calculateTotalBookingCost 
} from '../calculations'

describe('Pricing Calculations', () => {
  describe('Prime Pricing', () => {
    test('calculates base price for 2 diners correctly', () => {
      const config = {
        baseFor2: 80,
        additionalPerPerson: 30,
        platformFeePercent: 0.1
      }
      
      const result = calculatePrimePricing(2, config)
      
      expect(result.base).toBe(80)
      expect(result.additional).toBe(0)
      expect(result.subtotal).toBe(80)
      expect(result.platformFee).toBe(8)
      expect(result.total).toBe(88)
    })
    
    test('calculates additional person charges correctly', () => {
      const config = {
        baseFor2: 80,
        additionalPerPerson: 30,
        platformFeePercent: 0.1
      }
      
      const result = calculatePrimePricing(6, config)
      
      expect(result.base).toBe(80)
      expect(result.additional).toBe(120) // 4 additional * $30
      expect(result.subtotal).toBe(200)
      expect(result.platformFee).toBe(20)
      expect(result.total).toBe(220)
    })
    
    test('handles edge case of 1 diner', () => {
      const config = {
        baseFor2: 80,
        additionalPerPerson: 30,
        platformFeePercent: 0.1
      }
      
      const result = calculatePrimePricing(1, config)
      
      expect(result.base).toBe(80) // Still charges base for 2
      expect(result.additional).toBe(0)
      expect(result.total).toBe(88)
    })
    
    test('throws error for invalid diner count', () => {
      const config = {
        baseFor2: 80,
        additionalPerPerson: 30,
        platformFeePercent: 0.1
      }
      
      expect(() => calculatePrimePricing(0, config)).toThrow('Diner count must be positive')
      expect(() => calculatePrimePricing(-1, config)).toThrow('Diner count must be positive')
    })
  })
  
  describe('Non-Prime Pricing', () => {
    test('calculates per-diner pricing correctly', () => {
      const config = {
        perDiner: 25,
        platformFeePercent: 0.1
      }
      
      const result = calculateNonPrimePricing(4, config)
      
      expect(result.base).toBe(100) // 4 * $25
      expect(result.platformFee).toBe(10) // 10% of $100
      expect(result.total).toBe(110)
    })
    
    test('handles minimum pricing constraints', () => {
      const config = {
        perDiner: 25,
        platformFeePercent: 0.1,
        minimumAmount: 60
      }
      
      const result = calculateNonPrimePricing(2, config)
      
      expect(result.base).toBe(60) // Minimum applied instead of $50
      expect(result.platformFee).toBe(6)
      expect(result.total).toBe(66)
    })
  })
  
  describe('Platform Fee Calculations', () => {
    test('calculates percentage-based fees correctly', () => {
      expect(calculatePlatformFee(100, 0.1)).toBe(10)
      expect(calculatePlatformFee(150, 0.15)).toBe(22.5)
      expect(calculatePlatformFee(200, 0.08)).toBe(16)
    })
    
    test('rounds to 2 decimal places', () => {
      expect(calculatePlatformFee(133.33, 0.075)).toBe(10) // 9.99975 rounded
    })
    
    test('handles zero amounts', () => {
      expect(calculatePlatformFee(0, 0.1)).toBe(0)
    })
  })
})
```

### Commission Calculations
```typescript
// src/lib/commissions/__tests__/calculations.test.ts
import { 
  calculateCommission,
  calculateMonthlyCommissions,
  determineCommissionTier,
  applyCommissionRules 
} from '../calculations'

describe('Commission Calculations', () => {
  describe('Per-Cover Commission Model', () => {
    test('calculates per-cover commissions correctly', () => {
      const booking = {
        diners: 4,
        fee: 120,
        status: 'CONFIRMED'
      }
      
      const assignment = {
        model: 'PER_COVER',
        tier: 'STANDARD',
        rate: 8 // $8 per diner
      }
      
      const result = calculateCommission(booking, assignment)
      
      expect(result.amount).toBe(32) // 4 diners * $8
      expect(result.calculation.base).toBe(4)
      expect(result.calculation.rate).toBe(8)
    })
    
    test('only calculates for confirmed bookings', () => {
      const booking = {
        diners: 4,
        fee: 120,
        status: 'CANCELLED'
      }
      
      const assignment = {
        model: 'PER_COVER',
        tier: 'STANDARD',
        rate: 8
      }
      
      const result = calculateCommission(booking, assignment)
      
      expect(result.amount).toBe(0)
      expect(result.reason).toBe('BOOKING_NOT_CONFIRMED')
    })
  })
  
  describe('Percentage-Based Commission Model', () => {
    test('calculates percentage of spend correctly', () => {
      const booking = {
        diners: 4,
        fee: 120,
        status: 'CONFIRMED'
      }
      
      const assignment = {
        model: 'PERCENT_OF_SPEND',
        tier: 'PREMIUM',
        rate: 0.08 // 8%
      }
      
      const result = calculateCommission(booking, assignment)
      
      expect(result.amount).toBe(9.6) // $120 * 8%
      expect(result.calculation.base).toBe(120)
      expect(result.calculation.rate).toBe(0.08)
    })
    
    test('applies maximum commission caps', () => {
      const booking = {
        diners: 8,
        fee: 500,
        status: 'CONFIRMED'
      }
      
      const assignment = {
        model: 'PERCENT_OF_SPEND',
        tier: 'VIP',
        rate: 0.12,
        maxCommission: 50
      }
      
      const result = calculateCommission(booking, assignment)
      
      expect(result.amount).toBe(50) // Capped at $50 instead of $60
      expect(result.calculation.cappedAt).toBe(50)
    })
  })
  
  describe('Tiered Commission Rules', () => {
    test('applies correct tier rates based on performance', () => {
      const promoterMetrics = {
        monthlyBookings: 30,
        conversionRate: 0.18,
        cancelRate: 0.05
      }
      
      const tier = determineCommissionTier(promoterMetrics)
      expect(tier).toBe('VIP') // High performance
    })
    
    test('downgrades tier for poor performance', () => {
      const promoterMetrics = {
        monthlyBookings: 5,
        conversionRate: 0.06,
        cancelRate: 0.20
      }
      
      const tier = determineCommissionTier(promoterMetrics)
      expect(tier).toBe('STANDARD') // Poor performance
    })
  })
})
```

### Booking Status Logic
```typescript
// src/lib/bookings/__tests__/status.test.ts
import { 
  validateStatusTransition,
  getValidTransitions,
  applyStatusChange,
  calculateBookingMetrics 
} from '../status'

describe('Booking Status Management', () => {
  describe('Status Transitions', () => {
    test('allows valid status transitions', () => {
      expect(validateStatusTransition('PENDING', 'CONFIRMED')).toBe(true)
      expect(validateStatusTransition('CONFIRMED', 'CANCELLED')).toBe(true)
      expect(validateStatusTransition('CONFIRMED', 'NO_SHOW')).toBe(true)
      expect(validateStatusTransition('CONFIRMED', 'COMPLETED')).toBe(true)
    })
    
    test('prevents invalid status transitions', () => {
      expect(validateStatusTransition('CANCELLED', 'CONFIRMED')).toBe(false)
      expect(validateStatusTransition('NO_SHOW', 'CONFIRMED')).toBe(false)
      expect(validateStatusTransition('COMPLETED', 'PENDING')).toBe(false)
    })
    
    test('prevents transitions to same status', () => {
      expect(validateStatusTransition('CONFIRMED', 'CONFIRMED')).toBe(false)
    })
  })
  
  describe('Available Transitions', () => {
    test('returns correct transitions for pending booking', () => {
      const transitions = getValidTransitions('PENDING')
      expect(transitions).toEqual(['CONFIRMED', 'CANCELLED'])
    })
    
    test('returns correct transitions for confirmed booking', () => {
      const transitions = getValidTransitions('CONFIRMED')
      expect(transitions).toEqual(['CANCELLED', 'NO_SHOW', 'COMPLETED'])
    })
    
    test('returns empty array for final statuses', () => {
      expect(getValidTransitions('CANCELLED')).toEqual([])
      expect(getValidTransitions('NO_SHOW')).toEqual([])
      expect(getValidTransitions('COMPLETED')).toEqual([])
    })
  })
  
  describe('Status Change Application', () => {
    test('applies status change with timestamp', () => {
      const booking = {
        id: 'booking-1',
        status: 'PENDING',
        confirmedAt: null
      }
      
      const result = applyStatusChange(booking, 'CONFIRMED', 'admin-1')
      
      expect(result.status).toBe('CONFIRMED')
      expect(result.confirmedAt).toBeInstanceOf(Date)
      expect(result.updatedBy).toBe('admin-1')
    })
    
    test('preserves original timestamps when not changing', () => {
      const originalDate = new Date('2025-01-01')
      const booking = {
        id: 'booking-1',
        status: 'CONFIRMED',
        confirmedAt: originalDate,
        cancelledAt: null
      }
      
      const result = applyStatusChange(booking, 'CANCELLED', 'admin-1')
      
      expect(result.confirmedAt).toBe(originalDate) // Preserved
      expect(result.cancelledAt).toBeInstanceOf(Date) // New timestamp
    })
  })
})
```

## 🔧 Utility Function Testing

### Date & Time Utilities
```typescript
// src/lib/utils/__tests__/date.test.ts
import { 
  formatDate,
  formatRelativeTime,
  getDateRange,
  isWithinBusinessHours,
  calculateBusinessDays 
} from '../date'

describe('Date Utilities', () => {
  describe('Date Formatting', () => {
    test('formats dates in different locales', () => {
      const date = new Date('2025-03-15T14:30:00Z')
      
      expect(formatDate(date, 'en-US')).toBe('March 15, 2025')
      expect(formatDate(date, 'en-GB')).toBe('15 March 2025')
      expect(formatDate(date, 'short')).toBe('3/15/25')
    })
    
    test('handles invalid dates gracefully', () => {
      expect(formatDate(null)).toBe('Invalid Date')
      expect(formatDate(undefined)).toBe('Invalid Date')
      expect(formatDate(new Date('invalid'))).toBe('Invalid Date')
    })
  })
  
  describe('Relative Time', () => {
    test('calculates relative time correctly', () => {
      const now = new Date('2025-03-15T12:00:00Z')
      
      // Future dates
      const in1Hour = new Date('2025-03-15T13:00:00Z')
      expect(formatRelativeTime(in1Hour, now)).toBe('in 1 hour')
      
      const in2Days = new Date('2025-03-17T12:00:00Z')
      expect(formatRelativeTime(in2Days, now)).toBe('in 2 days')
      
      // Past dates
      const ago30Min = new Date('2025-03-15T11:30:00Z')
      expect(formatRelativeTime(ago30Min, now)).toBe('30 minutes ago')
      
      const ago1Week = new Date('2025-03-08T12:00:00Z')
      expect(formatRelativeTime(ago1Week, now)).toBe('1 week ago')
    })
  })
  
  describe('Date Range Calculations', () => {
    test('calculates common date ranges correctly', () => {
      const baseDate = new Date('2025-03-15T12:00:00Z')
      
      const thisWeek = getDateRange('thisWeek', baseDate)
      expect(thisWeek.from.getDate()).toBe(9) // Previous Sunday
      expect(thisWeek.to.getDate()).toBe(15) // Current Saturday
      
      const lastMonth = getDateRange('lastMonth', baseDate)
      expect(lastMonth.from.getMonth()).toBe(1) // February
      expect(lastMonth.to.getMonth()).toBe(1) // February
    })
  })
  
  describe('Business Hours Validation', () => {
    test('correctly identifies business hours', () => {
      const businessHours = {
        monday: { open: '09:00', close: '17:00' },
        tuesday: { open: '09:00', close: '17:00' },
        // ... other days
        sunday: null // Closed
      }
      
      // Monday 2PM
      const mondayAfternoon = new Date('2025-03-17T14:00:00Z')
      expect(isWithinBusinessHours(mondayAfternoon, businessHours)).toBe(true)
      
      // Sunday (closed)
      const sunday = new Date('2025-03-16T14:00:00Z')
      expect(isWithinBusinessHours(sunday, businessHours)).toBe(false)
      
      // Monday 8PM (after hours)
      const mondayEvening = new Date('2025-03-17T20:00:00Z')
      expect(isWithinBusinessHours(mondayEvening, businessHours)).toBe(false)
    })
  })
})
```

### Data Transformation Testing
```typescript
// src/lib/utils/__tests__/transformers.test.ts
import { 
  aggregateBookingsByDay,
  calculateKPIMetrics,
  transformApiResponse,
  groupPromotersByTier 
} from '../transformers'

describe('Data Transformers', () => {
  describe('Booking Aggregation', () => {
    test('aggregates bookings by day correctly', () => {
      const bookings = [
        { id: '1', bookingTime: new Date('2025-03-15'), fee: 100, status: 'CONFIRMED' },
        { id: '2', bookingTime: new Date('2025-03-15'), fee: 120, status: 'CONFIRMED' },
        { id: '3', bookingTime: new Date('2025-03-16'), fee: 80, status: 'CONFIRMED' },
        { id: '4', bookingTime: new Date('2025-03-15'), fee: 90, status: 'CANCELLED' },
      ]
      
      const result = aggregateBookingsByDay(bookings)
      
      expect(result['2025-03-15']).toEqual({
        date: '2025-03-15',
        bookings: 2, // Only confirmed
        revenue: 220, // $100 + $120
        cancelledBookings: 1,
        averageBookingValue: 110
      })
      
      expect(result['2025-03-16']).toEqual({
        date: '2025-03-16',
        bookings: 1,
        revenue: 80,
        cancelledBookings: 0,
        averageBookingValue: 80
      })
    })
  })
  
  describe('KPI Calculations', () => {
    test('calculates overview KPIs correctly', () => {
      const data = {
        bookings: [
          { diners: 4, fee: 120, status: 'CONFIRMED', type: 'PRIME' },
          { diners: 2, fee: 60, status: 'CONFIRMED', type: 'NON_PRIME' },
          { diners: 6, fee: 180, status: 'NO_SHOW', type: 'PRIME' },
        ],
        previousPeriodBookings: [
          { diners: 4, fee: 100, status: 'CONFIRMED', type: 'PRIME' },
          { diners: 2, fee: 50, status: 'CONFIRMED', type: 'NON_PRIME' },
        ]
      }
      
      const result = calculateKPIMetrics(data)
      
      expect(result.totalDiners).toEqual({
        current: 6, // 4 + 2 (only confirmed)
        previous: 6, // 4 + 2
        change: 0,
        changePercent: 0
      })
      
      expect(result.totalRevenue).toEqual({
        current: 180, // $120 + $60
        previous: 150, // $100 + $50
        change: 30,
        changePercent: 20
      })
      
      expect(result.primeConversionRate).toEqual({
        current: 0.5, // 1 prime out of 2 confirmed
        previous: 0.5, // 1 prime out of 2 confirmed
        change: 0,
        changePercent: 0
      })
    })
  })
  
  describe('API Response Transformation', () => {
    test('transforms API responses to internal format', () => {
      const apiResponse = {
        data: [
          {
            id: 'booking_123',
            guest_name: 'John Doe',
            party_size: 4,
            booking_time: '2025-03-15T19:00:00Z',
            total_fee: 120.50,
            status: 'confirmed'
          }
        ],
        meta: {
          total: 1,
          page: 1,
          per_page: 50
        }
      }
      
      const result = transformApiResponse(apiResponse, 'bookings')
      
      expect(result.items[0]).toEqual({
        id: 'booking_123',
        guestName: 'John Doe', // camelCase
        diners: 4, // renamed
        bookingTime: new Date('2025-03-15T19:00:00Z'), // parsed
        fee: 120.50, // renamed
        status: 'CONFIRMED' // uppercase
      })
      
      expect(result.pagination).toEqual({
        total: 1,
        page: 1,
        size: 50,
        hasNext: false,
        hasPrevious: false
      })
    })
  })
})
```

## 🎨 Component Logic Testing

### Form Validation Testing
```typescript
// src/components/forms/__tests__/validation.test.ts
import { 
  validatePricingForm,
  validatePromoterForm,
  validateBookingForm 
} from '../validation'

describe('Form Validation', () => {
  describe('Pricing Form Validation', () => {
    test('validates positive pricing values', () => {
      const validData = {
        nonPrime: { perDiner: 25, platformFeePercent: 0.1 },
        prime: { baseFor2: 80, additionalPerPerson: 30, platformFeePercent: 0.1 }
      }
      
      const result = validatePricingForm(validData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })
    
    test('rejects negative or zero pricing', () => {
      const invalidData = {
        nonPrime: { perDiner: -5, platformFeePercent: 0.1 },
        prime: { baseFor2: 0, additionalPerPerson: 30, platformFeePercent: 0.1 }
      }
      
      const result = validatePricingForm(invalidData)
      expect(result.isValid).toBe(false)
      expect(result.errors.nonPrime.perDiner).toBe('Must be greater than 0')
      expect(result.errors.prime.baseFor2).toBe('Must be greater than 0')
    })
    
    test('validates platform fee percentage limits', () => {
      const invalidData = {
        nonPrime: { perDiner: 25, platformFeePercent: 0.5 }, // 50%
        prime: { baseFor2: 80, additionalPerPerson: 30, platformFeePercent: -0.1 }
      }
      
      const result = validatePricingForm(invalidData)
      expect(result.isValid).toBe(false)
      expect(result.errors.nonPrime.platformFeePercent).toBe('Cannot exceed 30%')
      expect(result.errors.prime.platformFeePercent).toBe('Cannot be negative')
    })
  })
  
  describe('Promoter Form Validation', () => {
    test('validates required fields', () => {
      const incompleteData = {
        firstName: 'John',
        lastName: '', // Required field missing
        email: 'john@example.com'
      }
      
      const result = validatePromoterForm(incompleteData)
      expect(result.isValid).toBe(false)
      expect(result.errors.lastName).toBe('Last name is required')
    })
    
    test('validates email format', () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email'
      }
      
      const result = validatePromoterForm(invalidData)
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBe('Invalid email format')
    })
    
    test('validates phone number format', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '123-456-7890'
      }
      
      const result = validatePromoterForm(data)
      expect(result.isValid).toBe(true)
      
      // Invalid phone
      data.phone = '123'
      const invalidResult = validatePromoterForm(data)
      expect(invalidResult.isValid).toBe(false)
      expect(invalidResult.errors.phone).toBe('Invalid phone number format')
    })
  })
})
```

### Sorting & Filtering Logic
```typescript
// src/hooks/__tests__/usePromoterFiltering.test.ts
import { renderHook, act } from '@testing-library/react'
import { usePromoterFiltering } from '../usePromoterFiltering'

// Mock promoter data
const mockPromoters = [
  { id: '1', firstName: 'John', lastName: 'Smith', tier: 'VIP', status: 'ACTIVE', metrics: { bookings: 50 } },
  { id: '2', firstName: 'Jane', lastName: 'Doe', tier: 'PREMIUM', status: 'ACTIVE', metrics: { bookings: 30 } },
  { id: '3', firstName: 'Bob', lastName: 'Johnson', tier: 'STANDARD', status: 'INACTIVE', metrics: { bookings: 10 } },
]

describe('usePromoterFiltering', () => {
  test('filters by search term', () => {
    const { result } = renderHook(() => usePromoterFiltering(mockPromoters))
    
    act(() => {
      result.current.setFilters({ search: 'john' })
    })
    
    expect(result.current.filteredPromoters).toHaveLength(2)
    expect(result.current.filteredPromoters[0].firstName).toBe('John')
    expect(result.current.filteredPromoters[1].lastName).toBe('Johnson')
  })
  
  test('filters by tier', () => {
    const { result } = renderHook(() => usePromoterFiltering(mockPromoters))
    
    act(() => {
      result.current.setFilters({ tier: 'VIP' })
    })
    
    expect(result.current.filteredPromoters).toHaveLength(1)
    expect(result.current.filteredPromoters[0].tier).toBe('VIP')
  })
  
  test('filters by status', () => {
    const { result } = renderHook(() => usePromoterFiltering(mockPromoters))
    
    act(() => {
      result.current.setFilters({ status: 'ACTIVE' })
    })
    
    expect(result.current.filteredPromoters).toHaveLength(2)
    expect(result.current.filteredPromoters.every(p => p.status === 'ACTIVE')).toBe(true)
  })
  
  test('sorts by bookings descending', () => {
    const { result } = renderHook(() => usePromoterFiltering(mockPromoters))
    
    act(() => {
      result.current.setSortBy({ field: 'bookings', direction: 'desc' })
    })
    
    const sorted = result.current.filteredPromoters
    expect(sorted[0].metrics.bookings).toBe(50) // John
    expect(sorted[1].metrics.bookings).toBe(30) // Jane
    expect(sorted[2].metrics.bookings).toBe(10) // Bob
  })
  
  test('combines multiple filters', () => {
    const { result } = renderHook(() => usePromoterFiltering(mockPromoters))
    
    act(() => {
      result.current.setFilters({ 
        status: 'ACTIVE',
        tier: 'PREMIUM'
      })
    })
    
    expect(result.current.filteredPromoters).toHaveLength(1)
    expect(result.current.filteredPromoters[0].firstName).toBe('Jane')
  })
})
```

## 🔧 Test Utilities & Helpers

### Custom Test Utilities
```typescript
// src/test/utils.ts
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

// Create test wrapper with providers
export function renderWithProviders(
  ui: React.ReactElement,
  options: {
    initialEntries?: string[]
    queryClient?: QueryClient
  } = {}
) {
  const { initialEntries = ['/'], queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  }) } = options

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    )
  }

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...options }),
  }
}

// Custom matchers
export const customMatchers = {
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      }
    }
  },

  toHaveCurrencyValue(received: HTMLElement, expectedValue: number) {
    const text = received.textContent || ''
    const currencyRegex = /\$?([\d,]+\.?\d*)/
    const match = text.match(currencyRegex)
    
    if (!match) {
      return {
        message: () => `expected element to contain currency value, got "${text}"`,
        pass: false,
      }
    }
    
    const actualValue = parseFloat(match[1].replace(/,/g, ''))
    const pass = Math.abs(actualValue - expectedValue) < 0.01
    
    return {
      message: () => `expected ${actualValue} to equal ${expectedValue}`,
      pass,
    }
  }
}

// Test data generators
export const generateMockBooking = (overrides: Partial<Booking> = {}): Booking => ({
  id: `booking-${Math.random().toString(36).substr(2, 9)}`,
  venueId: 'venue-1',
  guestName: 'Test Guest',
  diners: 4,
  fee: 120,
  status: 'CONFIRMED',
  bookingTime: new Date(),
  createdAt: new Date(),
  ...overrides,
})

export const generateMockPromoter = (overrides: Partial<Promoter> = {}): Promoter => ({
  id: `promoter-${Math.random().toString(36).substr(2, 9)}`,
  firstName: 'Test',
  lastName: 'Promoter',
  email: 'test@example.com',
  tier: 'STANDARD',
  status: 'ACTIVE',
  metrics: {
    bookings: 15,
    revenue: 1800,
    conversionRate: 0.12,
  },
  ...overrides,
})
```

### Performance Testing Utilities
```typescript
// src/test/performance.ts
export function measureExecutionTime<T>(fn: () => T): { result: T; time: number } {
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  
  return {
    result,
    time: end - start
  }
}

export function expectWithinPerformanceBudget<T>(
  fn: () => T,
  budgetMs: number,
  description?: string
): T {
  const { result, time } = measureExecutionTime(fn)
  
  if (time > budgetMs) {
    throw new Error(
      `Performance budget exceeded: ${description || 'Operation'} took ${time.toFixed(2)}ms, budget was ${budgetMs}ms`
    )
  }
  
  return result
}

// Usage in tests
test('pricing calculation meets performance budget', () => {
  const config = { baseFor2: 80, additionalPerPerson: 30, platformFeePercent: 0.1 }
  
  expectWithinPerformanceBudget(
    () => calculatePrimePricing(6, config),
    5, // 5ms budget
    'Prime pricing calculation'
  )
})
```

## ✅ Unit Testing Checklist

### Before Writing Tests
- [ ] Identify the specific function/logic to test
- [ ] Understand expected inputs and outputs
- [ ] Consider edge cases and error conditions
- [ ] Determine appropriate test data

### Writing Tests
- [ ] Use descriptive test names
- [ ] Follow AAA pattern (Arrange, Act, Assert)
- [ ] Test one thing per test case
- [ ] Include positive and negative test cases
- [ ] Test edge cases and boundary conditions
- [ ] Mock external dependencies

### Test Quality
- [ ] Tests are deterministic (no flaky tests)
- [ ] Tests run quickly (< 100ms per test)
- [ ] Tests are isolated (no shared state)
- [ ] Clear error messages for failures
- [ ] Appropriate use of test utilities

### Coverage Goals
- [ ] All business logic functions tested
- [ ] All calculation functions tested
- [ ] Critical utility functions tested
- [ ] Error handling paths tested
- [ ] Edge cases covered

---

These unit testing guidelines ensure comprehensive coverage of business logic while maintaining test quality and performance standards.
