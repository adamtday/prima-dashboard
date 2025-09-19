'use client'

// PRIMA Breadcrumb Component for PRIMA Partner Dashboard
// Based on RFC-003: Layout Shell & Multi-Venue Navigation

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { useVenueContext } from '@/lib/contexts/venue-context'

const routeLabels: Record<string, string> = {
  '/overview': 'Overview',
  '/bookings': 'Bookings',
  '/pricing': 'Pricing',
  '/promoters': 'Promoters',
  '/finance': 'Finance',
  '/incentives': 'Incentives',
  '/commissions': 'Commissions',
  '/team': 'Team',
  '/settings': 'Settings',
}

export function PrimaBreadcrumb() {
  const pathname = usePathname()
  const { selectedVenue, isPortfolioView } = useVenueContext()

  // Get the current page label
  const currentPage = routeLabels[pathname] || 'Dashboard'

  return (
    <nav className="flex items-center space-x-1 px-4 py-2 text-sm text-muted-foreground">
      <Link 
        href="/overview" 
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="ml-1">PRIMA</span>
      </Link>
      
      <ChevronRight className="h-4 w-4" />
      
      <span className="text-foreground font-medium">
        {currentPage}
      </span>
      
      {!isPortfolioView && selectedVenue && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="text-muted-foreground">
            {selectedVenue.name}
          </span>
        </>
      )}
    </nav>
  )
}
