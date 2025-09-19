# Promoters Management Module

The Promoters module provides comprehensive promoter management including performance tracking, leaderboards, commission assignments, and relationship management for venue administrators.

## 🎯 Module Purpose

**Primary Goal**: Enable venue administrators to effectively manage their promoter network, track performance, and optimize promoter relationships for maximum booking generation.

**Key Value**: Data-driven promoter management with clear performance metrics, automated commission tracking, and incentive program integration.

## 👥 Core Features

### Promoter Leaderboard
1. **Performance Rankings** - Real-time promoter rankings by bookings, revenue, conversion rate
2. **Multi-Metric Sorting** - Toggle between different performance indicators
3. **Time Period Filters** - Weekly, monthly, quarterly, and custom date range views
4. **Trend Indicators** - Performance change indicators and momentum tracking

### Promoter Profile Management
1. **Detailed Profiles** - Contact information, bio, social media, performance history
2. **Commission Assignment** - Tier assignment and rate configuration
3. **Performance Analytics** - Detailed metrics, booking history, guest relationships
4. **Communication Tools** - Direct contact, notes, and relationship tracking

### Performance Analytics
1. **Key Metrics Dashboard** - Conversion rate, average booking value, repeat guest rate
2. **Trend Analysis** - Performance over time with forecasting
3. **Comparative Analysis** - Benchmarking against peer promoters
4. **Guest Analysis** - New vs repeat guests, guest satisfaction metrics

### Relationship Management
1. **Onboarding Workflow** - New promoter setup and training materials
2. **Status Management** - Active, inactive, suspended, pending approval states
3. **Notes & Communication** - Interaction history and relationship notes
4. **Performance Reviews** - Scheduled reviews and feedback tracking

## 🎨 UI Specifications

### Layout Structure
```tsx
<div className="space-y-6">
  <PromotersHeader />
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <div className="lg:col-span-3">
      <PromoterLeaderboard />
    </div>
    <div>
      <PromoterInsights />
    </div>
  </div>
  <PromoterDetailsTabs />
</div>
```

### Promoter Leaderboard
```tsx
interface PromoterLeaderboardProps {
  promoters: PromoterWithMetrics[]
  sortBy: 'bookings' | 'revenue' | 'conversion' | 'growth'
  timeframe: TimeFrame
  onSortChange: (sort: string) => void
  onPromoterSelect: (promoterId: string) => void
}

<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <div>
        <CardTitle>Promoter Leaderboard</CardTitle>
        <CardDescription>
          Top performing promoters for {formatTimeframe(timeframe)}
        </CardDescription>
      </div>
      <div className="flex items-center gap-3">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bookings">Total Bookings</SelectItem>
            <SelectItem value="revenue">Revenue Generated</SelectItem>
            <SelectItem value="conversion">Conversion Rate</SelectItem>
            <SelectItem value="growth">Growth Rate</SelectItem>
          </SelectContent>
        </Select>
        <TimeframePicker value={timeframe} onChange={setTimeframe} />
      </div>
    </div>
  </CardHeader>
  
  <CardContent className="p-0">
    <div className="divide-y">
      {promoters.map((promoter, index) => (
        <PromoterLeaderboardRow
          key={promoter.id}
          promoter={promoter}
          rank={index + 1}
          sortBy={sortBy}
          onClick={() => onPromoterSelect(promoter.id)}
        />
      ))}
    </div>
  </CardContent>
</Card>
```

