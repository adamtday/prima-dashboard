'use client'

// Weekly Trends Chart Component for PRIMA Partner Dashboard
// Based on RFC-004: Overview Dashboard

import { memo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useVenueContext } from '@/lib/contexts/venue-context'
import { cn } from '@/lib/utils'

interface WeeklyTrendsData {
  date: string
  revenue: number
  bookings: number
  diners: number
}

interface WeeklyTrendsChartProps {
  data: WeeklyTrendsData[]
  loading?: boolean
  className?: string
}

export const WeeklyTrendsChart = memo<WeeklyTrendsChartProps>(
  ({ data, loading = false, className }) => {
    const { isPortfolioView, selectedVenue } = useVenueContext()

    const formatTooltipValue = (value: number, name: string) => {
      switch (name) {
        case 'revenue':
          return [`$${value.toLocaleString()}`, 'Revenue']
        case 'bookings':
          return [value.toLocaleString(), 'Bookings']
        case 'diners':
          return [value.toLocaleString(), 'Diners']
        default:
          return [value, name]
      }
    }

    const formatXAxisLabel = (tickItem: string) => {
      const date = new Date(tickItem)
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }

    if (loading) {
      return (
        <Card className={cn("animate-pulse", className)}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              <div className="h-6 w-32 bg-muted rounded" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full bg-muted rounded" />
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Weekly Trends
            {!isPortfolioView && selectedVenue && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                • {selectedVenue.name}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxisLabel}
                  className="text-xs"
                />
                <YAxis 
                  yAxisId="left"
                  className="text-xs"
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  className="text-xs"
                />
                <Tooltip 
                  formatter={formatTooltipValue}
                  labelFormatter={(label) => {
                    const date = new Date(label)
                    return date.toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric' 
                    })
                  }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="bookings"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="diners"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-3))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )
  }
)

WeeklyTrendsChart.displayName = 'WeeklyTrendsChart'
