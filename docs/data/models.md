# Data Models

Complete TypeScript type definitions and interfaces for all data entities in the PRIMA Partner Dashboard.

## 🏢 Venue & Configuration Models

### Venue
```typescript
interface Venue {
  id: string
  name: string
  type: VenueType
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  contact: {
    phone: string
    email: string
    website?: string
  }
  capacity: {
    seated: number
    standing?: number
    private?: number
  }
  settings: {
    timezone: string
    currency: string
    language: string
    autoConfirmBookings: boolean
    requireApproval: boolean
  }
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
  createdAt: Date
  updatedAt: Date
}

type VenueType = 'RESTAURANT' | 'HOTEL' | 'EVENT_SPACE' | 'BAR' | 'CAFE' | 'OTHER'
```

### Pricing Configuration
```typescript
interface VenuePricing {
  venueId: string
  nonPrime: {
    perDiner: number          // Base fee per diner
    platformFeePercent: number // Platform fee (typically 10%)
  }
  prime: {
    baseFor2: number          // Base price for 2 diners
    additionalPerPerson: number // Additional per person beyond 2
    platformFeePercent: number // Platform fee for Prime bookings
  }
  minimums: {
    bookingAmount: number     // Minimum booking value
    partySize: number         // Minimum party size
  }
  discounts?: {
    earlyBird?: number        // Early booking discount %
    repeatCustomer?: number   // Loyalty discount %
    group?: number            // Large group discount %
  }
  updatedAt: Date
  updatedBy: string
}

interface PricingExample {
  scenario: string
  diners: number
  type: 'PRIME' | 'NON_PRIME'
  calculation: {
    base: number
    additional: number
    subtotal: number
    platformFee: number
    total: number
  }
}
```

## 📅 Booking & Guest Models

### Booking
```typescript
interface Booking {
  id: string
  venueId: string
  promoterId?: string
  guestId: string
  
  // Booking Details
  diners: number
  bookingTime: Date
  duration?: number         // Duration in minutes
  specialRequests?: string
  notes?: string
  
  // Classification
  type: BookingType
  source: BookingSource
  status: BookingStatus
  
  // Financial
  fee: number              // Total fee charged
  platformFee: number      // Platform fee portion
  promoterCommission?: number
  
  // Metadata
  createdAt: Date
  updatedAt: Date
  confirmedAt?: Date
  cancelledAt?: Date
  noShowAt?: Date
  
  // Tracking
  ipAddress?: string
  userAgent?: string
  referrer?: string
  
  // Relationships
  guest: Guest
  promoter?: Promoter
  venue: Venue
  transactions: Transaction[]
  history: BookingHistory[]
}

type BookingType = 'PRIME' | 'NON_PRIME'
type BookingSource = 'DIRECT' | 'PROMOTER' | 'PARTNER' | 'WALK_IN' | 'PHONE'
type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'NO_SHOW' | 'COMPLETED'
```

### Guest
```typescript
interface Guest {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  
  // Demographics (optional)
  birthDate?: Date
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
  
  // Preferences
  dietaryRestrictions?: string[]
  seatingPreference?: 'INDOOR' | 'OUTDOOR' | 'BAR' | 'PRIVATE'
  communicationPreferences: {
    email: boolean
    sms: boolean
    push: boolean
  }
  
  // History
  totalBookings: number
  cancelledBookings: number
  noShowBookings: number
  totalSpent: number
  averagePartySize: number
  lastBookingAt?: Date
  
  // Status
  status: 'ACTIVE' | 'BLOCKED' | 'VIP'
  tags?: string[]
  
  // Audit
  createdAt: Date
  updatedAt: Date
}
```

### Booking History
```typescript
interface BookingHistory {
  id: string
  bookingId: string
  action: BookingAction
  previousValue?: any
  newValue?: any
  reason?: string
  performedBy: {
    id: string
    name: string
    role: UserRole
  }
  timestamp: Date
  metadata?: Record<string, any>
}

type BookingAction = 
  | 'CREATED'
  | 'CONFIRMED' 
  | 'CANCELLED'
  | 'NO_SHOW'
  | 'MODIFIED'
  | 'REFUNDED'
  | 'NOTE_ADDED'
```

## 👥 Promoter Models

### Promoter
```typescript
interface Promoter {
  id: string
  venueId: string
  
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  
  // Professional Details
  title?: string
  company?: string
  bio?: string
  socialMedia?: {
    instagram?: string
    facebook?: string
    tiktok?: string
    linkedin?: string
  }
  
  // Performance Metrics
  metrics: {
    totalBookings: number
    totalRevenue: number
    averageBookingValue: number
    conversionRate: number
    noShowRate: number
    cancelRate: number
  }
  
  // Current Period Performance
  thisMonth: {
    bookings: number
    revenue: number
    newGuests: number
    repeatGuests: number
  }
  
  // Status & Settings
  status: PromoterStatus
  tier: CommissionTier
  joinedAt: Date
  lastActiveAt?: Date
  
  // Commission Assignment
  commissionAssignment: CommissionAssignment
  
  // Relationships
  venue: Venue
  bookings: Booking[]
  incentiveProgress: IncentiveProgress[]
}

type PromoterStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL'
type CommissionTier = 'STANDARD' | 'PREMIUM' | 'VIP'
```