### Promoter Row Component
```tsx
interface PromoterLeaderboardRowProps {
  promoter: PromoterWithMetrics
  rank: number
  sortBy: string
  onClick: () => void
}

<div 
  className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors"
  onClick={onClick}
>
  {/* Rank & Change */}
  <div className="flex items-center gap-3 min-w-[60px]">
    <div className="text-lg font-bold text-muted-foreground">
      #{rank}
    </div>
    {promoter.metrics.rankChange && (
      <div className={cn(
        "flex items-center text-xs",
        promoter.metrics.rankChange > 0 ? "text-green-600" : "text-red-600"
      )}>
        {promoter.metrics.rankChange > 0 ? (
          <TrendingUp className="h-3 w-3 mr-1" />
        ) : (
          <TrendingDown className="h-3 w-3 mr-1" />
        )}
        {Math.abs(promoter.metrics.rankChange)}
      </div>
    )}
  </div>
  
  {/* Promoter Info */}
  <div className="flex items-center gap-3 flex-1 min-w-0">
    <Avatar className="h-10 w-10">
      <AvatarImage src={promoter.avatar} />
      <AvatarFallback>
        {promoter.firstName[0]}{promoter.lastName[0]}
      </AvatarFallback>
    </Avatar>
    <div className="min-w-0 flex-1">
      <div className="font-medium truncate">
        {promoter.firstName} {promoter.lastName}
      </div>
      <div className="text-sm text-muted-foreground truncate">
        {promoter.company || promoter.title}
      </div>
    </div>
    <Badge variant={getTierVariant(promoter.tier)}>
      {promoter.tier}
    </Badge>
  </div>
  
  {/* Primary Metric */}
  <div className="text-right min-w-[120px]">
    <div className="font-bold">
      {formatMetric(promoter.metrics[sortBy], sortBy)}
    </div>
    <div className="text-sm text-muted-foreground">
      {getMetricChange(promoter.metrics[sortBy + 'Change'], sortBy)}
    </div>
  </div>
  
  {/* Secondary Metrics */}
  <div className="hidden lg:flex items-center gap-6 text-sm">
    <div className="text-center">
      <div className="font-medium">{promoter.metrics.bookings}</div>
      <div className="text-muted-foreground">Bookings</div>
    </div>
    <div className="text-center">
      <div className="font-medium">{formatCurrency(promoter.metrics.revenue)}</div>
      <div className="text-muted-foreground">Revenue</div>
    </div>
    <div className="text-center">
      <div className="font-medium">{formatPercentage(promoter.metrics.conversionRate)}</div>
      <div className="text-muted-foreground">Conversion</div>
    </div>
  </div>
  
  <ChevronRight className="h-4 w-4 text-muted-foreground" />
</div>
```

### Promoter Details Modal/Panel
```tsx
interface PromoterDetailsProps {
  promoter: PromoterWithDetails
  isOpen: boolean
  onClose: () => void
  onUpdate: (updates: PromoterUpdate) => void
}

<Sheet open={isOpen} onOpenChange={onClose}>
  <SheetContent className="min-w-[600px] max-w-[800px] overflow-y-auto">
    <SheetHeader>
      <SheetTitle>
        {promoter.firstName} {promoter.lastName}
      </SheetTitle>
      <SheetDescription>
        Promoter performance and management
      </SheetDescription>
    </SheetHeader>
    
    <div className="space-y-6 mt-6">
      {/* Profile Overview */}
      <PromoterProfileCard promoter={promoter} onUpdate={onUpdate} />
      
      {/* Performance Metrics */}
      <PromoterMetricsCard metrics={promoter.metrics} />
      
      {/* Commission Assignment */}
      <CommissionAssignmentCard 
        assignment={promoter.commissionAssignment}
        onUpdate={onUpdate}
      />
      
      {/* Recent Activity */}
      <RecentActivityCard bookings={promoter.recentBookings} />
      
      {/* Notes & Communication */}
      <CommunicationCard 
        notes={promoter.notes}
        onAddNote={handleAddNote}
      />
    </div>
  </SheetContent>
</Sheet>
```

### Responsive Design
```tsx
// Mobile layout (< 768px)
<div className="space-y-4">
  <PromotersHeader />
  <PromoterFilters />
  <div className="space-y-3">
    {promoters.map(promoter => (
      <PromoterMobileCard key={promoter.id} promoter={promoter} />
    ))}
  </div>
</div>

// Tablet layout (768px - 1024px)
<div className="space-y-6">
  <PromotersHeader />
  <div className="space-y-6">
    <PromoterLeaderboard />
    <PromoterInsights />
  </div>
</div>
```

## 📈 Data Requirements

