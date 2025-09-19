'use client'

// Recent Bookings Table Component for PRIMA Partner Dashboard
// Based on RFC-004: Overview Dashboard

import { memo } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Eye, Calendar, Users } from 'lucide-react'
import { useVenueContext } from '@/lib/contexts/venue-context'
import type { Booking } from '@/types/data'
import { cn } from '@/lib/utils'

interface RecentBookingsTableProps {
  bookings: Booking[]
  loading?: boolean
  className?: string
}

const getStatusVariant = (status: Booking['status']) => {
  switch (status) {
    case 'CONFIRMED':
      return 'default'
    case 'PENDING':
      return 'secondary'
    case 'CANCELLED':
      return 'destructive'
    case 'NO_SHOW':
      return 'outline'
    case 'COMPLETED':
      return 'default'
    default:
      return 'secondary'
  }
}

// const getStatusColor = (status: Booking['status']) => {
//   switch (status) {
//     case 'CONFIRMED':
//       return 'text-green-600'
//     case 'PENDING':
//       return 'text-yellow-600'
//     case 'CANCELLED':
//       return 'text-red-600'
//     case 'NO_SHOW':
//       return 'text-gray-600'
//     case 'COMPLETED':
//       return 'text-blue-600'
//     default:
//       return 'text-gray-600'
//   }
// }

export const RecentBookingsTable = memo<RecentBookingsTableProps>(
  ({ bookings, loading = false, className }) => {
    const { isPortfolioView, selectedVenue } = useVenueContext()

    if (loading) {
      return (
        <Card className={cn("animate-pulse", className)}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              <div className="h-6 w-32 bg-muted rounded" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-4 w-16 bg-muted rounded" />
                  <div className="h-4 w-20 bg-muted rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Recent Bookings
            {!isPortfolioView && selectedVenue && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                • {selectedVenue.name}
              </span>
            )}
          </CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/bookings">
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent bookings</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Party Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.slice(0, 10).map((booking) => (
                  <TableRow key={booking.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{booking.guestName}</div>
                        <div className="text-sm text-muted-foreground">
                          {booking.guestEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {format(new Date(booking.bookingDate), 'MMM dd')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {booking.bookingTime}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.partySize}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(booking.status)}>
                        {booking.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={booking.type === 'PRIME' ? 'default' : 'outline'}
                        className={cn(
                          booking.type === 'PRIME' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary text-secondary-foreground'
                        )}
                      >
                        {booking.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${booking.primeTotal.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    )
  }
)

RecentBookingsTable.displayName = 'RecentBookingsTable'
