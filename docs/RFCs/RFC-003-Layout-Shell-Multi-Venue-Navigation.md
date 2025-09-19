# RFC-003: Layout Shell & Multi-Venue Navigation

## Summary

Implement the PRIMA Partner Dashboard layout shell with multi-venue navigation, venue selector, and responsive sidebar. This RFC creates the foundational layout structure that all subsequent modules will operate within, including the critical venue context switching functionality.

## Features Addressed

- **M1**: Multi-venue selector with context preservation across navigation
- **M3**: Portfolio view with aggregated metrics across all venues
- **M10**: Mobile-responsive design with touch-friendly interactions
- PRIMA route group structure and navigation
- Responsive layout shell with sidebar
- Global venue context management

## Technical Approach

### Layout Architecture

- **PRIMA Route Group**: Dedicated `(prima)` route structure
- **Responsive Sidebar**: Collapsible navigation with venue context
- **Venue Selector**: Prominent venue switching with context preservation
- **Global Controls**: Date range, search, theme toggle, user profile

### Architecture Considerations

- Builds upon RFC-001 authentication and RFC-002 data layer
- Provides layout foundation for all subsequent feature modules
- Implements multi-venue context preservation patterns
- Creates responsive navigation for mobile and desktop

## Dependencies

- **Builds Upon**: RFC-001 (Authentication), RFC-002 (Data Layer)
- **Enables**: RFC-004 (Overview), RFC-005 (Bookings), all feature modules

## Complexity: Medium

- Complex responsive layout with multi-venue context
- Venue switching with state preservation
- Integration with existing sidebar system
- Mobile navigation patterns

## Detailed Requirements

### 1. PRIMA Route Group Structure

#### Route Group Layout

```typescript
// src/app/(prima)/layout.tsx
import { Suspense } from 'react'
import { ProtectedRoute } from '@/lib/auth/protected-route'
import { PrimaLayoutShell } from '@/components/prima/layout-shell'
import { VenueContextProvider } from '@/lib/contexts/venue-context'
import { ErrorBoundary } from '@/components/error-boundary'

export default function PrimaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <VenueContextProvider>
          <PrimaLayoutShell>
            <Suspense fallback={<div>Loading...</div>}>
              {children}
            </Suspense>
          </PrimaLayoutShell>
        </VenueContextProvider>
      </ErrorBoundary>
    </ProtectedRoute>
  )
}
```

#### Route Structure

```
src/app/(prima)/
├── layout.tsx                 # PRIMA layout shell
├── overview/
│   └── page.tsx              # Overview dashboard
├── bookings/
│   └── page.tsx              # Booking management
├── pricing/
│   └── page.tsx              # Pricing configuration
├── promoters/
│   └── page.tsx              # Promoter management
├── finance/
│   └── page.tsx              # Financial operations
├── incentives/
│   └── page.tsx              # Incentive programs
├── commissions/
│   └── page.tsx              # Commission management
├── team/
│   └── page.tsx              # Team & RBAC
└── settings/
    └── page.tsx              # Settings
```

### 2. Venue Context Management

#### Venue Context Provider

