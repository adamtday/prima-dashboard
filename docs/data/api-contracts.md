# API Contracts

Complete REST API specifications for the PRIMA Partner Dashboard, including request/response schemas, error handling, and authentication patterns.

## 🌐 Base API Configuration

### Base URL
```
Development: http://localhost:3000/api
Production: https://prima-dashboard.vercel.app/api
```

### Authentication
```typescript
// Request headers
interface APIHeaders {
  'Authorization': 'Bearer <token>'        // JWT token (for production)
  'X-Demo-Role': 'ADMIN' | 'MANAGER' | 'COORDINATOR'  // Demo role (prototype)
  'X-Venue-ID': string                     // Current venue context
  'Content-Type': 'application/json'
  'Accept': 'application/json'
}
```

### Standard Response Format
```typescript
interface APIResponse<T> {
  success: boolean
  data: T
  meta?: ResponseMeta
  errors?: APIError[]
  timestamp: string
}

interface ResponseMeta {
  total?: number
  page?: number
  size?: number
  hasNext?: boolean
  hasPrevious?: boolean
  filters?: FilterMeta
}

interface APIError {
  code: string
  message: string
  field?: string
  details?: Record<string, any>
}
```

## 📊 Overview & Metrics API

### GET /api/metrics/overview
Get comprehensive venue metrics for the overview dashboard.

**Request:**
```typescript
interface OverviewMetricsRequest {
  venueId?: string
  from?: string      // ISO date string
  to?: string        // ISO date string  
  compare?: boolean  // Include comparison periods
}

// Query: /api/metrics/overview?venueId=venue-123&from=2025-01-01&to=2025-01-31&compare=true
```

**Response:**
```typescript
interface OverviewMetricsResponse {
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
      changePercent: number
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
    totalRevenue: {
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
```

### GET /api/metrics/trends/weekly
Get weekly trend data for charts.

**Request:**
```typescript
interface WeeklyTrendsRequest {
  venueId?: string
  weeks?: number     // Number of weeks (default: 12)
  metrics?: string[] // Specific metrics to include
}
```

**Response:**
```typescript
interface WeeklyTrendsResponse {
  trends: WeeklyDataPoint[]
  summary: {
    totalWeeks: number
    averages: {
      bookings: number
      revenue: number
      diners: number
    }
  }
}

interface WeeklyDataPoint {
  weekStart: string
  weekEnd: string
  bookings: number
  revenue: number
  diners: number
  primeRevenue: number
  conversionRate: number
}
```

## 📅 Bookings API

### GET /api/bookings
Get paginated booking list with filtering and sorting.

**Request:**
```typescript
interface GetBookingsRequest {
  // Filters
  venueId?: string
  status?: BookingStatus[]
  from?: string
  to?: string
  promoterIds?: string[]
  source?: BookingSource[]
  type?: BookingType[]
  
  // Search
  search?: string    // Guest name, email, or booking ID
  
  // Pagination
  page?: number      // Default: 1
  size?: number      // Default: 50, max: 200
  
  // Sorting
  sort?: string      // Field to sort by
  order?: 'asc' | 'desc'
  
  // Include related data
  include?: ('guest' | 'promoter' | 'venue' | 'transactions')[]
}
```

**Response:**
```typescript
interface GetBookingsResponse {
  items: Booking[]
  total: number
  page: number
  size: number
  hasNext: boolean
  hasPrevious: boolean
  
  // Filter metadata
  filters: {
    applied: Record<string, any>
    available: {
      statuses: { value: BookingStatus; count: number }[]
      promoters: { id: string; name: string; count: number }[]
      sources: { value: BookingSource; count: number }[]
    }
  }
  
  // Summary stats for current filter
  summary: {
    totalRevenue: number
    averageBookingValue: number
    totalDiners: number
    statusBreakdown: Record<BookingStatus, number>
  }
}
```

### PATCH /api/bookings/:id
Update booking status or details.

**Request:**
```typescript
interface UpdateBookingRequest {
  status?: BookingStatus
  notes?: string
  diners?: number
  bookingTime?: string
  specialRequests?: string
}
```

