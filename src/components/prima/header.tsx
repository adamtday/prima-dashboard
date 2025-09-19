'use client'

// PRIMA Header Component for PRIMA Partner Dashboard
// Based on RFC-003: Layout Shell & Multi-Venue Navigation

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { VenueSelector } from './venue-selector'
import { ThemeSwitch } from '@/components/theme-switch'
import { NavUser } from '@/components/layout/nav-user'
export function PrimaHeader() {
  // Venue context available for future use
  // const { isPortfolioView, availableVenues } = useVenueContext()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      
      {/* Venue selector - prominently displayed */}
      <VenueSelector />
      
      <div className="ml-auto flex items-center gap-2">
        {/* Theme toggle */}
        <ThemeSwitch />
        
        {/* User profile */}
        <NavUser user={{
          name: "Demo User",
          email: "demo@primavenues.com",
          avatar: "/avatars/default.png"
        }} />
      </div>
    </header>
  )
}
