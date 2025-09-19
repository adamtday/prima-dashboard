# Mock Data Patterns & Generation

Comprehensive guide to realistic mock data generation for the PRIMA Partner Dashboard prototype, including business logic patterns, realistic distributions, and data relationships.

## 🎯 Data Strategy Overview

Mock data must accurately represent real-world venue operations to provide meaningful stakeholder demonstrations and development testing scenarios.

## 🏢 Portfolio Structure

### Multi-Venue Portfolio Setup
```typescript
export const portfolioStructure = {
  venues: 4,
  distribution: {
    restaurant: 2,     // Main revenue generators
    hotel: 1,          // High-volume bookings
    eventSpace: 1,     // High-value bookings
  },
  characteristics: {
    venue1: { type: 'RESTAURANT', tier: 'HIGH_END', capacity: 80 },
    venue2: { type: 'RESTAURANT', tier: 'CASUAL', capacity: 120 },
    venue3: { type: 'HOTEL', tier: 'BOUTIQUE', capacity: 200 },
    venue4: { type: 'EVENT_SPACE', tier: 'PREMIUM', capacity: 300 },
  }
}
```

### Venue Data Generation
```typescript
interface MockVenue {
  id: string
  name: string
  type: VenueType
  tier: 'CASUAL' | 'MID_TIER' | 'HIGH_END' | 'PREMIUM'
  location: {
    city: string
    neighborhood: string
    coordinates: { lat: number; lng: number }
  }
  capacity: number
  averageDailyBookings: number
  primeRatio: number
  averageBookingValue: number
}

export const mockVenues: MockVenue[] = [
  {
    id: 'venue_prima_restaurant_downtown',
    name: 'Prima Downtown',
    type: 'RESTAURANT',
    tier: 'HIGH_END',
    location: {
      city: 'San Francisco',
      neighborhood: 'Financial District',
      coordinates: { lat: 37.7949, lng: -122.3989 }
    },
    capacity: 80,
    averageDailyBookings: 18,
    primeRatio: 0.65,           // 65% Prime bookings
    averageBookingValue: 145,
  },
  {
    id: 'venue_prima_bistro_mission',
    name: 'Prima Bistro',
    type: 'RESTAURANT', 
    tier: 'CASUAL',
    location: {
      city: 'San Francisco',
      neighborhood: 'Mission District',
      coordinates: { lat: 37.7599, lng: -122.4148 }
    },
    capacity: 120,
    averageDailyBookings: 25,
    primeRatio: 0.45,           // 45% Prime bookings
    averageBookingValue: 85,
  },
  {
    id: 'venue_prima_hotel_nob',
    name: 'Prima Hotel Nob Hill',
    type: 'HOTEL',
    tier: 'BOUTIQUE',
    location: {
      city: 'San Francisco', 
      neighborhood: 'Nob Hill',
      coordinates: { lat: 37.7925, lng: -122.4143 }
    },
    capacity: 200,
    averageDailyBookings: 35,
    primeRatio: 0.75,           // 75% Prime bookings
    averageBookingValue: 220,
  },
  {
    id: 'venue_prima_events_soma',
    name: 'Prima Events SoMa',
    type: 'EVENT_SPACE',
    tier: 'PREMIUM',
    location: {
      city: 'San Francisco',
      neighborhood: 'South of Market',
      coordinates: { lat: 37.7849, lng: -122.4094 }
    },
    capacity: 300,
    averageDailyBookings: 8,
    primeRatio: 0.85,           // 85% Prime bookings
    averageBookingValue: 450,
  },
]
```

## 📊 Booking Generation Patterns

