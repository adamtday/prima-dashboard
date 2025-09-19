// RTK Query API configuration for PRIMA Partner Dashboard
// Based on RFC-002: Data Layer & State Management

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from './store'
import type {
  Venue,
  Booking,
  Promoter,
  PricingConfig,
  Transaction,
  Payout,
  Incentive,
  CommissionRate,
  BookingFilters,
  PromoterFilters,
  VenueMetrics,
  PromoterMetrics,
  PortfolioMetrics,
  PaginatedResponse
} from '@/types/data'

// Base API configuration
export const primaApi = createApi({
  reducerPath: 'primaApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/prima',
    prepareHeaders: (headers, { getState }) => {
      // Add auth token if available
      const state = getState() as RootState
      const user = state.auth?.user
      
      if (user) {
        headers.set('authorization', `Bearer ${user.id}`)
      }
      
      headers.set('content-type', 'application/json')
      return headers
    },
  }),
  tagTypes: [
    'Venue',
    'Booking', 
    'Promoter',
    'Pricing',
    'Transaction',
    'Payout',
    'Incentive',
    'Commission',
    'Metrics'
  ],
  endpoints: (builder) => ({
    // ===== VENUE ENDPOINTS =====
    getVenues: builder.query<Venue[], void>({
      query: () => 'venues',
      providesTags: ['Venue']
    }),
    
    getVenue: builder.query<Venue, string>({
      query: (id) => `venues/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Venue', id }]
    }),

    // ===== BOOKING ENDPOINTS =====
    getBookings: builder.query<PaginatedResponse<Booking>, BookingFilters & { page?: number; limit?: number }>({
      query: (params) => {
        const searchParams = new URLSearchParams()
        
        if (params.status) {
          params.status.forEach(status => searchParams.append('status', status))
        }
        if (params.type) {
          params.type.forEach(type => searchParams.append('type', type))
        }
        if (params.venueId) searchParams.set('venueId', params.venueId)
        if (params.promoterId) searchParams.set('promoterId', params.promoterId)
        if (params.dateRange) {
          searchParams.set('from', params.dateRange.from)
          searchParams.set('to', params.dateRange.to)
        }
        if (params.search) searchParams.set('search', params.search)
        if (params.page) searchParams.set('page', params.page.toString())
        if (params.limit) searchParams.set('limit', params.limit.toString())
        
        return `bookings?${searchParams.toString()}`
      },
      providesTags: ['Booking']
    }),

    getBooking: builder.query<Booking, string>({
      query: (id) => `bookings/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Booking', id }]
    }),

    updateBookingStatus: builder.mutation<Booking, { id: string; status: Booking['status'] }>({
      query: ({ id, status }) => ({
        url: `bookings/${id}/status`,
        method: 'PATCH',
        body: { status }
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Booking', id },
        'Booking',
        'Metrics'
      ],
      // Optimistic update
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          primaApi.util.updateQueryData('getBooking', id, (draft) => {
            if (draft) {
              draft.status = status
              draft.updatedAt = new Date().toISOString()
            }
          })
        )
        
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      }
    }),

    // ===== PROMOTER ENDPOINTS =====
    getPromoters: builder.query<PaginatedResponse<Promoter>, PromoterFilters & { page?: number; limit?: number }>({
      query: (params) => {
        const searchParams = new URLSearchParams()
        
        if (params.tier) {
          params.tier.forEach(tier => searchParams.append('tier', tier))
        }
        if (params.status) {
          params.status.forEach(status => searchParams.append('status', status))
        }
        if (params.venueId) searchParams.set('venueId', params.venueId)
        if (params.search) searchParams.set('search', params.search)
        if (params.page) searchParams.set('page', params.page.toString())
        if (params.limit) searchParams.set('limit', params.limit.toString())
        
        return `promoters?${searchParams.toString()}`
      },
      providesTags: ['Promoter']
    }),

    getPromoter: builder.query<Promoter, string>({
      query: (id) => `promoters/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Promoter', id }]
    }),

    updatePromoterTier: builder.mutation<Promoter, { id: string; tier: Promoter['tier'] }>({
      query: ({ id, tier }) => ({
        url: `promoters/${id}/tier`,
        method: 'PATCH',
        body: { tier }
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Promoter', id },
        'Promoter'
      ]
    }),

    // ===== PRICING ENDPOINTS =====
    getPricingConfig: builder.query<PricingConfig, string>({
      query: (venueId) => `pricing/${venueId}`,
      providesTags: (_result, _error, venueId) => [{ type: 'Pricing', id: venueId }]
    }),

    updatePricingConfig: builder.mutation<PricingConfig, { venueId: string; config: Partial<PricingConfig> }>({
      query: ({ venueId, config }) => ({
        url: `pricing/${venueId}`,
        method: 'PUT',
        body: config
      }),
      invalidatesTags: (_result, _error, { venueId }) => [
        { type: 'Pricing', id: venueId },
        'Pricing'
      ]
    }),

    // ===== METRICS ENDPOINTS =====
    getVenueMetrics: builder.query<VenueMetrics, { venueId: string; from: string; to: string }>({
      query: ({ venueId, from, to }) => `metrics/venues/${venueId}?from=${from}&to=${to}`,
      providesTags: (_result, _error, { venueId }) => [{ type: 'Metrics', id: `venue-${venueId}` }]
    }),

    getPromoterMetrics: builder.query<PromoterMetrics, { promoterId: string; from: string; to: string }>({
      query: ({ promoterId, from, to }) => `metrics/promoters/${promoterId}?from=${from}&to=${to}`,
      providesTags: (_result, _error, { promoterId }) => [{ type: 'Metrics', id: `promoter-${promoterId}` }]
    }),

    getPortfolioMetrics: builder.query<PortfolioMetrics, { from: string; to: string; venueIds?: string[] }>({
      query: ({ from, to, venueIds }) => {
        const params = new URLSearchParams({ from, to })
        if (venueIds) {
          venueIds.forEach(id => params.append('venueIds', id))
        }
        return `metrics/portfolio?${params.toString()}`
      },
      providesTags: ['Metrics']
    }),

    getWeeklyTrends: builder.query<Array<{
      date: string
      revenue: number
      bookings: number
      diners: number
    }>, { venueId?: string; from: string; to: string }>({
      query: ({ venueId, from, to }) => {
        const params = new URLSearchParams({ from, to })
        if (venueId) params.set('venueId', venueId)
        return `metrics/trends?${params.toString()}`
      },
      providesTags: ['Metrics']
    }),

    getRecentBookings: builder.query<Booking[], { venueId?: string; limit?: number }>({
      query: ({ venueId, limit = 10 }) => {
        const params = new URLSearchParams({ limit: limit.toString() })
        if (venueId) params.set('venueId', venueId)
        return `bookings/recent?${params.toString()}`
      },
      providesTags: ['Booking']
    }),

    // ===== FINANCIAL ENDPOINTS =====
    getTransactions: builder.query<PaginatedResponse<Transaction>, { promoterId?: string; venueId?: string; page?: number; limit?: number }>({
      query: (params) => {
        const searchParams = new URLSearchParams()
        if (params.promoterId) searchParams.set('promoterId', params.promoterId)
        if (params.venueId) searchParams.set('venueId', params.venueId)
        if (params.page) searchParams.set('page', params.page.toString())
        if (params.limit) searchParams.set('limit', params.limit.toString())
        
        return `transactions?${searchParams.toString()}`
      },
      providesTags: ['Transaction']
    }),

    getPayouts: builder.query<PaginatedResponse<Payout>, { promoterId?: string; status?: Payout['status']; page?: number; limit?: number }>({
      query: (params) => {
        const searchParams = new URLSearchParams()
        if (params.promoterId) searchParams.set('promoterId', params.promoterId)
        if (params.status) searchParams.set('status', params.status)
        if (params.page) searchParams.set('page', params.page.toString())
        if (params.limit) searchParams.set('limit', params.limit.toString())
        
        return `payouts?${searchParams.toString()}`
      },
      providesTags: ['Payout']
    }),

    // ===== INCENTIVE ENDPOINTS =====
    getIncentives: builder.query<Incentive[], void>({
      query: () => 'incentives',
      providesTags: ['Incentive']
    }),

    createIncentive: builder.mutation<Incentive, Omit<Incentive, 'id' | 'createdAt' | 'updatedAt' | 'currentProgress'>>({
      query: (incentive) => ({
        url: 'incentives',
        method: 'POST',
        body: incentive
      }),
      invalidatesTags: ['Incentive']
    }),

    // ===== COMMISSION ENDPOINTS =====
    getCommissionRates: builder.query<CommissionRate[], void>({
      query: () => 'commissions/rates',
      providesTags: ['Commission']
    }),

    updateCommissionRate: builder.mutation<CommissionRate, { id: string; rate: Partial<CommissionRate> }>({
      query: ({ id, rate }) => ({
        url: `commissions/rates/${id}`,
        method: 'PATCH',
        body: rate
      }),
      invalidatesTags: ['Commission']
    })
  })
})

// Export hooks for use in components
export const {
  // Venue hooks
  useGetVenuesQuery,
  useGetVenueQuery,
  
  // Booking hooks
  useGetBookingsQuery,
  useGetBookingQuery,
  useUpdateBookingStatusMutation,
  
  // Promoter hooks
  useGetPromotersQuery,
  useGetPromoterQuery,
  useUpdatePromoterTierMutation,
  
  // Pricing hooks
  useGetPricingConfigQuery,
  useUpdatePricingConfigMutation,
  
  // Metrics hooks
  useGetVenueMetricsQuery,
  useGetPromoterMetricsQuery,
  useGetPortfolioMetricsQuery,
  useGetWeeklyTrendsQuery,
  useGetRecentBookingsQuery,
  
  // Financial hooks
  useGetTransactionsQuery,
  useGetPayoutsQuery,
  
  // Incentive hooks
  useGetIncentivesQuery,
  useCreateIncentiveMutation,
  
  // Commission hooks
  useGetCommissionRatesQuery,
  useUpdateCommissionRateMutation
} = primaApi