### Promoter Data Models
```typescript
interface PromoterWithMetrics {
  id: string
  venueId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  title?: string
  company?: string
  bio?: string
  avatar?: string
  
  // Status and tier
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL'
  tier: 'STANDARD' | 'PREMIUM' | 'VIP'
  joinedAt: Date
  lastActiveAt: Date
  
  // Performance metrics
  metrics: {
    // Current period
    bookings: number
    revenue: number
    conversionRate: number
    averageBookingValue: number
    noShowRate: number
    cancelRate: number
    
    // Growth indicators
    bookingsChange: number
    revenueChange: number
    conversionChange: number
    rankChange?: number
    
    // Guest metrics
    newGuests: number
    repeatGuests: number
    guestRetentionRate: number
    
    // Lifetime metrics
    totalBookings: number
    totalRevenue: number
    avgMonthlyBookings: number
    bestMonth: { month: string; bookings: number; revenue: number }
  }
  
  // Commission details
  commissionAssignment: {
    tier: CommissionTier
    model: CommissionModel
    rate: number
    effectiveFrom: Date
    monthlyEarnings: number
    totalEarnings: number
  }
  
  // Social presence
  socialMedia?: {
    instagram?: string
    tiktok?: string
    twitter?: string
    followers?: number
  }
}

interface PromoterPerformanceAnalytics {
  promoterId: string
  period: { from: Date; to: Date }
  
  // Performance trends
  bookingTrend: TimeSeriesData[]
  revenueTrend: TimeSeriesData[]
  conversionTrend: TimeSeriesData[]
  
  // Guest analysis
  guestAcquisition: {
    newGuests: number
    repeatGuests: number
    guestLifetimeValue: number
    averageBookingsPerGuest: number
  }
  
  // Booking patterns
  bookingPatterns: {
    dayOfWeek: Record<string, number>
    timeOfDay: Record<string, number>
    partySize: Record<number, number>
    primeRatio: number
  }
  
  // Comparative analysis
  benchmarks: {
    percentile: number
    rankInTier: number
    abovePeerAverage: {
      bookings: number
      revenue: number
      conversion: number
    }
  }
}
```

### Leaderboard Sorting Logic
```typescript
interface LeaderboardSort {
  field: 'bookings' | 'revenue' | 'conversion' | 'growth' | 'efficiency'
  direction: 'asc' | 'desc'
  timeframe: TimeFrame
}

const sortPromoters = (
  promoters: PromoterWithMetrics[], 
  sort: LeaderboardSort
): PromoterWithMetrics[] => {
  return [...promoters].sort((a, b) => {
    let aValue: number
    let bValue: number
    
    switch (sort.field) {
      case 'bookings':
        aValue = a.metrics.bookings
        bValue = b.metrics.bookings
        break
      case 'revenue':
        aValue = a.metrics.revenue
        bValue = b.metrics.revenue
        break
      case 'conversion':
        aValue = a.metrics.conversionRate
        bValue = b.metrics.conversionRate
        break
      case 'growth':
        aValue = a.metrics.revenueChange
        bValue = b.metrics.revenueChange
        break
      case 'efficiency':
        aValue = a.metrics.averageBookingValue
        bValue = b.metrics.averageBookingValue
        break
      default:
        aValue = a.metrics.bookings
        bValue = b.metrics.bookings
    }
    
    const multiplier = sort.direction === 'desc' ? -1 : 1
    return (aValue - bValue) * multiplier
  })
}
```

## 🔄 Interactions & Behaviors

### Promoter Search & Filtering
```typescript
const usePromoterFiltering = () => {
  const [filters, setFilters] = useState<PromoterFilters>({
    search: '',
    status: 'all',
    tier: 'all',
    venue: 'all',
  })
  
  const [sortBy, setSortBy] = useState<LeaderboardSort>({
    field: 'bookings',
    direction: 'desc',
    timeframe: 'thisMonth',
  })
  
  const { data: promoters, isLoading } = useGetPromotersQuery({
    ...filters,
    sortBy: sortBy.field,
    sortDirection: sortBy.direction,
    timeframe: sortBy.timeframe,
  })
  
  const filteredPromoters = useMemo(() => {
    if (!promoters) return []
    
    return promoters.filter(promoter => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const nameMatch = `${promoter.firstName} ${promoter.lastName}`.toLowerCase().includes(searchTerm)
        const emailMatch = promoter.email.toLowerCase().includes(searchTerm)
        const companyMatch = promoter.company?.toLowerCase().includes(searchTerm) || false
        
        if (!nameMatch && !emailMatch && !companyMatch) return false
      }
      
      if (filters.status !== 'all' && promoter.status !== filters.status) return false
      if (filters.tier !== 'all' && promoter.tier !== filters.tier) return false
      if (filters.venue !== 'all' && promoter.venueId !== filters.venue) return false
      
      return true
    })
  }, [promoters, filters])
  
  return {
    promoters: filteredPromoters,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    isLoading,
  }
}
```