```typescript
// src/lib/contexts/venue-context.tsx
'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { useGetVenuesQuery } from '@/lib/store/api/venues'
import { Venue } from '@/types/data'

interface VenueContextType {
  // Current venue selection
  selectedVenue: Venue | null
  selectedVenueId: string | null
  
  // All venues user has access to
  availableVenues: Venue[]
  
  // Portfolio mode (all venues)
  isPortfolioView: boolean
  
  // Actions
  selectVenue: (venueId: string | null) => void
  togglePortfolioView: () => void
  
  // State
  isLoading: boolean
  error: string | null
}

const VenueContext = createContext<VenueContextType | undefined>(undefined)

export function VenueContextProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null)
  const [isPortfolioView, setIsPortfolioView] = useState(true)
  
  const { 
    data: venues = [], 
    isLoading, 
    error 
  } = useGetVenuesQuery(undefined, {
    skip: !user?.id
  })

  // Initialize venue selection
  useEffect(() => {
    if (venues.length > 0 && !selectedVenueId) {
      // Check for stored preference or URL parameter
      const storedVenueId = localStorage.getItem('prima_selected_venue')
      const urlVenueId = new URLSearchParams(window.location.search).get('venue')
      
      if (urlVenueId && venues.find(v => v.id === urlVenueId)) {
        setSelectedVenueId(urlVenueId)
        setIsPortfolioView(false)
      } else if (storedVenueId && venues.find(v => v.id === storedVenueId)) {
        setSelectedVenueId(storedVenueId)
        setIsPortfolioView(false)
      } else if (venues.length === 1) {
        // Single venue - auto-select
        setSelectedVenueId(venues[0].id)
        setIsPortfolioView(false)
      }
      // Multiple venues - start in portfolio view
    }
  }, [venues, selectedVenueId])

  const selectVenue = useCallback((venueId: string | null) => {
    if (venueId === null) {
      // Portfolio view
      setSelectedVenueId(null)
      setIsPortfolioView(true)
      localStorage.removeItem('prima_selected_venue')
    } else {
      setSelectedVenueId(venueId)
      setIsPortfolioView(false)
      localStorage.setItem('prima_selected_venue', venueId)
    }
    
    // Update URL without navigation
    const url = new URL(window.location.href)
    if (venueId) {
      url.searchParams.set('venue', venueId)
    } else {
      url.searchParams.delete('venue')
    }
    window.history.replaceState({}, '', url.toString())
  }, [])

  const togglePortfolioView = useCallback(() => {
    if (isPortfolioView) {
      // Switch to first venue
      if (venues.length > 0) {
        selectVenue(venues[0].id)
      }
    } else {
      // Switch to portfolio view
      selectVenue(null)
    }
  }, [isPortfolioView, venues, selectVenue])

  const selectedVenue = selectedVenueId 
    ? venues.find(v => v.id === selectedVenueId) || null
    : null

  return (
    <VenueContext.Provider value={{
      selectedVenue,
      selectedVenueId,
      availableVenues: venues,
      isPortfolioView,
      selectVenue,
      togglePortfolioView,
      isLoading,
      error: error ? 'Failed to load venues' : null,
    }}>
      {children}
    </VenueContext.Provider>
  )
}

export const useVenueContext = () => {
  const context = useContext(VenueContext)
  if (context === undefined) {
    throw new Error('useVenueContext must be used within a VenueContextProvider')
  }
  return context
}
```

### 3. Layout Shell Component

#### Main Layout Shell

```typescript
// src/components/prima/layout-shell.tsx
'use client'

import { useState } from 'react'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { PrimaHeader } from './header'
import { PrimaBreadcrumb } from './breadcrumb'
import { VenueSelector } from './venue-selector'
import { cn } from '@/lib/utils'

interface PrimaLayoutShellProps {
  children: React.ReactNode
}

export function PrimaLayoutShell({ children }: PrimaLayoutShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          {/* Header with venue selector and controls */}
          <PrimaHeader />
          
          {/* Breadcrumb navigation */}
          <PrimaBreadcrumb />
          
          {/* Main content area */}
          <main className="flex-1 p-4 md:p-6">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

### 4. Venue Selector Component

#### Venue Selector Implementation

```typescript
// src/components/prima/venue-selector.tsx
'use client'