### Realistic Booking Distribution
```typescript
interface BookingPatterns {
  // Time-based patterns
  timeDistribution: {
    hourly: Record<number, number>
    dayOfWeek: Record<number, number>
    monthly: Record<number, number>
  }
  
  // Booking characteristics
  partySize: {
    distribution: [number, number][]  // [size, probability]
    averageByVenueType: Record<VenueType, number>
  }
  
  // Status distribution
  statusRates: {
    confirmed: 0.85
    cancelled: 0.10
    noShow: 0.05
    pending: 0.05   // Some bookings stay pending
  }
  
  // Prime vs Non-Prime
  primeDistribution: {
    byVenueType: Record<VenueType, number>
    byPartySize: Record<number, number>
    byTimeSlot: Record<string, number>
  }
}

export const bookingPatterns: BookingPatterns = {
  timeDistribution: {
    // Restaurant booking times (24-hour format)
    hourly: {
      11: 0.05, 12: 0.15, 13: 0.20,  // Lunch
      17: 0.10, 18: 0.20, 19: 0.25, 20: 0.15, 21: 0.10  // Dinner
    },
    
    // Day of week multipliers (0 = Sunday)
    dayOfWeek: {
      0: 0.8,   // Sunday
      1: 0.6,   // Monday  
      2: 0.7,   // Tuesday
      3: 0.8,   // Wednesday
      4: 1.1,   // Thursday
      5: 1.4,   // Friday
      6: 1.6,   // Saturday
    },
    
    // Monthly variations (seasonal patterns)
    monthly: {
      0: 0.85,  // January (post-holiday)
      1: 0.90,  // February 
      2: 1.05,  // March
      3: 1.10,  // April
      4: 1.15,  // May
      5: 1.05,  // June
      6: 0.95,  // July (vacation)
      7: 0.90,  // August (vacation)
      8: 1.10,  // September
      9: 1.15,  // October
      10: 1.25, // November (holidays)
      11: 1.20, // December (holidays)
    }
  },
  
  partySize: {
    distribution: [
      [1, 0.15], [2, 0.35], [3, 0.20], [4, 0.15], 
      [5, 0.08], [6, 0.04], [7, 0.02], [8, 0.01]
    ],
    averageByVenueType: {
      RESTAURANT: 2.8,
      HOTEL: 3.2,
      EVENT_SPACE: 6.5,
      BAR: 2.1,
      CAFE: 1.9,
      OTHER: 3.0,
    }
  },
  
  statusRates: {
    confirmed: 0.85,
    cancelled: 0.10,
    noShow: 0.05,
    pending: 0.05,
  },
  
  primeDistribution: {
    byVenueType: {
      RESTAURANT: 0.55,
      HOTEL: 0.75,
      EVENT_SPACE: 0.85,
      BAR: 0.30,
      CAFE: 0.25,
      OTHER: 0.50,
    },
    byPartySize: {
      1: 0.20, 2: 0.45, 3: 0.60, 4: 0.70,
      5: 0.80, 6: 0.85, 7: 0.90, 8: 0.95
    },
    byTimeSlot: {
      'lunch': 0.40,
      'early_dinner': 0.65,
      'prime_dinner': 0.80,
      'late_dinner': 0.45,
    }
  }
}
```

### Booking Generation Function
```typescript
export function generateBooking(
  venueId: string, 
  date: Date,
  overrides: Partial<Booking> = {}
): Booking {
  const venue = mockVenues.find(v => v.id === venueId)!
  const dayOfWeek = date.getDay()
  const month = date.getMonth()
  
  // Apply time-based multipliers
  const dayMultiplier = bookingPatterns.timeDistribution.dayOfWeek[dayOfWeek]
  const monthMultiplier = bookingPatterns.timeDistribution.monthly[month]
  
  // Generate party size based on venue type
  const partySize = generatePartySize(venue.type)
  
  // Determine if Prime booking
  const venueBasePrimeRate = venue.primeRatio
  const partySizeBoost = bookingPatterns.primeDistribution.byPartySize[partySize] || 0.5
  const finalPrimeRate = Math.min(0.95, venueBasePrimeRate * partySizeBoost)
  const isPrime = Math.random() < finalPrimeRate
  
  // Generate booking time
  const bookingTime = generateBookingTime(date, venue.type)
  
  // Calculate pricing
  const pricing = calculateBookingPrice(venue, partySize, isPrime)
  
  // Determine status
  const status = generateBookingStatus()
  
  // Generate guest information
  const guest = generateGuest()
  
  // Assign promoter (80% of bookings have promoters)
  const promoter = Math.random() < 0.8 ? assignPromoter(venueId) : null
  
  return {
    id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    venueId,
    promoterId: promoter?.id,
    guestId: guest.id,
    guestName: guest.name,
    guestEmail: guest.email,
    guestPhone: guest.phone,
    diners: partySize,
    bookingTime,
    createdAt: new Date(bookingTime.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Created 0-7 days before
    updatedAt: new Date(),
    status,
    source: promoter ? 'PROMOTER' : (Math.random() < 0.7 ? 'DIRECT' : 'PARTNER'),
    type: isPrime ? 'PRIME' : 'NON_PRIME',
    fee: pricing.totalFee,
    platformFee: pricing.platformFee,
    notes: generateBookingNotes(),
    metadata: {
      ipAddress: generateIPAddress(),
      userAgent: generateUserAgent(),
      referrer: promoter ? `promoter-${promoter.id}` : 'direct',
    },
    ...overrides,
  }
}
```

