'use client'

// Mobile Venue Selector Component for PRIMA Partner Dashboard
// Based on RFC-003: Layout Shell & Multi-Venue Navigation

import { useState } from 'react'
import { Check, Building2, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useVenueContext } from '@/lib/contexts/venue-context'

export function MobileVenueSelector() {
  const {
    selectedVenue,
    availableVenues,
    isPortfolioView,
    selectVenue,
    isLoading,
  } = useVenueContext()

  const [open, setOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 animate-pulse rounded bg-muted" />
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  const currentSelection = isPortfolioView 
    ? 'All Venues'
    : selectedVenue?.name

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="justify-start w-full">
          {isPortfolioView ? (
            <BarChart3 className="mr-2 h-4 w-4" />
          ) : (
            <Building2 className="mr-2 h-4 w-4" />
          )}
          <span className="truncate">{currentSelection}</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent side="bottom" className="max-h-[80vh]">
        <SheetHeader>
          <SheetTitle>Select Venue</SheetTitle>
        </SheetHeader>
        
        <div className="mt-4 space-y-2">
          {/* Portfolio option */}
          <Button
            variant={isPortfolioView ? "default" : "ghost"}
            className="w-full justify-start h-auto p-4"
            onClick={() => {
              selectVenue(null)
              setOpen(false)
            }}
          >
            <BarChart3 className="mr-3 h-5 w-5" />
            <div className="flex flex-1 flex-col items-start">
              <span className="font-medium">All Venues</span>
              <span className="text-xs text-muted-foreground">
                Portfolio overview
              </span>
            </div>
            {isPortfolioView && <Check className="h-4 w-4" />}
          </Button>
          
          {/* Individual venues */}
          {availableVenues.map((venue) => (
            <Button
              key={venue.id}
              variant={selectedVenue?.id === venue.id ? "default" : "ghost"}
              className="w-full justify-start h-auto p-4"
              onClick={() => {
                selectVenue(venue.id)
                setOpen(false)
              }}
            >
              <Building2 className="mr-3 h-5 w-5" />
              <div className="flex flex-1 flex-col items-start">
                <span className="font-medium">{venue.name}</span>
                <span className="text-xs text-muted-foreground">
                  {venue.type} • {venue.city}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {venue.type}
                </Badge>
                {selectedVenue?.id === venue.id && <Check className="h-4 w-4" />}
              </div>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