### Commission Assignment Management
```typescript
const useCommissionAssignment = () => {
  const [updateCommissionAssignment] = useUpdateCommissionAssignmentMutation()
  
  const handleTierChange = async (
    promoterId: string, 
    newTier: CommissionTier
  ) => {
    const confirmation = await showConfirmDialog({
      title: 'Change Commission Tier',
      message: `Change promoter to ${newTier} tier? This will affect future commission calculations.`,
      confirmText: 'Change Tier',
    })
    
    if (!confirmation) return
    
    try {
      await updateCommissionAssignment({
        promoterId,
        tier: newTier,
        effectiveFrom: new Date(),
      }).unwrap()
      
      toast.success('Commission tier updated successfully')
    } catch (error) {
      toast.error('Failed to update commission tier')
    }
  }
  
  const handleModelChange = async (
    promoterId: string,
    newModel: CommissionModel,
    newRate: number
  ) => {
    try {
      await updateCommissionAssignment({
        promoterId,
        model: newModel,
        rate: newRate,
        effectiveFrom: new Date(),
      }).unwrap()
      
      toast.success('Commission model updated successfully')
    } catch (error) {
      toast.error('Failed to update commission model')
    }
  }
  
  return {
    handleTierChange,
    handleModelChange,
  }
}
```

