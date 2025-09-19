# Coding Standards

Comprehensive coding standards and best practices for the PRIMA Partner Dashboard to ensure consistent, maintainable, and high-quality code.

## 🎯 General Principles

### Code Quality Standards
1. **Readability**: Code should be self-documenting and easy to understand
2. **Consistency**: Follow established patterns throughout the codebase
3. **Maintainability**: Write code that is easy to modify and extend
4. **Performance**: Consider performance implications of code decisions
5. **Security**: Follow secure coding practices and validate inputs
6. **Accessibility**: Ensure all UI code meets WCAG 2.1 AA standards

## 📝 TypeScript Standards

### Type Definitions
```typescript
// ✅ Good - Explicit interface definitions
interface BookingFilters {
  status?: BookingStatus[]
  dateRange: {
    from: Date
    to: Date
  }
  venueId?: string
  promoterId?: string
}

// ✅ Good - Union types for constants
type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'NO_SHOW' | 'COMPLETED'

// ✅ Good - Generic type constraints
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  timestamp: string
}

// ❌ Avoid - Any types
const filters: any = { status: 'confirmed' }

// ❌ Avoid - Implicit any
function processData(data) {
  return data.map(item => item.value)
}
```

### Strict Mode Configuration
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Naming Conventions
```typescript
// ✅ Good - PascalCase for types and interfaces
interface UserProfile { }
type BookingStatus = string
class DataProcessor { }

// ✅ Good - camelCase for variables and functions
const userEmail = 'user@example.com'
const getUserProfile = (id: string) => { }

// ✅ Good - SCREAMING_SNAKE_CASE for constants
const API_BASE_URL = 'https://api.prima.com'
const MAX_RETRY_ATTEMPTS = 3

// ✅ Good - PascalCase for React components
function BookingCard({ booking }: BookingCardProps) { }
const KPIWidget = memo(({ data }: KPIWidgetProps) => { })

// ❌ Avoid - Inconsistent naming
const User_Profile = { }  // Should be UserProfile
const getuser_profile = () => { }  // Should be getUserProfile
```

## ⚛️ React Component Standards

### Component Structure
```typescript
// ✅ Good - Complete component structure
import { forwardRef, memo, useCallback, useMemo } from 'react'
import { cn } from '@/lib/utils'

// 1. Props interface with proper documentation
interface KPICardProps {
  /** Card title */
  title: string
  /** Numeric value to display */
  value: number
  /** Optional subtitle */
  subtitle?: string
  /** Change indicator */
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  /** Click handler for drill-through */
  onDrillThrough?: () => void
  /** Custom CSS class */
  className?: string
}

// 2. Component implementation with forwardRef for ref forwarding
export const KPICard = memo(forwardRef<HTMLDivElement, KPICardProps>(
  ({ title, value, subtitle, change, onDrillThrough, className }, ref) => {
    // 3. Memoized values for expensive calculations
    const formattedValue = useMemo(() => {
      return new Intl.NumberFormat('en-US').format(value)
    }, [value])

    // 4. Memoized event handlers
    const handleClick = useCallback(() => {
      onDrillThrough?.()
    }, [onDrillThrough])

    // 5. Early returns for conditional rendering
    if (!title) {
      return null
    }

    // 6. JSX with proper accessibility attributes
    return (
      <div
        ref={ref}
        className={cn(
          'bg-card text-card-foreground rounded-lg border p-4',
          onDrillThrough && 'cursor-pointer hover:shadow-md',
          className
        )}
        onClick={handleClick}
        role={onDrillThrough ? 'button' : undefined}
        tabIndex={onDrillThrough ? 0 : undefined}
        onKeyDown={(e) => {
          if (onDrillThrough && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            handleClick()
          }
        }}
      >
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
        {change && (
          <div className="flex items-center mt-1">
            <ChangeIndicator change={change} />
          </div>
        )}
      </div>
    )
  }
))

KPICard.displayName = 'KPICard'
```