**Response:**
```typescript
interface UpdateBookingResponse {
  booking: Booking
  affectedMetrics: string[]  // Which metrics need refresh
  auditEntry: {
    action: string
    previousValue: any
    newValue: any
    timestamp: string
  }
}
```

### POST /api/bookings/bulk-update
Update multiple bookings at once.

**Request:**
```typescript
interface BulkUpdateBookingsRequest {
  bookingIds: string[]
  updates: UpdateBookingRequest
  reason?: string
}
```

**Response:**
```typescript
interface BulkUpdateBookingsResponse {
  updated: Booking[]
  failed: {
    bookingId: string
    error: string
  }[]
  summary: {
    totalAttempted: number
    successful: number
    failed: number
  }
}
```

## 💰 Pricing API

### GET /api/venues/:venueId/pricing
Get current pricing configuration for a venue.

**Request:**
```typescript
// Path: /api/venues/venue-123/pricing
```

**Response:**
```typescript
interface GetVenuePricingResponse {
  venueId: string
  pricing: VenuePricing
  examples: PricingExample[]
  history: {
    changedAt: string
    changedBy: string
    previousValues: Partial<VenuePricing>
  }[]
}
```

### PUT /api/venues/:venueId/pricing
Update venue pricing configuration.

**Request:**
```typescript
interface UpdateVenuePricingRequest {
  nonPrime: {
    perDiner: number
    platformFeePercent: number
  }
  prime: {
    baseFor2: number
    additionalPerPerson: number
    platformFeePercent: number
  }
  minimums?: {
    bookingAmount: number
    partySize: number
  }
}
```

**Response:**
```typescript
interface UpdateVenuePricingResponse {
  pricing: VenuePricing
  examples: PricingExample[]
  impactProjection: {
    revenueChange: number
    bookingImpact: number
    commissionImpact: number
  }
}
```

### POST /api/venues/:venueId/pricing/examples
Calculate pricing examples for given scenarios.

**Request:**
```typescript
interface CalculatePricingExamplesRequest {
  scenarios: {
    diners: number
    type: 'PRIME' | 'NON_PRIME'
  }[]
  pricing: UpdateVenuePricingRequest
}
```

**Response:**
```typescript
interface CalculatePricingExamplesResponse {
  examples: PricingExample[]
  comparisons: {
    scenario: string
    current: number
    proposed: number
    difference: number
    percentChange: number
  }[]
}
```

## 👥 Promoters API

### GET /api/promoters
Get promoter list with performance data.

**Request:**
```typescript
interface GetPromotersRequest {
  venueId?: string
  status?: PromoterStatus[]
  tier?: CommissionTier[]
  sort?: 'performance' | 'bookings' | 'revenue' | 'conversion' | 'name'
  order?: 'asc' | 'desc'
  period?: {
    from: string
    to: string
  }
  page?: number
  size?: number
}
```

**Response:**
```typescript
interface GetPromotersResponse {
  items: (Promoter & {
    performance: PromoterPerformance
    ranking: {
      overall: number
      bookings: number
      revenue: number
    }
  })[]
  total: number
  leaderboard: {
    top: {
      bookings: Promoter[]
      revenue: Promoter[]
      conversion: Promoter[]
    }
  }
  summary: {
    totalPromoters: number
    activePromoters: number
    totalBookings: number
    totalRevenue: number
    averageConversion: number
  }
}
```

### GET /api/promoters/:id
Get detailed promoter information.

**Request:**
```typescript
// Path: /api/promoters/promoter-123
// Query: ?include=performance,history,incentives
```

**Response:**
```typescript
interface GetPromoterDetailResponse {
  promoter: Promoter
  performance: {
    current: PromoterPerformance
    historical: PromoterPerformance[]
    trends: {
      bookings: { date: string; value: number }[]
      revenue: { date: string; value: number }[]
      conversion: { date: string; value: number }[]
    }
  }
  incentives: {
    active: IncentiveProgress[]
    completed: IncentiveProgress[]
  }
  recentBookings: Booking[]
  commissionHistory: {
    month: string
    bookings: number
    commission: number
    tier: CommissionTier
  }[]
}
```

