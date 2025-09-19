// MSW handlers for PRIMA Partner Dashboard API mocking
// Based on RFC-002: Data Layer & State Management

import { http, HttpResponse } from 'msw'
import {
  mockVenues,
  mockBookings,
  mockPromoters,
  mockPricingConfigs,
  mockCommissionRates,
  mockVenueMetrics,
  mockPortfolioMetrics
} from './data'
import type {
  Booking,
  Promoter,
  PricingConfig,
  CommissionRate,
  PaginatedResponse
} from '@/types/data'

// Helper function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Helper function to create paginated response
function createPaginatedResponse<T>(
  data: T[],
  page: number = 1,
  limit: number = 10
): PaginatedResponse<T> {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedData = data.slice(startIndex, endIndex)
  
  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: data.length,
      totalPages: Math.ceil(data.length / limit)
    }
  }
}

// Helper function to find booking by ID
function findBookingById(id: string): Booking | undefined {
  return mockBookings.find(booking => booking.id === id)
}

// Helper function to find promoter by ID
function findPromoterById(id: string): Promoter | undefined {
  return mockPromoters.find(promoter => promoter.id === id)
}

// Helper function to generate weekly trends data
function generateWeeklyTrends(from: string, to: string, _venueId?: string) {
  const startDate = new Date(from)
  const endDate = new Date(to)
  const trends = []
  
  // Generate data for each day in the range
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const date = new Date(d)
    const dayOfWeek = date.getDay()
    
    // Weekend patterns (higher activity)
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const baseMultiplier = isWeekend ? 1.5 : 1.0
    
    // Add some randomness
    const randomFactor = 0.8 + Math.random() * 0.4
    
    const revenue = Math.floor((isWeekend ? 8000 : 5000) * baseMultiplier * randomFactor)
    const bookings = Math.floor((isWeekend ? 25 : 15) * baseMultiplier * randomFactor)
    const diners = Math.floor(bookings * (3.5 + Math.random() * 1.5)) // 3.5-5 diners per booking
    
    trends.push({
      date: date.toISOString().split('T')[0],
      revenue,
      bookings,
      diners,
    })
  }
  
  return trends
}