### Promoter Performance Analysis
```typescript
const usePromoterAnalytics = (promoterId: string, timeframe: TimeFrame) => {
  const { data: analytics } = useGetPromoterAnalyticsQuery({
    promoterId,
    timeframe,
  })
  
  const { data: benchmarks } = useGetPromoterBenchmarksQuery({
    promoterId,
    timeframe,
  })
  
  const performanceInsights = useMemo(() => {
    if (!analytics || !benchmarks) return null
    
    const insights: PerformanceInsight[] = []
    
    // Conversion rate analysis
    if (analytics.conversionTrend.length > 1) {
      const recentConversion = analytics.conversionTrend.slice(-1)[0].value
      const previousConversion = analytics.conversionTrend.slice(-2)[0].value
      
      if (recentConversion > previousConversion * 1.1) {
        insights.push({
          type: 'positive',
          title: 'Improving Conversion',
          message: `Conversion rate increased by ${((recentConversion / previousConversion - 1) * 100).toFixed(1)}% recently`,
        })
      } else if (recentConversion < previousConversion * 0.9) {
        insights.push({
          type: 'warning',
          title: 'Declining Conversion',
          message: 'Conversion rate has declined, consider additional support',
        })
      }
    }
    
    // Guest retention analysis
    if (analytics.guestAcquisition.repeatGuests > analytics.guestAcquisition.newGuests) {
      insights.push({
        type: 'positive',
        title: 'Strong Guest Retention',
        message: 'More repeat guests than new guests indicates strong relationships',
      })
    }
    
    // Benchmark comparison
    if (benchmarks.percentile >= 80) {
      insights.push({
        type: 'positive',
        title: 'Top Performer',
        message: `Performing better than ${benchmarks.percentile}% of peers`,
      })
    }
    
    return insights
  }, [analytics, benchmarks])
  
  return {
    analytics,
    benchmarks,
    insights: performanceInsights,
  }
}
```

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('Promoter Leaderboard', () => {
  test('sorts promoters by booking count', () => {
    const promoters = [
      { id: '1', metrics: { bookings: 10 } },
      { id: '2', metrics: { bookings: 25 } },
      { id: '3', metrics: { bookings: 5 } },
    ]
    
    const sorted = sortPromoters(promoters, {
      field: 'bookings',
      direction: 'desc',
      timeframe: 'thisMonth',
    })
    
    expect(sorted[0].id).toBe('2')
    expect(sorted[1].id).toBe('1')
    expect(sorted[2].id).toBe('3')
  })
  
  test('calculates performance metrics correctly', () => {
    const bookings = [
      { diners: 4, fee: 120, status: 'CONFIRMED', createdAt: new Date() },
      { diners: 2, fee: 80, status: 'CONFIRMED', createdAt: new Date() },
      { diners: 6, fee: 180, status: 'CANCELLED', createdAt: new Date() },
    ]
    
    const metrics = calculatePromoterMetrics(bookings)
    
    expect(metrics.bookings).toBe(2) // Only confirmed bookings
    expect(metrics.revenue).toBe(200) // $120 + $80
    expect(metrics.averageBookingValue).toBe(100) // $200 / 2 bookings
    expect(metrics.cancelRate).toBe(0.33) // 1 cancelled / 3 total
  })
})
```

### Integration Tests
```typescript
describe('Promoters Module Integration', () => {
  test('updates promoter tier and shows success message', async () => {
    render(<PromotersModule />)
    
    // Open promoter details
    const promoterRow = screen.getByText('John Smith')
    await user.click(promoterRow)
    
    // Change commission tier
    const tierSelect = screen.getByLabelText('Commission Tier')
    await user.selectOptions(tierSelect, 'PREMIUM')
    
    // Confirm change
    const confirmButton = screen.getByText('Change Tier')
    await user.click(confirmButton)
    
    // Verify success message
    await waitFor(() => {
      expect(screen.getByText('Commission tier updated successfully')).toBeInTheDocument()
    })
  })
  
  test('filters promoters by search term', async () => {
    render(<PromotersModule />)
    
    // Enter search term
    const searchInput = screen.getByPlaceholderText('Search promoters...')
    await user.type(searchInput, 'john')
    
    // Verify filtered results
    await waitFor(() => {
      expect(screen.getByText('John Smith')).toBeInTheDocument()
      expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument()
    })
  })
})
```

## 📋 Acceptance Criteria

### Core Functionality
- [ ] Promoter leaderboard with sortable columns and real-time rankings
- [ ] Detailed promoter profiles with performance metrics and contact information
- [ ] Commission tier assignment and rate management
- [ ] Search and filtering capabilities across all promoter attributes
- [ ] Performance analytics with trend analysis and benchmarking

### Data Integration
- [ ] Real-time metric calculations based on booking and transaction data
- [ ] Commission calculations match assigned tiers and models
- [ ] Performance rankings update automatically with new booking data
- [ ] Multi-venue promoter management with proper data segregation

### User Experience
- [ ] Intuitive leaderboard interface with clear performance indicators
- [ ] Responsive design optimized for mobile and tablet viewing
- [ ] Quick actions for common promoter management tasks
- [ ] Clear visual hierarchy emphasizing top performers

### Business Logic
- [ ] Accurate performance metric calculations and trending
- [ ] Proper commission tier management with effective date tracking
- [ ] Guest acquisition vs retention analysis
- [ ] Benchmark comparisons against peer promoters

### Performance
- [ ] Leaderboard loads and sorts within 500ms
- [ ] Search results filter instantly as user types
- [ ] Large promoter datasets (100+) remain responsive
- [ ] Performance analytics generate within 1 second

## 🔧 Implementation Priority

### Phase 1 (Critical - Days 13-14)
1. Promoter leaderboard with basic metrics
2. Promoter detail views and profiles
3. Commission tier assignment interface
4. Search and filtering functionality

### Phase 2 (Enhanced Demo Value)
5. Performance analytics and trending
6. Benchmark comparisons
7. Guest relationship analysis
8. Communication and notes features

### Phase 3 (Advanced Features)
9. Bulk promoter management operations
10. Advanced performance insights
11. Automated tier promotion rules
12. Integration with incentive programs

---

The Promoters module serves as the central hub for managing venue promoter relationships, providing the insights and tools needed to optimize promoter performance and maximize booking generation.