### Hooks Guidelines
```typescript
// ✅ Good - Custom hook with proper naming and typing
function useBookingFilters(initialFilters: BookingFilters) {
  const [filters, setFilters] = useState<BookingFilters>(initialFilters)
  const [isLoading, setIsLoading] = useState(false)

  const updateFilter = useCallback((key: keyof BookingFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  return {
    filters,
    isLoading,
    updateFilter,
    resetFilters,
  }
}

// ✅ Good - Effect with proper dependencies
useEffect(() => {
  const fetchBookings = async () => {
    setIsLoading(true)
    try {
      const response = await api.getBookings(filters)
      setBookings(response.data)
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  fetchBookings()
}, [filters]) // Clear dependency array

// ❌ Avoid - Missing dependencies
useEffect(() => {
  fetchData(someValue)
}, []) // Missing someValue dependency
```

### Event Handlers
```typescript
// ✅ Good - Proper event handler typing
const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  const formData = new FormData(event.currentTarget)
  onSubmit(formData)
}, [onSubmit])

const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = event.target
  setFormData(prev => ({ ...prev, [name]: value }))
}, [])

// ✅ Good - Keyboard event handling
const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onClick?.()
  }
}, [onClick])
```

## 🎨 Styling Standards

### Tailwind CSS Usage
```tsx
// ✅ Good - Semantic class organization
<div className={cn(
  // Layout
  'flex items-center justify-between',
  // Spacing
  'p-4 gap-3',
  // Appearance
  'bg-card text-card-foreground',
  'border rounded-lg shadow-sm',
  // States
  'hover:shadow-md transition-shadow',
  // Conditional classes
  isActive && 'ring-2 ring-primary',
  className
)}>

// ✅ Good - Component variants with CVA
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

// ❌ Avoid - Inline styles that bypass design tokens
<div style={{ backgroundColor: '#8B5CF6', color: '#FFFFFF' }}>

// ❌ Avoid - Hard-coded color values
<div className="bg-purple-500 text-white">
```

### CSS Custom Properties
```css
/* ✅ Good - Use design tokens */
.kpi-card {
  background: hsl(var(--card));
  color: hsl(var(--card-foreground));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
}

/* ✅ Good - Theme-aware transitions */
.button {
  background: hsl(var(--primary));
  transition: background-color 200ms ease-in-out;
}

.button:hover {
  background: hsl(var(--primary) / 0.9);
}

/* ❌ Avoid - Hard-coded values */
.card {
  background: #ffffff;
  color: #000000;
  border: 1px solid #e5e7eb;
}
```

## 📊 State Management Standards

### RTK Query Patterns
```typescript
// ✅ Good - Proper API slice definition
export const bookingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query<BookingsResponse, BookingFilters>({
      query: (filters) => ({
        url: '/bookings',
        params: {
          ...filters,
          dateRange: filters.dateRange ? {
            from: filters.dateRange.from.toISOString(),
            to: filters.dateRange.to.toISOString(),
          } : undefined,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Booking' as const, id })),
              { type: 'Booking', id: 'LIST' },
            ]
          : [{ type: 'Booking', id: 'LIST' }],
    }),

    updateBookingStatus: builder.mutation<Booking, { id: string; status: BookingStatus }>({
      query: ({ id, status }) => ({
        url: `/bookings/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Booking', id },
        { type: 'Booking', id: 'LIST' },
        { type: 'Metrics', id: 'OVERVIEW' },
      ],
      // Optimistic update
      onQueryStarted: async ({ id, status }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          bookingsApi.util.updateQueryData('getBookings', {}, (draft) => {
            const booking = draft.items.find((b) => b.id === id)
            if (booking) {
              booking.status = status
              booking.updatedAt = new Date().toISOString()
            }
          })
        )
        
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
  }),
})

export const { useGetBookingsQuery, useUpdateBookingStatusMutation } = bookingsApi
```

### Context Patterns
```typescript
// ✅ Good - Proper context implementation
interface VenueContextType {
  selectedVenue: Venue | null
  availableVenues: Venue[]
  isPortfolioView: boolean
  selectVenue: (venueId: string | null) => void
  isLoading: boolean
  error: string | null
}

const VenueContext = createContext<VenueContextType | undefined>(undefined)

export function VenueProvider({ children }: { children: React.ReactNode }) {
  // Implementation...
  
  const value = useMemo(() => ({
    selectedVenue,
    availableVenues,
    isPortfolioView,
    selectVenue,
    isLoading,
    error,
  }), [selectedVenue, availableVenues, isPortfolioView, selectVenue, isLoading, error])

  return (
    <VenueContext.Provider value={value}>
      {children}
    </VenueContext.Provider>
  )
}

