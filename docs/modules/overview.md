# Overview Dashboard

The Overview module serves as the primary KPI dashboard for the PRIMA Partner Dashboard, providing at-a-glance insights into venue performance, revenue metrics, and operational indicators.

## 🎯 Module Purpose

**Primary Goal**: Provide partners with a comprehensive overview of their venue performance, enabling quick decision-making and drill-through navigation to detailed views.

**Key Value**: Single source of truth for performance metrics with real-time updates and contextual insights.

## 📊 Core Features

### KPI Cards
Primary metrics displayed as prominent cards:

1. **Total Diners** - Current period diner count with trend
2. **Total Bookings** - Confirmed bookings with status breakdown  
3. **Total Earnings** - Revenue with Prime/Non-Prime split
4. **Prime Performance** - Prime booking conversion and impact
5. **Investment/Spend** - Promotional spend and ROI

### Weekly Trend Chart
- Interactive line chart showing 7-day performance trends
- Multiple metric overlays (revenue, bookings, diners)
- Hover tooltips with detailed breakdowns
- Drill-down to daily granularity

### Recent Bookings Table
- Latest 10 bookings with key details
- Quick status indicators and actions
- Direct link to full Bookings module

## 🎨 UI Specifications

### Layout Structure
```tsx
<div className="space-y-6">
  <OverviewHeader />
  <KPICards />
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2">
      <WeeklyTrendChart />
    </div>
    <div>
      <RecentBookings />
    </div>
  </div>
</div>
```

### KPI Card Design
```tsx
interface KPICardProps {
  title: string
  value: string | number
  change: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
    period: string
  }
  icon: LucideIcon
  drillThrough?: {
    route: string
    params: Record<string, string>
  }
}
```

### Responsive Behavior
- **Mobile**: Single column stack, compact card layout
- **Tablet**: 2x2 grid for KPI cards, stacked chart/table
- **Desktop**: Full 3-column layout with side-by-side components

## 📈 Data Requirements

### Metrics API Contract
```typescript
interface OverviewMetrics {
  period: {
    from: string
    to: string
    venueId: string
  }
  kpis: {
    totalDiners: {
      current: number
      previous: number
      change: number
    }
    totalBookings: {
      current: number
      previous: number
      change: number
      breakdown: {
        confirmed: number
        pending: number
        cancelled: number
        noShow: number
      }
    }
    totalEarnings: {
      current: number
      previous: number
      change: number
      breakdown: {
        prime: number
        nonPrime: number
        platform: number
      }
    }
    primePerformance: {
      conversionRate: number
      averageSpend: number
      totalImpact: number
    }
    investmentSpend: {
      total: number
      commissions: number
      incentives: number
      roi: number
    }
  }
  trends: {
    weekly: WeeklyDataPoint[]
    daily: DailyDataPoint[]
  }
  recentBookings: Booking[]
}

interface WeeklyDataPoint {
  date: string
  diners: number
  bookings: number
  revenue: number
  primeRevenue: number
}
```

### Mock Data Patterns
```typescript
// Mock data should reflect realistic venue performance
const mockMetrics = {
  kpis: {
    totalDiners: {
      current: 847,
      previous: 763,
      change: 11.0, // 11% increase
    },
    totalBookings: {
      current: 342,
      previous: 298,
      change: 14.8, // 14.8% increase
      breakdown: {
        confirmed: 298,
        pending: 32,
        cancelled: 8,
        noShow: 4,
      }
    },
    // ... realistic financial data
  }
}
```

## 🔄 Interactions & Behaviors

### Drill-Through Navigation
```typescript
const drillThroughActions = {
  totalDiners: {
    route: '/prima/bookings',
    params: { tab: 'overview', metric: 'diners' }
  },
  totalBookings: {
    route: '/prima/bookings', 
    params: { status: 'all', view: 'summary' }
  },
  totalEarnings: {
    route: '/prima/finance',
    params: { tab: 'revenue', period: 'current' }
  },
  primePerformance: {
    route: '/prima/pricing',
    params: { focus: 'prime-performance' }
  }
}
```

### Real-Time Updates
- Metrics refresh every 30 seconds when page is active
- Visual indicators for stale data (> 5 minutes old)
- Manual refresh button with loading state
- Optimistic updates for related data changes

### Context Sensitivity
- Venue selector updates all metrics in real-time
- Date range picker refreshes trends and comparisons
- Role-based data visibility (Admin vs Manager vs Coordinator)

## 📱 Responsive Design