### Promoter Performance
```typescript
interface PromoterPerformance {
  promoterId: string
  period: {
    from: Date
    to: Date
    type: 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR'
  }
  
  metrics: {
    bookings: {
      total: number
      confirmed: number
      cancelled: number
      noShow: number
    }
    revenue: {
      total: number
      average: number
      prime: number
      nonPrime: number
    }
    guests: {
      new: number
      repeat: number
      total: number
    }
    conversion: {
      rate: number
      qualified: number
      total: number
    }
  }
  
  rankings: {
    bookings: number      // Rank by booking count
    revenue: number       // Rank by revenue
    conversion: number    // Rank by conversion rate
    overall: number       // Composite rank
  }
  
  trends: {
    bookings: number[]    // Daily booking counts
    revenue: number[]     // Daily revenue
  }
  
  badges: PromoterBadge[]
  
  calculatedAt: Date
}

interface PromoterBadge {
  type: 'TOP_PERFORMER' | 'MOST_IMPROVED' | 'CONSISTENCY' | 'NEW_TALENT'
  level: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
  period: string
  criteria: string
  earnedAt: Date
}
```

## 💰 Financial Models

### Transaction
```typescript
interface Transaction {
  id: string
  bookingId: string
  promoterId?: string
  venueId: string
  
  // Transaction Details
  type: TransactionType
  amount: number
  currency: string
  description: string
  
  // Commission Details
  commissionRate?: number
  commissionAmount?: number
  commissionTier?: CommissionTier
  
  // Processing
  status: TransactionStatus
  processedAt?: Date
  settledAt?: Date
  
  // References
  externalTransactionId?: string
  payoutId?: string
  
  // Audit
  createdAt: Date
  updatedAt: Date
}

type TransactionType = 
  | 'BOOKING_FEE'
  | 'PLATFORM_FEE' 
  | 'PROMOTER_COMMISSION'
  | 'REFUND'
  | 'ADJUSTMENT'
  | 'INCENTIVE_PAYOUT'

type TransactionStatus = 'PENDING' | 'CONFIRMED' | 'SETTLED' | 'FAILED' | 'CANCELLED'
```

### Commission Management
```typescript
interface CommissionRate {
  id: string
  venueId: string
  tier: CommissionTier
  model: CommissionModel
  
  // Rate Configuration
  value: number           // Percentage or fixed amount
  minBooking?: number     // Minimum booking value
  maxPayout?: number      // Maximum payout per booking
  
  // Conditions
  conditions?: {
    minMonthlyBookings?: number
    minConversionRate?: number
    maxCancelRate?: number
  }
  
  // Validity
  effectiveFrom: Date
  effectiveTo?: Date
  isActive: boolean
  
  // Audit
  createdAt: Date
  createdBy: string
}

type CommissionModel = 'PER_COVER' | 'PERCENT_OF_SPEND' | 'FLAT_RATE' | 'TIERED'

interface CommissionAssignment {
  promoterId: string
  tier: CommissionTier
  model: CommissionModel
  rate: number
  effectiveFrom: Date
  assignedBy: string
  assignedAt: Date
  notes?: string
}
```

### Payout Management
```typescript
interface Payout {
  id: string
  venueId: string
  promoterId?: string
  
  // Payout Details
  amount: number
  currency: string
  period: {
    from: Date
    to: Date
  }
  
  // Status
  status: PayoutStatus
  scheduledFor: Date
  processedAt?: Date
  
  // Breakdown
  breakdown: {
    commissions: number
    incentives: number
    adjustments: number
    fees: number
  }
  
  // Items
  items: PayoutItem[]
  holds: PayoutHold[]
  
  // Processing
  method: 'BANK_TRANSFER' | 'CHECK' | 'DIGITAL_WALLET'
  reference?: string
  
  // Audit
  createdAt: Date
  approvedBy?: string
  approvedAt?: Date
}

type PayoutStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

interface PayoutItem {
  transactionId: string
  description: string
  amount: number
  type: 'COMMISSION' | 'INCENTIVE' | 'ADJUSTMENT'
}

interface PayoutHold {
  id: string
  amount: number
  reason: string
  holdUntil?: Date
  createdBy: string
  createdAt: Date
  releasedAt?: Date
  releasedBy?: string
}
```

## 🎯 Incentive Models