## 👥 Promoter Data Patterns

### Promoter Performance Distribution (80/20 Rule)
```typescript
interface PromoterTier {
  tier: 'TOP' | 'MID' | 'LOW'
  percentage: number
  bookingsPerMonth: { min: number; max: number }
  conversionRate: { min: number; max: number }
  averageBookingValue: number
}

export const promoterTiers: PromoterTier[] = [
  {
    tier: 'TOP',
    percentage: 0.20,      // Top 20% of promoters
    bookingsPerMonth: { min: 25, max: 50 },
    conversionRate: { min: 0.15, max: 0.30 },
    averageBookingValue: 180,
  },
  {
    tier: 'MID', 
    percentage: 0.60,      // Middle 60% of promoters
    bookingsPerMonth: { min: 8, max: 25 },
    conversionRate: { min: 0.08, max: 0.15 },
    averageBookingValue: 140,
  },
  {
    tier: 'LOW',
    percentage: 0.20,      // Bottom 20% of promoters
    bookingsPerMonth: { min: 0, max: 8 },
    conversionRate: { min: 0.02, max: 0.08 },
    averageBookingValue: 110,
  },
]

export function generatePromoters(venueIds: string[], count = 25): Promoter[] {
  const promoters: Promoter[] = []
  
  promoterTiers.forEach(tier => {
    const tierCount = Math.round(count * tier.percentage)
    
    for (let i = 0; i < tierCount; i++) {
      const promoter = generatePromoter(venueIds, tier)
      promoters.push(promoter)
    }
  })
  
  return promoters
}

function generatePromoter(venueIds: string[], tier: PromoterTier): Promoter {
  const name = generatePromoterName()
  const monthlyBookings = randomBetween(tier.bookingsPerMonth.min, tier.bookingsPerMonth.max)
  const conversionRate = randomBetween(tier.conversionRate.min, tier.conversionRate.max)
  
  // Some promoters work across multiple venues
  const assignedVenues = tier.tier === 'TOP' && Math.random() < 0.3 
    ? venueIds.slice(0, 2) // Top promoters may work 2 venues
    : [venueIds[Math.floor(Math.random() * venueIds.length)]]
  
  return {
    id: `promoter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    venueId: assignedVenues[0], // Primary venue
    firstName: name.first,
    lastName: name.last,
    email: `${name.first.toLowerCase()}.${name.last.toLowerCase()}@email.com`,
    phone: generatePhoneNumber(),
    title: generatePromoterTitle(tier.tier),
    company: Math.random() < 0.3 ? generateCompanyName() : undefined,
    bio: generatePromoterBio(tier.tier),
    socialMedia: generateSocialMedia(name.first, name.last),
    metrics: {
      totalBookings: monthlyBookings * 6, // 6 months of history
      totalRevenue: monthlyBookings * 6 * tier.averageBookingValue,
      averageBookingValue: tier.averageBookingValue,
      conversionRate,
      noShowRate: randomBetween(0.02, 0.08),
      cancelRate: randomBetween(0.05, 0.15),
    },
    thisMonth: {
      bookings: monthlyBookings,
      revenue: monthlyBookings * tier.averageBookingValue,
      newGuests: Math.round(monthlyBookings * 0.6),
      repeatGuests: Math.round(monthlyBookings * 0.4),
    },
    status: 'ACTIVE',
    tier: assignCommissionTier(tier.tier),
    joinedAt: generateJoinDate(),
    lastActiveAt: generateRecentDate(),
    commissionAssignment: generateCommissionAssignment(),
    venue: mockVenues.find(v => v.id === assignedVenues[0])!,
    bookings: [], // Will be populated by booking generation
    incentiveProgress: [], // Will be populated by incentive generation
  }
}
```

## 💰 Financial Data Patterns

### Commission Structure
```typescript
export const commissionStructure = {
  tiers: {
    STANDARD: {
      perCover: 8,          // $8 per diner
      percentOfSpend: 0.06, // 6% of total booking value
    },
    PREMIUM: {
      perCover: 12,         // $12 per diner
      percentOfSpend: 0.08, // 8% of total booking value
    },
    VIP: {
      perCover: 18,         // $18 per diner  
      percentOfSpend: 0.12, // 12% of total booking value
    },
  },
  
  // Commission tier distribution
  tierDistribution: {
    STANDARD: 0.70,   // 70% of promoters
    PREMIUM: 0.25,    // 25% of promoters
    VIP: 0.05,        // 5% of promoters (top performers)
  },
  
  // Payout schedule
  payoutSchedule: {
    frequency: 'WEEKLY',
    dayOfWeek: 1,     // Monday
    holdPeriod: 7,    // 7 days hold period
    minimumPayout: 50, // $50 minimum
  },
}