### PUT /api/commissions/assignments/:promoterId
Update promoter commission assignment.

**Request:**
```typescript
interface UpdateCommissionAssignmentRequest {
  tier: CommissionTier
  model: CommissionModel
  effectiveFrom?: string
  reason?: string
}
```

**Response:**
```typescript
interface UpdateCommissionAssignmentResponse {
  assignment: CommissionAssignment
  impactPreview: {
    projectedMonthlyCommission: number
    changeFromCurrent: number
    effectiveDate: string
  }
  auditEntry: AuditLog
}
```

## 🎯 Incentives API

### GET /api/incentives
Get incentive programs and progress.

**Request:**
```typescript
interface GetIncentivesRequest {
  venueId?: string
  status?: ('ACTIVE' | 'COMPLETED' | 'DRAFT')[]
  promoterId?: string  // Filter for specific promoter
  period?: {
    from: string
    to: string
  }
}
```

**Response:**
```typescript
interface GetIncentivesResponse {
  programs: (Incentive & {
    progress: IncentiveProgress[]
    leaderboard: {
      promoterId: string
      promoterName: string
      currentValue: number
      percentComplete: number
      position: number
    }[]
  })[]
  summary: {
    active: number
    totalParticipants: number
    totalRewardsPending: number
    completedThisMonth: number
  }
}
```

### POST /api/incentives
Create new incentive program.

**Request:**
```typescript
interface CreateIncentiveRequest {
  name: string
  description: string
  type: IncentiveType
  target: IncentiveTarget
  reward: IncentiveReward
  period: {
    type: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'CUSTOM'
    startDate: string
    endDate: string
    recurring: boolean
  }
  eligibility?: {
    promoterTiers?: CommissionTier[]
    minTenure?: number
  }
}
```

**Response:**
```typescript
interface CreateIncentiveResponse {
  incentive: Incentive
  eligiblePromoters: {
    promoterId: string
    promoterName: string
    tier: CommissionTier
    currentProgress: number
  }[]
  projectedCost: {
    minimum: number
    maximum: number
    expected: number
  }
}
```

### GET /api/incentives/:id/progress
Get real-time progress for an incentive program.

**Request:**
```typescript
// Path: /api/incentives/incentive-123/progress
```

**Response:**
```typescript
interface GetIncentiveProgressResponse {
  incentive: Incentive
  progress: IncentiveProgress[]
  leaderboard: {
    position: number
    promoterId: string
    promoterName: string
    currentValue: number
    targetValue: number
    percentComplete: number
    status: 'IN_PROGRESS' | 'ACHIEVED' | 'MISSED'
    lastUpdated: string
  }[]
  summary: {
    totalParticipants: number
    achieved: number
    onTrack: number
    atRisk: number
    totalRewardsPending: number
  }
}
```

## 💰 Finance API

### GET /api/finance/summary
Get financial summary and payout information.

**Request:**
```typescript
interface GetFinanceSummaryRequest {
  venueId?: string
  from?: string
  to?: string
  includeProjections?: boolean
}
```

**Response:**
```typescript
interface GetFinanceSummaryResponse {
  period: {
    from: string
    to: string
    venueId: string
  }
  revenue: {
    total: number
    prime: number
    nonPrime: number
    platform: number
    growth: number
  }
  commissions: {
    total: number
    paid: number
    pending: number
    held: number
    byTier: Record<CommissionTier, number>
  }
  nextPayout: {
    scheduledDate: string
    amount: number
    recipientCount: number
    breakdown: {
      commissions: number
      incentives: number
      adjustments: number
    }
    holds: PayoutHold[]
  }
  transactions: {
    recent: Transaction[]
    summary: {
      thisMonth: number
      lastMonth: number
      yearToDate: number
    }
  }
}
```

### POST /api/finance/holds
Create payout hold.

**Request:**
```typescript
interface CreatePayoutHoldRequest {
  promoterId: string
  amount?: number      // Specific amount or entire payout
  reason: string
  holdUntil?: string   // Auto-release date
}
```