### Incentive Program
```typescript
interface Incentive {
  id: string
  venueId: string
  
  // Program Details
  name: string
  description: string
  type: IncentiveType
  
  // Target & Reward
  target: IncentiveTarget
  reward: IncentiveReward
  
  // Period
  period: {
    type: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'CUSTOM'
    startDate: Date
    endDate: Date
    recurring: boolean
  }
  
  // Eligibility
  eligibility: {
    promoterTiers?: CommissionTier[]
    minTenure?: number      // Days as promoter
    maxPreviousWins?: number
  }
  
  // Status
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'
  
  // Tracking
  participantCount: number
  winnersCount: number
  totalPayout: number
  
  // Audit
  createdAt: Date
  createdBy: string
  updatedAt: Date
}

type IncentiveType = 'BOOKING_COUNT' | 'REVENUE_TARGET' | 'NEW_GUESTS' | 'CONVERSION_RATE'

interface IncentiveTarget {
  metric: 'BOOKINGS' | 'REVENUE' | 'NEW_GUESTS' | 'CONVERSION_RATE'
  threshold: number
  comparison: 'GREATER_THAN' | 'GREATER_EQUAL' | 'EQUAL' | 'TOP_N'
}

interface IncentiveReward {
  type: 'FIXED_AMOUNT' | 'PERCENTAGE_BONUS' | 'TIER_UPGRADE'
  value: number
  currency?: string
  description: string
}
```

### Incentive Progress
```typescript
interface IncentiveProgress {
  id: string
  incentiveId: string
  promoterId: string
  
  // Current Progress
  currentValue: number
  targetValue: number
  percentComplete: number
  
  // Status
  status: 'IN_PROGRESS' | 'ACHIEVED' | 'MISSED' | 'DISQUALIFIED'
  achievedAt?: Date
  
  // Tracking
  lastUpdated: Date
  milestones: IncentiveMilestone[]
  
  // Reward
  rewardEarned?: number
  rewardPaidAt?: Date
  
  // Relationships
  incentive: Incentive
  promoter: Promoter
}

interface IncentiveMilestone {
  value: number
  achievedAt: Date
  description: string
}
```

## 👤 User & Access Control Models

### User
```typescript
interface User {
  id: string
  venueId?: string
  
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone?: string
  
  // Authentication
  passwordHash: string
  emailVerified: boolean
  phoneVerified: boolean
  twoFactorEnabled: boolean
  
  // Role & Permissions
  role: UserRole
  permissions: Permission[]
  
  // Preferences
  preferences: {
    theme: 'LIGHT' | 'DARK' | 'SYSTEM'
    language: string
    timezone: string
    notifications: NotificationPreferences
  }
  
  // Status
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION'
  lastLoginAt?: Date
  lastActiveAt?: Date
  
  // Audit
  createdAt: Date
  updatedAt: Date
  createdBy?: string
}

type UserRole = 'ADMIN' | 'MANAGER' | 'COORDINATOR' | 'VIEWER'

interface Permission {
  resource: string
  actions: string[]
  conditions?: Record<string, any>
}

interface NotificationPreferences {
  email: {
    bookings: boolean
    payouts: boolean
    incentives: boolean
    system: boolean
  }
  push: {
    realtime: boolean
    daily: boolean
    weekly: boolean
  }
  sms: {
    urgent: boolean
    reminders: boolean
  }
}
```

### Audit Log
```typescript
interface AuditLog {
  id: string
  userId: string
  venueId?: string
  
  // Action Details
  action: string
  resource: string
  resourceId: string
  
  // Changes
  changes?: {
    before: Record<string, any>
    after: Record<string, any>
  }
  
  // Context
  ipAddress: string
  userAgent: string
  sessionId: string
  
  // Result
  success: boolean
  errorMessage?: string
  
  // Timing
  timestamp: Date
  duration?: number
  
  // Relationships
  user: User
}
```

## 📊 Analytics & Metrics Models

### Metrics Summary
```typescript
interface MetricsSummary {
  venueId: string
  period: {
    from: Date
    to: Date
  }
  
  // Core KPIs
  totalDiners: MetricValue
  totalBookings: MetricValue
  totalRevenue: MetricValue
  averageBookingValue: MetricValue
  conversionRate: MetricValue
  
  // Performance Breakdown
  breakdown: {
    byType: {
      prime: MetricValue
      nonPrime: MetricValue
    }
    byStatus: {
      confirmed: MetricValue
      cancelled: MetricValue
      noShow: MetricValue
    }
    bySource: Record<BookingSource, MetricValue>
  }
  
  // Trends
  trends: {
    daily: DailyMetric[]
    weekly: WeeklyMetric[]
  }
  
  // Comparisons
  previousPeriod: MetricsSummary
  yearOverYear: MetricsSummary
  
  calculatedAt: Date
}

interface MetricValue {
  current: number
  previous: number
  change: number
  changePercent: number
  trend: 'UP' | 'DOWN' | 'STABLE'
}

interface DailyMetric {
  date: string
  bookings: number
  revenue: number
  diners: number
  conversionRate: number
}
```

---

These data models provide a comprehensive foundation for all PRIMA Partner Dashboard functionality, ensuring type safety, data consistency, and clear relationships between entities.
