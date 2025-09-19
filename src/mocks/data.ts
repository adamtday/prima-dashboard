// Mock data for PRIMA Partner Dashboard
// Based on RFC-002: Data Layer & State Management

import type {
  Venue,
  Booking,
  Promoter,
  PricingConfig,
  CommissionRate,
  VenueMetrics,
  PortfolioMetrics
} from '@/types/data'

// ===== VENUE MOCK DATA =====
export const mockVenues: Venue[] = [
  {
    id: 'venue-1',
    name: 'Rooftop Lounge',
    type: 'ROOFTOP',
    address: '123 Sky High St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    phone: '+1 (555) 123-4567',
    email: 'rooftop@prima.com',
    capacity: 150,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-09-18T15:30:00Z'
  },
  {
    id: 'venue-2',
    name: 'Garden Terrace',
    type: 'GARDEN',
    address: '456 Green Valley Ave',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90210',
    phone: '+1 (555) 234-5678',
    email: 'garden@prima.com',
    capacity: 200,
    isActive: true,
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-09-18T15:30:00Z'
  },
  {
    id: 'venue-3',
    name: 'Sky Bar',
    type: 'SKY_BAR',
    address: '789 Cloud Nine Blvd',
    city: 'Miami',
    state: 'FL',
    zipCode: '33101',
    phone: '+1 (555) 345-6789',
    email: 'skybar@prima.com',
    capacity: 100,
    isActive: true,
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-09-18T15:30:00Z'
  },
  {
    id: 'venue-4',
    name: 'Private Club',
    type: 'PRIVATE_CLUB',
    address: '321 Exclusive Lane',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    phone: '+1 (555) 456-7890',
    email: 'private@prima.com',
    capacity: 75,
    isActive: true,
    createdAt: '2024-04-01T10:00:00Z',
    updatedAt: '2024-09-18T15:30:00Z'
  }
]

// ===== PROMOTER MOCK DATA =====
export const mockPromoters: Promoter[] = [
  {
    id: 'promoter-1',
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@prima.com',
    phone: '+1 (555) 111-1111',
    tier: 'VIP',
    status: 'ACTIVE',
    venueAccess: ['venue-1', 'venue-2', 'venue-3', 'venue-4'],
    totalBookings: 156,
    totalRevenue: 89450,
    averageBookingValue: 573.40,
    conversionRate: 0.78,
    noShowRate: 0.05,
    cancellationRate: 0.12,
    joinedDate: '2024-01-15T10:00:00Z',
    lastActiveDate: '2024-09-18T14:30:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-09-18T15:30:00Z'
  },
  {
    id: 'promoter-2',
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.williams@prima.com',
    phone: '+1 (555) 222-2222',
    tier: 'PREMIUM',
    status: 'ACTIVE',
    venueAccess: ['venue-1', 'venue-2'],
    totalBookings: 89,
    totalRevenue: 45620,
    averageBookingValue: 512.58,
    conversionRate: 0.72,
    noShowRate: 0.08,
    cancellationRate: 0.15,
    joinedDate: '2024-02-01T10:00:00Z',
    lastActiveDate: '2024-09-18T12:15:00Z',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-09-18T15:30:00Z'
  },
  {
    id: 'promoter-3',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@prima.com',
    phone: '+1 (555) 333-3333',
    tier: 'STANDARD',
    status: 'ACTIVE',
    venueAccess: ['venue-3'],
    totalBookings: 45,
    totalRevenue: 18950,
    averageBookingValue: 421.11,
    conversionRate: 0.65,
    noShowRate: 0.12,
    cancellationRate: 0.18,
    joinedDate: '2024-03-01T10:00:00Z',
    lastActiveDate: '2024-09-18T09:45:00Z',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-09-18T15:30:00Z'
  }
]