import { Check, ChevronDown, Building2, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { useVenueContext } from '@/lib/contexts/venue-context'
import { cn } from '@/lib/utils'

export function VenueSelector() {
  const {
    selectedVenue,
    availableVenues,
    isPortfolioView,
    selectVenue,
    togglePortfolioView,
    isLoading,
  } = useVenueContext()

  const [open, setOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 animate-pulse rounded bg-muted" />
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  const currentSelection = isPortfolioView 
    ? { name: 'All Venues', type: 'Portfolio' }
    : selectedVenue

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[200px] justify-between"
        >
          <div className="flex items-center space-x-2">
            {isPortfolioView ? (
              <BarChart3 className="h-4 w-4" />
            ) : (
              <Building2 className="h-4 w-4" />
            )}
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">
                {currentSelection?.name}
              </span>
              {currentSelection?.type && (
                <span className="text-xs text-muted-foreground">
                  {currentSelection.type}
                </span>
              )}
            </div>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search venues..." />
          <CommandList>
            <CommandEmpty>No venues found.</CommandEmpty>
            
            {/* Portfolio view option */}
            <CommandGroup heading="Portfolio View">
              <CommandItem
                onSelect={() => {
                  selectVenue(null)
                  setOpen(false)
                }}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <div className="font-medium">All Venues</div>
                    <div className="text-xs text-muted-foreground">
                      Portfolio overview
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "h-4 w-4",
                      isPortfolioView ? "opacity-100" : "opacity-0"
                    )}
                  />
                </div>
              </CommandItem>
            </CommandGroup>
            
            <CommandSeparator />
            
            {/* Individual venues */}
            <CommandGroup heading="Individual Venues">
              {availableVenues.map((venue) => (
                <CommandItem
                  key={venue.id}
                  onSelect={() => {
                    selectVenue(venue.id)
                    setOpen(false)
                  }}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <div className="font-medium">{venue.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {venue.type} • {venue.location.city}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {venue.tier}
                      </Badge>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedVenue?.id === venue.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

### 5. PRIMA Header Component

#### Header Implementation

```typescript
// src/components/prima/header.tsx
'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { VenueSelector } from './venue-selector'
import { GlobalSearch } from './global-search'
import { DateRangePicker } from '@/components/date-range-picker'
import { ThemeSwitch } from '@/components/theme-switch'
import { UserProfile } from '@/components/auth/user-profile'
import { useVenueContext } from '@/lib/contexts/venue-context'

export function PrimaHeader() {
  const { isPortfolioView, availableVenues } = useVenueContext()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      
      {/* Venue selector - prominently displayed */}
      <VenueSelector />
      
      <div className="ml-auto flex items-center gap-2">
        {/* Global search */}
        <GlobalSearch />
        
        {/* Date range picker */}
        <DateRangePicker />
        
        {/* Theme toggle */}
        <ThemeSwitch />
        
        {/* User profile */}
        <UserProfile />
      </div>
    </header>
  )
}
```

### 6. Responsive Navigation Updates

#### Updated Sidebar Data

```typescript
// src/components/layout/data/sidebar-data.tsx
import {
  BarChart3,
  Calendar,
  CreditCard,
  DollarSign,
  Gift,
  Settings,
  Trophy,
  Users,
  Utensils,
} from 'lucide-react'

export const sidebarData = {
  // ... existing data ...
  
  // Add PRIMA section
  prima: {
    title: "PRIMA Partner",
    items: [
      {
        title: "Overview",
        url: "/overview",
        icon: BarChart3,
        description: "Dashboard and key metrics"
      },
      {
        title: "Bookings",
        url: "/bookings", 
        icon: Calendar,
        description: "Manage reservations"
      },
      {
        title: "Pricing",
        url: "/pricing",
        icon: DollarSign,
        description: "Configure pricing rules"
      },
      {
        title: "Promoters",
        url: "/promoters",
        icon: Users,
        description: "Manage promoter network"
      },
      {
        title: "Finance",
        url: "/finance",
        icon: CreditCard,
        description: "Payments and payouts"
      },
      {
        title: "Incentives",
        url: "/incentives",
        icon: Gift,
        description: "Promoter incentive programs"
      },
      {
        title: "Commissions",
        url: "/commissions",
        icon: Trophy,
        description: "Commission structure"
      },
      {
        title: "Team",
        url: "/team",
        icon: Users,
        description: "Team & access control"
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
        description: "PRIMA configuration"
      },
    ]
  }
}
```

### 7. Mobile Navigation Enhancements

#### Mobile-Optimized Venue Selector

```typescript
// src/components/prima/mobile-venue-selector.tsx
'use client'

import { useState } from 'react'
import { Check, Building2, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useVenueContext } from '@/lib/contexts/venue-context'
import { cn } from '@/lib/utils'

export function MobileVenueSelector() {
  const {
    selectedVenue,
    availableVenues,
    isPortfolioView,
    selectVenue,
    isLoading,
  } = useVenueContext()

  const [open, setOpen] = useState(false)

  const currentSelection = isPortfolioView 
    ? 'All Venues'
    : selectedVenue?.name

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="justify-start w-full">
          {isPortfolioView ? (
            <BarChart3 className="mr-2 h-4 w-4" />
          ) : (
            <Building2 className="mr-2 h-4 w-4" />
          )}
          <span className="truncate">{currentSelection}</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent side="bottom" className="max-h-[80vh]">
        <SheetHeader>
          <SheetTitle>Select Venue</SheetTitle>
        </SheetHeader>
        
        <div className="mt-4 space-y-2">
          {/* Portfolio option */}
          <Button
            variant={isPortfolioView ? "default" : "ghost"}
            className="w-full justify-start h-auto p-4"
            onClick={() => {
              selectVenue(null)
              setOpen(false)
            }}
          >
            <BarChart3 className="mr-3 h-5 w-5" />
            <div className="flex flex-1 flex-col items-start">
              <span className="font-medium">All Venues</span>
              <span className="text-xs text-muted-foreground">
                Portfolio overview
              </span>
            </div>
            {isPortfolioView && <Check className="h-4 w-4" />}
          </Button>
          
          {/* Individual venues */}
          {availableVenues.map((venue) => (
            <Button
              key={venue.id}
              variant={selectedVenue?.id === venue.id ? "default" : "ghost"}
              className="w-full justify-start h-auto p-4"
              onClick={() => {
                selectVenue(venue.id)
                setOpen(false)
              }}
            >
              <Building2 className="mr-3 h-5 w-5" />
              <div className="flex flex-1 flex-col items-start">
                <span className="font-medium">{venue.name}</span>
                <span className="text-xs text-muted-foreground">
                  {venue.type} • {venue.location.city}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {venue.tier}
                </Badge>
                {selectedVenue?.id === venue.id && <Check className="h-4 w-4" />}
              </div>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

## Performance Considerations

### Context Optimization

- Memoized venue context values to prevent unnecessary re-renders
- Efficient venue switching with minimal state updates
- Optimized venue selector component with virtual scrolling for large lists

### Bundle Impact

- Venue context: ~8KB additional bundle size
- Layout components: ~12KB additional bundle size
- Mobile optimizations: ~5KB additional bundle size

## Accessibility Requirements

### Keyboard Navigation

- Venue selector fully keyboard accessible
- Sidebar navigation with proper focus management
- Mobile sheet navigation with escape key support

### Screen Reader Support

- Proper ARIA labels for venue selector
- Contextual information for current venue selection
- Clear navigation landmarks and headings

## Testing Strategy

### Context Tests

```typescript
// src/lib/contexts/__tests__/venue-context.test.tsx
describe('VenueContext', () => {
  test('initializes with portfolio view for multiple venues', () => {
    const { result } = renderHook(() => useVenueContext(), {
      wrapper: ({ children }) => (
        <VenueContextProvider>{children}</VenueContextProvider>
      )
    })
    
    expect(result.current.isPortfolioView).toBe(true)
    expect(result.current.selectedVenue).toBe(null)
  })

  test('preserves venue selection in localStorage', () => {
    const { result } = renderHook(() => useVenueContext(), {
      wrapper: VenueContextProvider
    })
    
    act(() => {
      result.current.selectVenue('venue-1')
    })
    
    expect(localStorage.getItem('prima_selected_venue')).toBe('venue-1')
    expect(result.current.selectedVenueId).toBe('venue-1')
  })
})
```

### Layout Tests

```typescript
// src/components/prima/__tests__/layout-shell.test.tsx
describe('PrimaLayoutShell', () => {
  test('renders venue selector in header', () => {
    render(
      <VenueContextProvider>
        <PrimaLayoutShell>
          <div>Test content</div>
        </PrimaLayoutShell>
      </VenueContextProvider>
    )
    
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  test('maintains responsive layout on mobile', () => {
    // Mock mobile viewport
    window.innerWidth = 375
    
    render(
      <VenueContextProvider>
        <PrimaLayoutShell>
          <div>Mobile content</div>
        </PrimaLayoutShell>
      </VenueContextProvider>
    )
    
    // Verify mobile optimizations are active
    expect(screen.getByText('Mobile content')).toBeInTheDocument()
  })
})
```

## Acceptance Criteria

### Layout Foundation

- [ ] PRIMA route group structure with protected routes
- [ ] Responsive layout shell with collapsible sidebar
- [ ] Header with venue selector and global controls
- [ ] Breadcrumb navigation for current page context
- [ ] Mobile-optimized navigation patterns

### Multi-Venue Management

- [ ] Venue context provider with state management
- [ ] Venue selector with portfolio and individual views
- [ ] Context preservation across navigation
- [ ] URL state synchronization with venue selection
- [ ] localStorage persistence of venue preferences

### Integration Points

- [ ] Authentication integration from RFC-001
- [ ] Data layer integration from RFC-002
- [ ] Responsive design with existing design tokens
- [ ] Sidebar integration with existing navigation
- [ ] Theme switching compatibility

### Performance & Accessibility

- [ ] Venue context optimized to prevent unnecessary re-renders
- [ ] Keyboard navigation for all interactive elements
- [ ] Screen reader support with proper ARIA labels
- [ ] Mobile touch-friendly interactions
- [ ] Fast venue switching (< 200ms response time)

---

This RFC establishes the complete layout foundation and multi-venue navigation system that all subsequent feature modules will operate within, providing seamless venue context switching and responsive navigation patterns.