export const handlers = [
  // ===== VENUE ENDPOINTS =====
  http.get('*/api/prima/venues', async () => {
    await delay(300)
    return HttpResponse.json(mockVenues)
  }),

  http.get('*/api/prima/venues/:id', async ({ params }) => {
    await delay(200)
    const venue = mockVenues.find(v => v.id === params.id)
    
    if (!venue) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json(venue)
  }),

  // ===== BOOKING ENDPOINTS =====
  http.get('*/api/prima/bookings', async ({ request }) => {
    await delay(400)
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const status = url.searchParams.getAll('status')
    const type = url.searchParams.getAll('type')
    const venueId = url.searchParams.get('venueId')
    const promoterId = url.searchParams.get('promoterId')
    const search = url.searchParams.get('search')
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')

    let filteredBookings = [...mockBookings]

    // Apply filters
    if (status.length > 0) {
      filteredBookings = filteredBookings.filter(booking => status.includes(booking.status))
    }
    
    if (type.length > 0) {
      filteredBookings = filteredBookings.filter(booking => type.includes(booking.type))
    }
    
    if (venueId) {
      filteredBookings = filteredBookings.filter(booking => booking.venueId === venueId)
    }
    
    if (promoterId) {
      filteredBookings = filteredBookings.filter(booking => booking.promoterId === promoterId)
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      filteredBookings = filteredBookings.filter(booking =>
        booking.guestName.toLowerCase().includes(searchLower) ||
        booking.guestEmail.toLowerCase().includes(searchLower)
      )
    }
    
    if (from && to) {
      filteredBookings = filteredBookings.filter(booking => {
        const bookingDate = new Date(booking.bookingDate)
        const fromDate = new Date(from)
        const toDate = new Date(to)
        return bookingDate >= fromDate && bookingDate <= toDate
      })
    }

    return HttpResponse.json(createPaginatedResponse(filteredBookings, page, limit))
  }),

  http.get('*/api/prima/bookings/:id', async ({ params }) => {
    await delay(200)
    const booking = findBookingById(params.id as string)
    
    if (!booking) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json(booking)
  }),

  http.patch('*/api/prima/bookings/:id/status', async ({ params, request }) => {
    await delay(500)
    const { status } = await request.json() as { status: Booking['status'] }
    const booking = findBookingById(params.id as string)
    
    if (!booking) {
      return new HttpResponse(null, { status: 404 })
    }
    
    // Update booking status
    booking.status = status
    booking.updatedAt = new Date().toISOString()
    
    return HttpResponse.json(booking)
  }),

  // ===== PROMOTER ENDPOINTS =====
  http.get('*/api/prima/promoters', async ({ request }) => {
    await delay(350)
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const tier = url.searchParams.getAll('tier')
    const status = url.searchParams.getAll('status')
    const venueId = url.searchParams.get('venueId')
    const search = url.searchParams.get('search')

    let filteredPromoters = [...mockPromoters]

    // Apply filters
    if (tier.length > 0) {
      filteredPromoters = filteredPromoters.filter(promoter => tier.includes(promoter.tier))
    }
    
    if (status.length > 0) {
      filteredPromoters = filteredPromoters.filter(promoter => status.includes(promoter.status))
    }
    
    if (venueId) {
      filteredPromoters = filteredPromoters.filter(promoter => 
        promoter.venueAccess.includes(venueId)
      )
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      filteredPromoters = filteredPromoters.filter(promoter =>
        promoter.firstName.toLowerCase().includes(searchLower) ||
        promoter.lastName.toLowerCase().includes(searchLower) ||
        promoter.email.toLowerCase().includes(searchLower)
      )
    }

    return HttpResponse.json(createPaginatedResponse(filteredPromoters, page, limit))
  }),

  http.get('*/api/prima/promoters/:id', async ({ params }) => {
    await delay(200)
    const promoter = findPromoterById(params.id as string)
    
    if (!promoter) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json(promoter)
  }),

  http.patch('*/api/prima/promoters/:id/tier', async ({ params, request }) => {
    await delay(400)
    const { tier } = await request.json() as { tier: Promoter['tier'] }
    const promoter = findPromoterById(params.id as string)
    
    if (!promoter) {
      return new HttpResponse(null, { status: 404 })
    }
    
    // Update promoter tier
    promoter.tier = tier
    promoter.updatedAt = new Date().toISOString()
    
    return HttpResponse.json(promoter)
  }),

  // ===== PRICING ENDPOINTS =====
  http.get('*/api/prima/pricing/:venueId', async ({ params }) => {
    await delay(250)
    const config = mockPricingConfigs.find(c => c.venueId === params.venueId)
    
    if (!config) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json(config)
  }),

  http.put('*/api/prima/pricing/:venueId', async ({ params, request }) => {
    await delay(600)
    const updates = await request.json() as Partial<PricingConfig>
    const existingConfig = mockPricingConfigs.find(c => c.venueId === params.venueId)
    
    if (!existingConfig) {
      return new HttpResponse(null, { status: 404 })
    }
    
    // Update pricing config
    const updatedConfig = {
      ...existingConfig,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    const index = mockPricingConfigs.findIndex(c => c.venueId === params.venueId)
    mockPricingConfigs[index] = updatedConfig
    
    return HttpResponse.json(updatedConfig)
  }),

  // ===== METRICS ENDPOINTS =====
  http.get('*/api/prima/metrics/venues/:venueId', async ({ params, request }) => {
    await delay(300)
    const url = new URL(request.url)
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')
    
    const metrics = mockVenueMetrics[params.venueId as string]
    
    if (!metrics) {
      return new HttpResponse(null, { status: 404 })
    }
    
    // Update period if provided
    if (from && to) {
      metrics.period = { from, to }
    }
    
    return HttpResponse.json(metrics)
  }),

  http.get('*/api/prima/metrics/portfolio', async ({ request }) => {
    await delay(400)
    const url = new URL(request.url)
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')
    const venueIds = url.searchParams.getAll('venueIds')
    
    const metrics = { ...mockPortfolioMetrics }
    
    // Update period if provided
    if (from && to) {
      metrics.period = { from, to }
    }
    
    // Filter by venue IDs if provided
    if (venueIds.length > 0) {
      metrics.venueBreakdown = metrics.venueBreakdown.filter(v => 
        venueIds.includes(v.venueId)
      )
    }
    
    return HttpResponse.json(metrics)
  }),

  // Weekly trends endpoint
  http.get('*/api/prima/metrics/trends', async ({ request }) => {
    await delay(400)
    const url = new URL(request.url)
    const from = url.searchParams.get('from') || '2024-09-01T00:00:00Z'
    const to = url.searchParams.get('to') || '2024-09-18T23:59:59Z'
    const venueId = url.searchParams.get('venueId')
    
    // Generate mock weekly trends data
    const trends = generateWeeklyTrends(from, to, venueId || undefined)
    
    return HttpResponse.json(trends)
  }),

  // Recent bookings endpoint
  http.get('*/api/prima/bookings/recent', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const venueId = url.searchParams.get('venueId')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    
    let recentBookings = [...mockBookings]
    
    if (venueId) {
      recentBookings = recentBookings.filter(booking => booking.venueId === venueId)
    }
    
    // Sort by creation date (most recent first) and limit
    recentBookings = recentBookings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
    
    return HttpResponse.json(recentBookings)
  }),

  // ===== COMMISSION ENDPOINTS =====
  http.get('*/api/prima/commissions/rates', async () => {
    await delay(200)
    return HttpResponse.json(mockCommissionRates)
  }),

  http.patch('*/api/prima/commissions/rates/:id', async ({ params, request }) => {
    await delay(400)
    const updates = await request.json() as Partial<CommissionRate>
    const existingRate = mockCommissionRates.find(r => r.id === params.id)
    
    if (!existingRate) {
      return new HttpResponse(null, { status: 404 })
    }
    
    // Update commission rate
    const updatedRate = {
      ...existingRate,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    const index = mockCommissionRates.findIndex(r => r.id === params.id)
    mockCommissionRates[index] = updatedRate
    
    return HttpResponse.json(updatedRate)
  }),

  // ===== TRANSACTION ENDPOINTS =====
  http.get('*/api/prima/transactions', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const promoterId = url.searchParams.get('promoterId')
    const venueId = url.searchParams.get('venueId')
    
    // Mock transactions based on bookings
    const transactions = mockBookings.map(booking => ({
      id: `transaction-${booking.id}`,
      venueId: booking.venueId,
      promoterId: booking.promoterId,
      bookingId: booking.id,
      type: 'COMMISSION' as const,
      amount: booking.commissionAmount,
      status: 'COMPLETED' as const,
      description: `Commission for booking ${booking.id}`,
      processedDate: booking.createdAt,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    }))
    
    let filteredTransactions = transactions
    
    if (promoterId) {
      filteredTransactions = filteredTransactions.filter(t => t.promoterId === promoterId)
    }
    
    if (venueId) {
      filteredTransactions = filteredTransactions.filter(t => t.venueId === venueId)
    }
    
    return HttpResponse.json(createPaginatedResponse(filteredTransactions, page, limit))
  }),

  // ===== PAYOUT ENDPOINTS =====
  http.get('*/api/prima/payouts', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const promoterId = url.searchParams.get('promoterId')
    const status = url.searchParams.get('status')
    
    // Mock payouts based on promoters
    const payouts = mockPromoters.map(promoter => ({
      id: `payout-${promoter.id}`,
      promoterId: promoter.id,
      amount: Math.floor(promoter.totalRevenue * 0.8), // 80% of revenue
      status: 'PENDING' as const,
      scheduledDate: '2024-09-25T00:00:00Z',
      createdAt: '2024-09-18T00:00:00Z',
      updatedAt: '2024-09-18T00:00:00Z'
    }))
    
    let filteredPayouts = payouts
    
    if (promoterId) {
      filteredPayouts = filteredPayouts.filter(p => p.promoterId === promoterId)
    }
    
    if (status) {
      filteredPayouts = filteredPayouts.filter(p => p.status === status)
    }
    
    return HttpResponse.json(createPaginatedResponse(filteredPayouts, page, limit))
  }),

  // ===== INCENTIVE ENDPOINTS =====
  http.get('*/api/prima/incentives', async () => {
    await delay(250)
    // Mock incentives
    const incentives = [
      {
        id: 'incentive-1',
        name: 'September Booking Blitz',
        description: 'Extra commission for 20+ bookings this month',
        type: 'BOOKING_TARGET' as const,
        targetValue: 20,
        rewardAmount: 500,
        startDate: '2024-09-01T00:00:00Z',
        endDate: '2024-09-30T23:59:59Z',
        status: 'ACTIVE' as const,
        promoterIds: mockPromoters.map(p => p.id),
        venueIds: mockVenues.map(v => v.id),
        currentProgress: 15,
        createdAt: '2024-09-01T00:00:00Z',
        updatedAt: '2024-09-18T15:30:00Z'
      }
    ]
    
    return HttpResponse.json(incentives)
  }),

  http.post('*/api/prima/incentives', async ({ request }) => {
    await delay(500)
    const incentive = await request.json()
    
    // Add generated fields
    const newIncentive = {
      ...(incentive as Record<string, unknown>),
      id: `incentive-${Date.now()}`,
      currentProgress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return HttpResponse.json(newIncentive, { status: 201 })
  })
]