// ===== BOOKING MOCK DATA =====
export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    venueId: 'venue-1',
    promoterId: 'promoter-1',
    guestName: 'John Smith',
    guestEmail: 'john.smith@email.com',
    guestPhone: '+1 (555) 444-4444',
    partySize: 4,
    bookingDate: '2024-09-20',
    bookingTime: '19:00',
    status: 'CONFIRMED',
    type: 'PRIME',
    primeTotal: 240,
    nonPrimeTotal: 200,
    commissionAmount: 48,
    notes: 'VIP guest, special dietary requirements',
    createdAt: '2024-09-18T10:00:00Z',
    updatedAt: '2024-09-18T10:00:00Z'
  },
  {
    id: 'booking-2',
    venueId: 'venue-2',
    promoterId: 'promoter-2',
    guestName: 'Emily Davis',
    guestEmail: 'emily.davis@email.com',
    guestPhone: '+1 (555) 555-5555',
    partySize: 2,
    bookingDate: '2024-09-21',
    bookingTime: '20:30',
    status: 'PENDING',
    type: 'NON_PRIME',
    primeTotal: 0,
    nonPrimeTotal: 120,
    commissionAmount: 12,
    createdAt: '2024-09-18T11:30:00Z',
    updatedAt: '2024-09-18T11:30:00Z'
  },
  {
    id: 'booking-3',
    venueId: 'venue-3',
    promoterId: 'promoter-3',
    guestName: 'Robert Wilson',
    guestEmail: 'robert.wilson@email.com',
    guestPhone: '+1 (555) 666-6666',
    partySize: 6,
    bookingDate: '2024-09-22',
    bookingTime: '18:00',
    status: 'CONFIRMED',
    type: 'PRIME',
    primeTotal: 360,
    nonPrimeTotal: 300,
    commissionAmount: 72,
    createdAt: '2024-09-18T14:15:00Z',
    updatedAt: '2024-09-18T14:15:00Z'
  }
]

// ===== PRICING MOCK DATA =====
export const mockPricingConfigs: PricingConfig[] = [
  {
    id: 'pricing-1',
    venueId: 'venue-1',
    primeBasePrice: 60,
    primePerPersonPrice: 45,
    nonPrimePerPersonPrice: 40,
    platformFeePercentage: 5,
    minimumPartySize: 2,
    maximumPartySize: 12,
    isActive: true,
    effectiveDate: '2024-09-01T00:00:00Z',
    createdAt: '2024-09-01T00:00:00Z',
    updatedAt: '2024-09-18T15:30:00Z'
  },
  {
    id: 'pricing-2',
    venueId: 'venue-2',
    primeBasePrice: 50,
    primePerPersonPrice: 40,
    nonPrimePerPersonPrice: 35,
    platformFeePercentage: 5,
    minimumPartySize: 2,
    maximumPartySize: 10,
    isActive: true,
    effectiveDate: '2024-09-01T00:00:00Z',
    createdAt: '2024-09-01T00:00:00Z',
    updatedAt: '2024-09-18T15:30:00Z'
  }
]

// ===== COMMISSION RATES MOCK DATA =====
export const mockCommissionRates: CommissionRate[] = [
  {
    id: 'rate-1',
    tier: 'STANDARD',
    type: 'PERCENTAGE',
    value: 10,
    isActive: true,
    effectiveDate: '2024-09-01T00:00:00Z',
    createdAt: '2024-09-01T00:00:00Z',
    updatedAt: '2024-09-18T15:30:00Z'
  },
  {
    id: 'rate-2',
    tier: 'PREMIUM',
    type: 'PERCENTAGE',
    value: 15,
    isActive: true,
    effectiveDate: '2024-09-01T00:00:00Z',
    createdAt: '2024-09-01T00:00:00Z',
    updatedAt: '2024-09-18T15:30:00Z'
  },
  {
    id: 'rate-3',
    tier: 'VIP',
    type: 'PERCENTAGE',
    value: 20,
    isActive: true,
    effectiveDate: '2024-09-01T00:00:00Z',
    createdAt: '2024-09-01T00:00:00Z',
    updatedAt: '2024-09-18T15:30:00Z'
  }
]

// ===== METRICS MOCK DATA =====
export const mockVenueMetrics: Record<string, VenueMetrics> = {
  'venue-1': {
    venueId: 'venue-1',
    totalRevenue: 125400,
    totalBookings: 89,
    totalGuests: 267,
    averageBookingValue: 1408.99,
    conversionRate: 0.75,
    noShowRate: 0.06,
    cancellationRate: 0.14,
    period: {
      from: '2024-09-01T00:00:00Z',
      to: '2024-09-18T23:59:59Z'
    }
  },
  'venue-2': {
    venueId: 'venue-2',
    totalRevenue: 98750,
    totalBookings: 67,
    totalGuests: 201,
    averageBookingValue: 1473.88,
    conversionRate: 0.72,
    noShowRate: 0.08,
    cancellationRate: 0.16,
    period: {
      from: '2024-09-01T00:00:00Z',
      to: '2024-09-18T23:59:59Z'
    }
  }
}

export const mockPortfolioMetrics: PortfolioMetrics = {
  totalRevenue: 456750,
  totalBookings: 312,
  totalGuests: 936,
  averageBookingValue: 1463.94,
  totalPromoters: 12,
  activeVenues: 4,
  period: {
    from: '2024-09-01T00:00:00Z',
    to: '2024-09-18T23:59:59Z'
  },
  venueBreakdown: Object.values(mockVenueMetrics)
}
