'use client'

// Overview Dashboard Page for PRIMA Partner Dashboard
// Based on RFC-004: Overview Dashboard

import { useMemo } from 'react'
import { subDays, startOfDay, endOfDay } from 'date-fns'
import { KPICard } from '@/components/prima/kpi-card'
import { WeeklyTrendsChart } from '@/components/prima/weekly-trends-chart'
import { RecentBookingsTable } from '@/components/prima/recent-bookings-table'
import { useVenueContext } from '@/lib/contexts/venue-context'
import { 
  useGetPortfolioMetricsQuery, 
  useGetWeeklyTrendsQuery, 
  useGetRecentBookingsQuery 
} from '@/lib/store/api'
import { useRouter } from 'next/navigation'

export default function OverviewPage() {
  const router = useRouter()
  const { selectedVenueId, isPortfolioView } = useVenueContext()
  
  // Calculate date range for the last 7 days
  const dateRange = useMemo(() => {
    const to = endOfDay(new Date())
    const from = startOfDay(subDays(to, 7))
    return {
      from: from.toISOString(),
      to: to.toISOString(),
    }
  }, [])

  // Fetch data based on venue context
  const { data: portfolioMetrics, isLoading: metricsLoading } = useGetPortfolioMetricsQuery({
    from: dateRange.from,
    to: dateRange.to,
    venueIds: isPortfolioView ? undefined : selectedVenueId ? [selectedVenueId] : undefined
  })

  const { data: trendsData, isLoading: trendsLoading } = useGetWeeklyTrendsQuery({
    venueId: isPortfolioView ? undefined : selectedVenueId || undefined,
    from: dateRange.from,
    to: dateRange.to,
  })

  const { data: recentBookings, isLoading: bookingsLoading } = useGetRecentBookingsQuery({
    venueId: isPortfolioView ? undefined : selectedVenueId || undefined,
    limit: 10
  })

  // KPI data with drill-through handlers
  const kpiData = useMemo(() => {
    if (!portfolioMetrics) return []
    
    const getChangeType = (value: number): 'increase' | 'decrease' | 'neutral' => {
      if (value > 0) return 'increase'
      if (value < 0) return 'decrease'
      return 'neutral'
    }
    
    return [
      {
        title: 'Total Revenue',
        value: portfolioMetrics.totalRevenue,
        change: {
          value: portfolioMetrics.revenueChange,
          type: getChangeType(portfolioMetrics.revenueChange),
          period: 'vs last week'
        },
        format: 'currency' as const,
        onDrillThrough: () => router.push('/finance')
      },
      {
        title: 'Total Bookings',
        value: portfolioMetrics.totalBookings,
        change: {
          value: portfolioMetrics.bookingsChange,
          type: getChangeType(portfolioMetrics.bookingsChange),
          period: 'vs last week'
        },
        format: 'number' as const,
        onDrillThrough: () => router.push('/bookings')
      },
      {
        title: 'Total Diners',
        value: portfolioMetrics.totalDiners,
        change: {
          value: portfolioMetrics.dinersChange,
          type: getChangeType(portfolioMetrics.dinersChange),
          period: 'vs last week'
        },
        format: 'number' as const,
        onDrillThrough: () => router.push('/bookings')
      },
      {
        title: 'Average Booking Value',
        value: portfolioMetrics.averageBookingValue,
        change: {
          value: portfolioMetrics.avgBookingValueChange,
          type: getChangeType(portfolioMetrics.avgBookingValueChange),
          period: 'vs last week'
        },
        format: 'currency' as const,
        onDrillThrough: () => router.push('/pricing')
      }
    ]
  }, [portfolioMetrics, router])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isPortfolioView ? 'Portfolio Overview' : 'Venue Overview'}
        </h1>
        <p className="text-muted-foreground">
          {isPortfolioView 
            ? 'Monitor performance across all your venues'
            : 'Track key metrics and recent activity for this venue'
          }
        </p>
      </div>
      
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            format={kpi.format}
            onDrillThrough={kpi.onDrillThrough}
            loading={metricsLoading}
          />
        ))}
      </div>
      
      {/* Charts and Tables */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Weekly Trends Chart */}
        <div className="col-span-4">
          <WeeklyTrendsChart 
            data={trendsData || []} 
            loading={trendsLoading}
          />
        </div>
        
        {/* Recent Bookings Table */}
        <div className="col-span-3">
          <RecentBookingsTable 
            bookings={recentBookings || []} 
            loading={bookingsLoading}
          />
        </div>
      </div>
    </div>
  )
}