### Mobile (< 768px)
```tsx
<div className="space-y-4">
  {/* Compact KPI cards in single column */}
  <div className="grid gap-4">
    {kpiCards.map(card => (
      <CompactKPICard key={card.id} {...card} />
    ))}
  </div>
  
  {/* Full-width chart */}
  <TrendChart className="h-64" />
  
  {/* Simplified recent bookings */}
  <RecentBookingsMobile />
</div>
```

### Tablet (768px - 1024px)
```tsx
<div className="space-y-6">
  {/* 2x2 KPI grid */}
  <div className="grid grid-cols-2 gap-4">
    {kpiCards.map(card => (
      <KPICard key={card.id} {...card} />
    ))}
  </div>
  
  {/* Stacked chart and table */}
  <TrendChart className="h-80" />
  <RecentBookingsTable />
</div>
```

## ⚡ Performance Optimization

### Data Loading Strategy
1. **Initial Load**: Fetch current period metrics immediately
2. **Background Load**: Fetch trend data and recent bookings
3. **Lazy Load**: Historical comparison data on demand
4. **Cache Strategy**: 5-minute cache for metrics, 1-minute for recent bookings

### Chart Optimization
```typescript
const ChartOptimization = {
  // Limit data points for smooth rendering
  maxDataPoints: 30,
  
  // Debounce hover interactions
  hoverDebounce: 100,
  
  // Virtualize large datasets
  enableVirtualization: true,
  
  // Lazy load chart library
  chartComponent: lazy(() => import('./TrendChart'))
}
```

### Memory Management
- Unsubscribe from polling when component unmounts
- Clear trend data cache when venue changes
- Optimize re-renders with React.memo and useMemo

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('Overview Dashboard', () => {
  test('displays KPI cards with correct values', () => {
    render(<OverviewDashboard />)
    expect(screen.getByText('847')).toBeInTheDocument() // Total diners
    expect(screen.getByText('+11.0%')).toBeInTheDocument() // Change indicator
  })
  
  test('handles drill-through navigation', () => {
    const mockPush = jest.fn()
    render(<OverviewDashboard />)
    
    fireEvent.click(screen.getByText('Total Bookings'))
    expect(mockPush).toHaveBeenCalledWith('/prima/bookings?status=all&view=summary')
  })
})
```

### Integration Tests
- Test data flow from API to UI components
- Verify drill-through navigation with URL state
- Test real-time update mechanisms
- Validate responsive layout changes

### Accessibility Tests
```typescript
test('overview dashboard is accessible', async () => {
  const { container } = render(<OverviewDashboard />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})

test('supports keyboard navigation', () => {
  render(<OverviewDashboard />)
  
  // Tab through KPI cards
  const firstCard = screen.getByRole('button', { name: /total diners/i })
  firstCard.focus()
  expect(firstCard).toHaveFocus()
  
  // Enter key triggers drill-through
  fireEvent.keyDown(firstCard, { key: 'Enter' })
  // Verify navigation occurred
})
```

## 📋 Acceptance Criteria

### Core Functionality
- [ ] KPI cards display current metrics with trend indicators
- [ ] Weekly trend chart shows accurate performance data
- [ ] Recent bookings table displays latest 10 bookings
- [ ] Drill-through navigation works from all KPI cards
- [ ] Real-time updates refresh data every 30 seconds

### Data Integration
- [ ] Venue selector updates all metrics correctly
- [ ] Date range picker filters all data appropriately  
- [ ] Role-based data masking applies correctly
- [ ] Cache invalidation works when related data changes

### User Experience
- [ ] Loading states display during data fetching
- [ ] Error states show appropriate fallback content
- [ ] Mobile layout is fully functional and accessible
- [ ] Keyboard navigation supports all interactive elements
- [ ] Screen readers can access all metric information

### Performance
- [ ] Initial page load completes in < 2 seconds
- [ ] Chart interactions respond in < 100ms
- [ ] Memory usage remains stable during extended use
- [ ] No unnecessary re-renders during routine updates

## 🔧 Implementation Notes

### Component Architecture
```typescript
// Main overview page component
export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <OverviewHeader />
      <Suspense fallback={<KPICardsSkeleton />}>
        <KPICards />
      </Suspense>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<ChartSkeleton />}>
            <WeeklyTrendChart />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<TableSkeleton />}>
            <RecentBookingsTable />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
```

### State Management
- Use RTK Query for metrics data with 5-minute cache
- Local state for chart interactions and UI preferences
- URL state for shareable dashboard configurations
- Context for venue and date range selection

### Error Handling
- Graceful degradation when metrics API fails
- Fallback to cached data when real-time updates fail
- User-friendly error messages with retry options
- Automatic retry with exponential backoff

---

The Overview dashboard serves as the entry point and primary navigation hub for the PRIMA Partner Dashboard, setting the tone for the entire user experience.