export function calculateCommission(
  booking: Booking, 
  promoter: Promoter
): number {
  const tier = promoter.commissionAssignment.tier
  const model = promoter.commissionAssignment.model
  const rates = commissionStructure.tiers[tier]
  
  if (model === 'PER_COVER') {
    return booking.diners * rates.perCover
  } else {
    return booking.fee * rates.percentOfSpend
  }
}
```

### Payout Generation
```typescript
export function generatePayouts(
  promoters: Promoter[], 
  bookings: Booking[],
  weeksBack = 4
): Payout[] {
  const payouts: Payout[] = []
  
  for (let week = 0; week < weeksBack; week++) {
    const payoutDate = getPayoutDate(week)
    const weeklyPayouts = generateWeeklyPayouts(promoters, bookings, payoutDate)
    payouts.push(...weeklyPayouts)
  }
  
  return payouts
}

function generateWeeklyPayouts(
  promoters: Promoter[],
  bookings: Booking[], 
  payoutDate: Date
): Payout[] {
  return promoters.map(promoter => {
    const weekBookings = getPromoterBookingsForWeek(promoter.id, bookings, payoutDate)
    const totalCommissions = weekBookings.reduce((sum, booking) => 
      sum + calculateCommission(booking, promoter), 0
    )
    
    // Apply holds (5% chance of hold)
    const holds: PayoutHold[] = Math.random() < 0.05 ? [
      {
        id: generateId('hold'),
        amount: totalCommissions * 0.2, // Hold 20% of payout
        reason: generateHoldReason(),
        createdBy: 'system',
        createdAt: payoutDate,
      }
    ] : []
    
    const heldAmount = holds.reduce((sum, hold) => sum + hold.amount, 0)
    const finalAmount = totalCommissions - heldAmount
    
    return {
      id: generateId('payout'),
      venueId: promoter.venueId,
      promoterId: promoter.id,
      amount: finalAmount,
      currency: 'USD',
      period: {
        from: getWeekStart(payoutDate),
        to: getWeekEnd(payoutDate),
      },
      status: determinePayoutStatus(payoutDate),
      scheduledFor: payoutDate,
      processedAt: payoutDate < new Date() ? payoutDate : undefined,
      breakdown: {
        commissions: totalCommissions,
        incentives: 0, // TODO: Add incentive calculations
        adjustments: 0,
        fees: 0,
      },
      items: weekBookings.map(booking => ({
        transactionId: booking.id,
        description: `Commission for booking ${booking.id}`,
        amount: calculateCommission(booking, promoter),
        type: 'COMMISSION' as const,
      })),
      holds,
      method: 'BANK_TRANSFER',
      reference: generatePayoutReference(),
      createdAt: payoutDate,
    }
  }).filter(payout => payout.amount >= commissionStructure.payoutSchedule.minimumPayout)
}
```

## 📈 Metrics & Analytics Patterns

### KPI Calculation Functions
```typescript
export function calculateVenueKPIs(
  venueId: string,
  bookings: Booking[],
  dateRange: { from: Date; to: Date }
): OverviewMetrics['kpis'] {
  const venueBookings = bookings.filter(b => 
    b.venueId === venueId && 
    b.bookingTime >= dateRange.from && 
    b.bookingTime <= dateRange.to
  )
  
  const confirmedBookings = venueBookings.filter(b => b.status === 'CONFIRMED')
  
  return {
    totalDiners: {
      current: confirmedBookings.reduce((sum, b) => sum + b.diners, 0),
      previous: 0, // TODO: Calculate previous period
      change: 0,
    },
    totalBookings: {
      current: confirmedBookings.length,
      previous: 0,
      change: 0,
      breakdown: {
        confirmed: venueBookings.filter(b => b.status === 'CONFIRMED').length,
        pending: venueBookings.filter(b => b.status === 'PENDING').length,
        cancelled: venueBookings.filter(b => b.status === 'CANCELLED').length,
        noShow: venueBookings.filter(b => b.status === 'NO_SHOW').length,
      }
    },
    totalRevenue: {
      current: confirmedBookings.reduce((sum, b) => sum + b.fee, 0),
      previous: 0,
      change: 0,
      breakdown: {
        prime: confirmedBookings.filter(b => b.type === 'PRIME').reduce((sum, b) => sum + b.fee, 0),
        nonPrime: confirmedBookings.filter(b => b.type === 'NON_PRIME').reduce((sum, b) => sum + b.fee, 0),
        platform: confirmedBookings.reduce((sum, b) => sum + b.platformFee, 0),
      }
    },
    primePerformance: {
      conversionRate: confirmedBookings.length > 0 
        ? confirmedBookings.filter(b => b.type === 'PRIME').length / confirmedBookings.length 
        : 0,
      averageSpend: confirmedBookings.filter(b => b.type === 'PRIME').length > 0
        ? confirmedBookings.filter(b => b.type === 'PRIME').reduce((sum, b) => sum + b.fee, 0) / 
          confirmedBookings.filter(b => b.type === 'PRIME').length
        : 0,
      totalImpact: confirmedBookings.filter(b => b.type === 'PRIME').reduce((sum, b) => sum + b.fee, 0),
    },
    investmentSpend: {
      total: 0, // TODO: Calculate from commissions and incentives
      commissions: 0,
      incentives: 0,
      roi: 0,
    }
  }
}
```

## 🎛️ Data Seeding & Reset

### Seeding Functions
```typescript
export function seedMockData(): MockDataSet {
  console.log('🌱 Seeding PRIMA mock data...')
  
  // Generate core data
  const venues = mockVenues
  const promoters = generatePromoters(venues.map(v => v.id), 25)
  const bookings = generateBookingsForPeriod(venues, promoters, 90) // 90 days
  const payouts = generatePayouts(promoters, bookings, 12) // 12 weeks
  const incentives = generateIncentives(venues.map(v => v.id), 3)
  const users = generateUsers(venues)
  
  console.log(`✅ Generated:`)
  console.log(`   📍 ${venues.length} venues`)
  console.log(`   👥 ${promoters.length} promoters`) 
  console.log(`   📅 ${bookings.length} bookings`)
  console.log(`   💰 ${payouts.length} payouts`)
  console.log(`   🎯 ${incentives.length} incentives`)
  console.log(`   👤 ${users.length} users`)
  
  return {
    venues,
    promoters,
    bookings,
    payouts,
    incentives,
    users,
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
      datasetId: generateId('dataset'),
    }
  }
}

