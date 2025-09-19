'use client'

// KPI Card Component for PRIMA Partner Dashboard
// Based on RFC-004: Overview Dashboard

import { memo, forwardRef } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: number | string
  change?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
    period: string
  }
  format?: 'currency' | 'number' | 'percentage'
  onDrillThrough?: () => void
  className?: string
  loading?: boolean
}

export const KPICard = memo(forwardRef<HTMLDivElement, KPICardProps>(
  ({ title, value, change, format = 'number', onDrillThrough, className, loading = false }, ref) => {
    const formatValue = (val: number | string) => {
      if (typeof val === 'string') return val
      
      switch (format) {
        case 'currency':
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(val)
        case 'percentage':
          return `${val.toFixed(1)}%`
        case 'number':
        default:
          return new Intl.NumberFormat('en-US').format(val)
      }
    }

    const getTrendIcon = (type: 'increase' | 'decrease' | 'neutral') => {
      switch (type) {
        case 'increase':
          return <TrendingUp className="h-4 w-4 text-green-600" />
        case 'decrease':
          return <TrendingDown className="h-4 w-4 text-red-600" />
        case 'neutral':
          return <Minus className="h-4 w-4 text-gray-500" />
      }
    }

    const getTrendColor = (type: 'increase' | 'decrease' | 'neutral') => {
      switch (type) {
        case 'increase':
          return 'text-green-600'
        case 'decrease':
          return 'text-red-600'
        case 'neutral':
          return 'text-gray-500'
      }
    }

    if (loading) {
      return (
        <Card ref={ref} className={cn("animate-pulse", className)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="h-4 w-24 bg-muted rounded" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-8 w-32 bg-muted rounded mb-2" />
            <div className="h-3 w-16 bg-muted rounded" />
          </CardContent>
        </Card>
      )
    }

    return (
      <Card
        ref={ref}
        className={cn(
          "transition-all duration-200 hover:shadow-md",
          onDrillThrough && "cursor-pointer hover:bg-muted/50",
          className
        )}
        onClick={onDrillThrough}
        role={onDrillThrough ? 'button' : undefined}
        tabIndex={onDrillThrough ? 0 : undefined}
        onKeyDown={(e) => {
          if (onDrillThrough && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            onDrillThrough()
          }
        }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {change && (
            <Badge
              variant={change.type === 'increase' ? 'default' : change.type === 'decrease' ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {getTrendIcon(change.type)}
              <span className="ml-1">
                {change.type === 'increase' ? '+' : change.type === 'decrease' ? '-' : ''}
                {Math.abs(change.value).toFixed(1)}%
              </span>
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatValue(value)}
          </div>
          {change && (
            <p className={cn("text-xs mt-1", getTrendColor(change.type))}>
              {change.type === 'increase' ? '+' : change.type === 'decrease' ? '-' : ''}
              {Math.abs(change.value).toFixed(1)}% from {change.period}
            </p>
          )}
        </CardContent>
      </Card>
    )
  }
))

KPICard.displayName = 'KPICard'