export function useVenueContext() {
  const context = useContext(VenueContext)
  if (context === undefined) {
    throw new Error('useVenueContext must be used within a VenueProvider')
  }
  return context
}
```

## 🧪 Testing Standards

### Unit Test Structure
```typescript
// ✅ Good - Comprehensive test structure
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { KPICard } from '../kpi-card'

describe('KPICard', () => {
  const defaultProps = {
    title: 'Total Bookings',
    value: 142,
  }

  test('renders title and value correctly', () => {
    render(<KPICard {...defaultProps} />)
    
    expect(screen.getByText('Total Bookings')).toBeInTheDocument()
    expect(screen.getByText('142')).toBeInTheDocument()
  })

  test('formats large numbers correctly', () => {
    render(<KPICard {...defaultProps} value={1234567} />)
    
    expect(screen.getByText('1,234,567')).toBeInTheDocument()
  })

  test('handles drill-through click', async () => {
    const user = userEvent.setup()
    const onDrillThrough = jest.fn()
    
    render(
      <KPICard 
        {...defaultProps} 
        onDrillThrough={onDrillThrough} 
      />
    )
    
    await user.click(screen.getByRole('button'))
    expect(onDrillThrough).toHaveBeenCalledTimes(1)
  })

  test('handles keyboard navigation', async () => {
    const user = userEvent.setup()
    const onDrillThrough = jest.fn()
    
    render(
      <KPICard 
        {...defaultProps} 
        onDrillThrough={onDrillThrough} 
      />
    )
    
    const button = screen.getByRole('button')
    button.focus()
    await user.keyboard('{Enter}')
    
    expect(onDrillThrough).toHaveBeenCalledTimes(1)
  })

  test('applies custom className', () => {
    const { container } = render(
      <KPICard {...defaultProps} className="custom-class" />
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
```

### Integration Test Patterns
```typescript
// ✅ Good - Integration test with MSW
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { renderHook, waitFor } from '@testing-library/react'
import { createTestWrapper } from '../test-utils'
import { useGetBookingsQuery } from '../bookings-api'

const server = setupServer(
  http.get('/api/bookings', () => {
    return HttpResponse.json({
      items: [
        {
          id: 'booking-1',
          guestName: 'John Doe',
          status: 'CONFIRMED',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ],
      total: 1,
    })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Bookings API Integration', () => {
  test('fetches bookings successfully', async () => {
    const { result } = renderHook(() => useGetBookingsQuery({}), {
      wrapper: createTestWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.items).toHaveLength(1)
    expect(result.current.data?.items[0].guestName).toBe('John Doe')
  })
})
```

## 🚀 Performance Standards

### Bundle Optimization
```typescript
// ✅ Good - Dynamic imports for code splitting
const BookingTable = lazy(() => import('./booking-table'))
const PromoterChart = lazy(() => import('./promoter-chart'))

// ✅ Good - Specific imports to reduce bundle size
import { formatDate } from '@/lib/utils/date'
import { formatCurrency } from '@/lib/utils/currency'

// ✅ Good - Tree-shakeable exports
export { formatDate } from './date'
export { formatCurrency } from './currency'
export { validateEmail } from './validation'

// ❌ Avoid - Default exports that hurt tree-shaking
export default {
  formatDate,
  formatCurrency,
  validateEmail,
}

// ❌ Avoid - Importing entire libraries
import * as _ from 'lodash'
```

### React Performance
```typescript
// ✅ Good - Memoization for expensive components
const BookingRow = memo(({ booking, onStatusChange }: BookingRowProps) => {
  const handleStatusChange = useCallback((status: BookingStatus) => {
    onStatusChange(booking.id, status)
  }, [booking.id, onStatusChange])

  return (
    <tr onClick={handleStatusChange}>
      <td>{booking.guestName}</td>
      <td>{booking.status}</td>
    </tr>
  )
})

// ✅ Good - Memoized selectors
const selectBookingsByStatus = useMemo(() => 
  createSelector(
    [(state: RootState) => state.bookings.items, (_, status: BookingStatus) => status],
    (bookings, status) => bookings.filter(b => b.status === status)
  ),
  []
)
```

## 🔒 Security Standards

### Input Validation
```typescript
// ✅ Good - Zod schema validation
import { z } from 'zod'

const BookingFormSchema = z.object({
  guestName: z.string().min(1, 'Guest name is required').max(100),
  guestEmail: z.string().email('Invalid email format'),
  diners: z.number().min(1).max(20),
  date: z.string().refine((date) => {
    const parsedDate = new Date(date)
    return parsedDate > new Date() // Future date only
  }, 'Date must be in the future'),
})

type BookingFormData = z.infer<typeof BookingFormSchema>

// ✅ Good - Server-side validation
export async function createBooking(data: unknown) {
  try {
    const validatedData = BookingFormSchema.parse(data)
    // Process validated data
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.issues }
    }
    throw error
  }
}
```

### Environment Variables
```typescript
// ✅ Good - Environment variable validation
const env = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_MSW_ENABLED: z.enum(['true', 'false']),
  NODE_ENV: z.enum(['development', 'test', 'production']),
}).parse(process.env)

// ✅ Good - Type-safe environment access
export const config = {
  appUrl: env.NEXT_PUBLIC_APP_URL,
  mswEnabled: env.NEXT_PUBLIC_MSW_ENABLED === 'true',
  isDevelopment: env.NODE_ENV === 'development',
} as const
```

## 📋 File Organization Standards

### Project Structure
```
src/
├── app/                        # Next.js App Router
│   ├── (prima)/               # PRIMA route group
│   │   ├── layout.tsx         # PRIMA layout
│   │   ├── overview/
│   │   │   └── page.tsx
│   │   └── bookings/
│   │       └── page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/                 # Reusable components
│   ├── ui/                    # Base shadcn/ui components
│   │   ├── button.tsx
│   │   └── card.tsx
│   ├── prima/                 # Business-specific components
│   │   ├── kpi-card/
│   │   │   ├── index.tsx      # Main component
│   │   │   ├── kpi-card.test.tsx
│   │   │   └── kpi-card.stories.tsx
│   │   └── venue-selector/
│   └── layout/                # Layout components
├── lib/                       # Utilities and configuration
│   ├── store/                 # Redux store
│   │   ├── api/
│   │   │   ├── bookings.ts
│   │   │   └── venues.ts
│   │   └── store.ts
│   ├── utils/                 # Utility functions
│   │   ├── date.ts
│   │   ├── currency.ts
│   │   └── validation.ts
│   └── constants.ts
├── types/                     # TypeScript definitions
│   ├── api.ts
│   ├── booking.ts
│   └── venue.ts
└── hooks/                     # Custom React hooks
    ├── use-booking-filters.ts
    └── use-venue-context.ts
```

### File Naming Conventions
```
# React components - PascalCase
KPICard.tsx
VenueSelector.tsx
BookingStatusBadge.tsx

# Utilities and hooks - kebab-case
date-utils.ts
use-booking-filters.ts
format-currency.ts

# Types and interfaces - kebab-case
booking-types.ts
api-responses.ts
venue-models.ts

# Test files - match source file name + .test
kpi-card.test.tsx
booking-utils.test.ts
venue-context.test.tsx
```

## ✅ Code Review Checklist

### Functionality
- [ ] Code solves the intended problem correctly
- [ ] All edge cases are handled
- [ ] Error states are properly managed
- [ ] Loading states are implemented

### Code Quality
- [ ] TypeScript strict mode compliance
- [ ] No `any` types or `@ts-ignore` comments
- [ ] Proper error handling with try/catch
- [ ] Console.log statements removed

### Performance
- [ ] No unnecessary re-renders
- [ ] Expensive operations are memoized
- [ ] Images are optimized
- [ ] Bundle size impact considered

### Accessibility
- [ ] Proper ARIA labels and descriptions
- [ ] Keyboard navigation supported
- [ ] Color contrast requirements met
- [ ] Screen reader compatibility

### Testing
- [ ] Unit tests cover main functionality
- [ ] Integration tests for user flows
- [ ] Edge cases are tested
- [ ] Tests are meaningful and reliable

### Design System
- [ ] Uses existing design tokens
- [ ] No hard-coded colors or spacing
- [ ] Follows established component patterns
- [ ] Responsive design implemented

---

These coding standards ensure consistent, maintainable, and high-quality code throughout the PRIMA Partner Dashboard project.