// Deterministic seeding for consistent demos
export function seedDeterministicData(seed = 'prima-demo-2025'): MockDataSet {
  // Use seeded random for consistent data generation
  const seededRandom = createSeededRandom(seed)
  
  // Override Math.random temporarily
  const originalRandom = Math.random
  Math.random = seededRandom
  
  try {
    const data = seedMockData()
    return data
  } finally {
    // Restore original Math.random
    Math.random = originalRandom
  }
}
```

## 🔄 Data Refresh & Updates

### Real-Time Data Updates
```typescript
export class MockDataManager {
  private static instance: MockDataManager
  private data: MockDataSet
  private updateInterval: NodeJS.Timeout | null = null
  
  static getInstance(): MockDataManager {
    if (!MockDataManager.instance) {
      MockDataManager.instance = new MockDataManager()
    }
    return MockDataManager.instance
  }
  
  startRealTimeUpdates(intervalMs = 30000): void {
    this.updateInterval = setInterval(() => {
      this.simulateRealTimeChanges()
    }, intervalMs)
  }
  
  private simulateRealTimeChanges(): void {
    // Add new bookings (1-3 per update)
    const newBookings = this.generateNewBookings(1, 3)
    this.data.bookings.push(...newBookings)
    
    // Update some booking statuses
    this.updateRandomBookingStatuses()
    
    // Update promoter metrics
    this.updatePromoterMetrics()
    
    // Notify listeners of changes
    this.notifyDataChanges()
  }
  
  private notifyDataChanges(): void {
    // Emit events that components can listen to
    window.dispatchEvent(new CustomEvent('mockDataUpdated', {
      detail: { timestamp: new Date().toISOString() }
    }))
  }
}
```

---

This mock data strategy ensures realistic, comprehensive, and consistent data that accurately represents the PRIMA Partner Dashboard's target market and use cases.
