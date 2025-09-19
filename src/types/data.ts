// Core data models for PRIMA Partner Dashboard
// Based on RFC-002: Data Layer & State Management

// ===== VENUE TYPES =====
export interface Venue {
  id: string
  name: string
  type: 'ROOFTOP' | 'GARDEN' | 'SKY_BAR' | 'PRIVATE_CLUB'
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  capacity: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// ===== BOOKING TYPES =====
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'NO_SHOW' | 'COMPLETED'
export type BookingType = 'PRIME' | 'NON_PRIME'

export interface Booking {
  id: string
  venueId: string
  promoterId: string
  guestName: string
  guestEmail: string
  guestPhone: string
  partySize: number
  bookingDate: string
  bookingTime: string
  status: BookingStatus
  type: BookingType
  primeTotal: number
  nonPrimeTotal: number
  commissionAmount: number
  notes?: string
  createdAt: string
  updatedAt: string
}

// ===== PROMOTER TYPES =====
export type PromoterTier = 'STANDARD' | 'PREMIUM' | 'VIP'
export type PromoterStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

export interface Promoter {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  tier: PromoterTier
  status: PromoterStatus
  venueAccess: string[]
  totalBookings: number
  totalRevenue: number
  averageBookingValue: number
  conversionRate: number
  noShowRate: number
  cancellationRate: number
  joinedDate: string
  lastActiveDate: string
  createdAt: string
  updatedAt: string
}

// ===== PRICING TYPES =====
export interface PricingConfig {
  id: string
  venueId: string
  primeBasePrice: number
  primePerPersonPrice: number
  nonPrimePerPersonPrice: number
  platformFeePercentage: number
  minimumPartySize: number
  maximumPartySize: number
  isActive: boolean
  effectiveDate: string
  createdAt: string
  updatedAt: string
}

// ===== FINANCIAL TYPES =====
export interface Transaction {
  id: string
  venueId: string
  promoterId: string
  bookingId: string
  type: 'COMMISSION' | 'PAYOUT' | 'HOLD' | 'RELEASE'
  amount: number
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  description: string
  processedDate?: string
  createdAt: string
  updatedAt: string
}

export interface Payout {
  id: string
  promoterId: string
  amount: number
  status: 'PENDING' | 'APPROVED' | 'PROCESSED' | 'HOLD'
  scheduledDate: string
  processedDate?: string
  holdReason?: string
  createdAt: string
  updatedAt: string
}

// ===== INCENTIVE TYPES =====
export type IncentiveType = 'BOOKING_TARGET' | 'REVENUE_TARGET' | 'CONVERSION_TARGET'
export type IncentiveStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED'

export interface Incentive {
  id: string
  name: string
  description: string
  type: IncentiveType
  targetValue: number
  rewardAmount: number
  startDate: string
  endDate: string
  status: IncentiveStatus
  promoterIds: string[]
  venueIds: string[]
  currentProgress: number
  createdAt: string
  updatedAt: string
}

// ===== COMMISSION TYPES =====
export interface CommissionRate {
  id: string
  tier: PromoterTier
  type: 'PERCENTAGE' | 'FIXED_AMOUNT'
  value: number
  minBookingValue?: number
  maxBookingValue?: number
  isActive: boolean
  effectiveDate: string
  createdAt: string
  updatedAt: string
}

// ===== API RESPONSE TYPES =====
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  message: string
  code: string
  details?: Record<string, unknown>
}

// ===== FILTER TYPES =====
export interface BookingFilters {
  status?: BookingStatus[]
  type?: BookingType[]
  venueId?: string
  promoterId?: string
  dateRange?: {
    from: string
    to: string
  }
  search?: string
}

export interface PromoterFilters {
  tier?: PromoterTier[]
  status?: PromoterStatus[]
  venueId?: string
  search?: string
}

export interface VenueFilters {
  type?: Venue['type'][]
  isActive?: boolean
  search?: string
}

// ===== METRICS TYPES =====
export interface VenueMetrics {
  venueId: string
  totalRevenue: number
  totalBookings: number
  totalGuests: number
  averageBookingValue: number
  conversionRate: number
  noShowRate: number
  cancellationRate: number
  period: {
    from: string
    to: string
  }
}

export interface PromoterMetrics {
  promoterId: string
  totalBookings: number
  totalRevenue: number
  averageBookingValue: number
  conversionRate: number
  noShowRate: number
  cancellationRate: number
  period: {
    from: string
    to: string
  }
}

// ===== PORTFOLIO TYPES =====
export interface PortfolioMetrics {
  totalRevenue: number
  totalBookings: number
  totalGuests: number
  averageBookingValue: number
  totalPromoters: number
  activeVenues: number
  period: {
    from: string
    to: string
  }
  venueBreakdown: VenueMetrics[]
}
