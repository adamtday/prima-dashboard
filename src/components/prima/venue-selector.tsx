'use client'

// Venue Selector Component for PRIMA Partner Dashboard
// Based on RFC-003: Layout Shell & Multi-Venue Navigation

import { useState } from 'react'
import { Check, ChevronDown, Building2, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { useVenueContext } from '@/lib/contexts/venue-context'
import { cn } from '@/lib/utils'

export function VenueSelector() {
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
    ? { name: 'All Venues', type: 'Portfolio' }
    : selectedVenue

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[200px] justify-between"
        >
          <div className="flex items-center space-x-2">
            {isPortfolioView ? (
              <BarChart3 className="h-4 w-4" />
            ) : (
              <Building2 className="h-4 w-4" />
            )}
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">
                {currentSelection?.name}
              </span>
              {currentSelection?.type && (
                <span className="text-xs text-muted-foreground">
                  {currentSelection.type}
                </span>
              )}
            </div>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search venues..." />
          <CommandList>
            <CommandEmpty>No venues found.</CommandEmpty>
            
            {/* Portfolio view option */}
            <CommandGroup heading="Portfolio View">
              <CommandItem
                onSelect={() => {
                  selectVenue(null)
                  setOpen(false)
                }}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <div className="font-medium">All Venues</div>
                    <div className="text-xs text-muted-foreground">
                      Portfolio overview
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "h-4 w-4",
                      isPortfolioView ? "opacity-100" : "opacity-0"
                    )}
                  />
                </div>
              </CommandItem>
            </CommandGroup>
            
            <CommandSeparator />
            
            {/* Individual venues */}
            <CommandGroup heading="Individual Venues">
              {availableVenues.map((venue) => (
                <CommandItem
                  key={venue.id}
                  onSelect={() => {
                    selectVenue(venue.id)
                    setOpen(false)
                  }}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <div className="font-medium">{venue.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {venue.type} • {venue.city}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {venue.type}
                      </Badge>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedVenue?.id === venue.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