**Response:**
```typescript
interface CreatePayoutHoldResponse {
  hold: PayoutHold
  affectedPayout: {
    payoutId: string
    originalAmount: number
    newAmount: number
    affectedPromoter: {
      id: string
      name: string
    }
  }
}
```

### GET /api/finance/payouts
Get payout history and details.

**Request:**
```typescript
interface GetPayoutsRequest {
  venueId?: string
  status?: PayoutStatus[]
  from?: string
  to?: string
  promoterId?: string
  page?: number
  size?: number
}
```

**Response:**
```typescript
interface GetPayoutsResponse {
  items: Payout[]
  total: number
  summary: {
    totalAmount: number
    averageAmount: number
    successRate: number
    processingTime: {
      average: number  // Average days to process
      median: number
    }
  }
}
```

## 👤 Team & RBAC API

### GET /api/team/summary
Get team overview and role information.

**Request:**
```typescript
interface GetTeamSummaryRequest {
  venueId?: string
}
```

**Response:**
```typescript
interface GetTeamSummaryResponse {
  members: {
    id: string
    name: string
    email: string
    role: UserRole
    status: 'ACTIVE' | 'INACTIVE'
    lastActiveAt: string
    permissions: Permission[]
  }[]
  roles: {
    role: UserRole
    count: number
    permissions: {
      resource: string
      actions: string[]
      description: string
    }[]
  }[]
  summary: {
    totalMembers: number
    activeMembers: number
    rolesCount: Record<UserRole, number>
  }
}
```

## 🚫 Error Responses

### Standard Error Codes
```typescript
interface ErrorCodes {
  // Authentication & Authorization
  'AUTH_REQUIRED': 'Authentication required'
  'AUTH_INVALID': 'Invalid authentication token'
  'FORBIDDEN': 'Insufficient permissions'
  'ROLE_REQUIRED': 'User role required for this operation'
  
  // Validation
  'VALIDATION_ERROR': 'Request validation failed'
  'INVALID_DATE_RANGE': 'Invalid date range specified'
  'INVALID_VENUE': 'Venue not found or access denied'
  
  // Business Logic
  'BOOKING_NOT_FOUND': 'Booking not found'
  'INVALID_STATUS_TRANSITION': 'Invalid status change'
  'PROMOTER_NOT_FOUND': 'Promoter not found'
  'INCENTIVE_NOT_ACTIVE': 'Incentive program not active'
  
  // System
  'INTERNAL_ERROR': 'Internal server error'
  'SERVICE_UNAVAILABLE': 'Service temporarily unavailable'
  'RATE_LIMITED': 'Too many requests'
}
```

### Error Response Format
```typescript
interface ErrorResponse {
  success: false
  errors: APIError[]
  timestamp: string
  requestId: string
}

// Example error response
{
  "success": false,
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "message": "Invalid booking status",
      "field": "status",
      "details": {
        "allowedValues": ["PENDING", "CONFIRMED", "CANCELLED", "NO_SHOW"],
        "receivedValue": "INVALID_STATUS"
      }
    }
  ],
  "timestamp": "2025-01-15T10:30:00Z",
  "requestId": "req_12345"
}
```

## 🔄 Rate Limiting

### Rate Limits by Endpoint Type
```typescript
interface RateLimits {
  // Read operations
  'GET /api/*': {
    limit: 1000,
    window: '15m',
    burst: 100
  }
  
  // Write operations  
  'POST /api/*': {
    limit: 100,
    window: '15m',
    burst: 20
  }
  
  // Bulk operations
  'POST /api/*/bulk-*': {
    limit: 10,
    window: '15m',
    burst: 2
  }
}
```

### Rate Limit Headers
```typescript
interface RateLimitHeaders {
  'X-RateLimit-Limit': string      // Requests per window
  'X-RateLimit-Remaining': string  // Remaining requests
  'X-RateLimit-Reset': string      // Reset timestamp
  'X-RateLimit-Burst': string      // Burst capacity
}
```

---

These API contracts provide a complete specification for all PRIMA Partner Dashboard endpoints, ensuring consistent data structures, error handling, and authentication patterns across the application.
