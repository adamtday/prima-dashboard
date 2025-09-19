'use client'

// Venue Context Provider for PRIMA Partner Dashboard
// Based on RFC-003: Layout Shell & Multi-Venue Navigation

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { useGetVenuesQuery } from '@/lib/store/api'
import type { Venue } from '@/types/data'

interface VenueContextType {
  // Current venue selection
  selectedVenue: Venue | null
  selectedVenueId: string | null
  
  // All venues user has access to
  availableVenues: Venue[]
  
  // Portfolio mode (all venues)
  isPortfolioView: boolean
  
  // Actions
  selectVenue: (venueId: string | null) => void
  togglePortfolioView: () => void
  
  // State
  isLoading: boolean
  error: string | null
}

const VenueContext = createContext<VenueContextType | undefined>(undefined)

export function VenueContextProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null)
  const [isPortfolioView, setIsPortfolioView] = useState(true)
  
  const { 
    data: venues = [], 
    isLoading, 
    error 
  } = useGetVenuesQuery(undefined, {
    skip: !user?.id
  })

  // Initialize venue selection
  useEffect(() => {
    if (venues.length > 0 && !selectedVenueId) {
      // Check for stored preference or URL parameter
      const storedVenueId = localStorage.getItem('prima_selected_venue')
      const urlVenueId = new URLSearchParams(window.location.search).get('venue')
      
      if (urlVenueId && venues.find(v => v.id === urlVenueId)) {
        setSelectedVenueId(urlVenueId)
        setIsPortfolioView(false)
      } else if (storedVenueId && venues.find(v => v.id === storedVenueId)) {
        setSelectedVenueId(storedVenueId)
        setIsPortfolioView(false)
      } else if (venues.length === 1) {
        // Single venue - auto-select
        setSelectedVenueId(venues[0].id)
        setIsPortfolioView(false)
      }
      // Multiple venues - start in portfolio view
    }
  }, [venues, selectedVenueId])

  const selectVenue = useCallback((venueId: string | null) => {
    if (venueId === null) {
      // Portfolio view
      setSelectedVenueId(null)
      setIsPortfolioView(true)
      localStorage.removeItem('prima_selected_venue')
    } else {
      setSelectedVenueId(venueId)
      setIsPortfolioView(false)
      localStorage.setItem('prima_selected_venue', venueId)
    }
    
    // Update URL without navigation
    const url = new URL(window.location.href)
    if (venueId) {
      url.searchParams.set('venue', venueId)
    } else {
      url.searchParams.delete('venue')
    }
    window.history.replaceState({}, '', url.toString())
  }, [])

  const togglePortfolioView = useCallback(() => {
    if (isPortfolioView) {
      // Switch to first venue
      if (venues.length > 0) {
        selectVenue(venues[0].id)
      }
    } else {
      // Switch to portfolio view
      selectVenue(null)
    }
  }, [isPortfolioView, venues, selectVenue])

  const selectedVenue = selectedVenueId 
    ? venues.find(v => v.id === selectedVenueId) || null
    : null

  return (
    <VenueContext.Provider value={{
      selectedVenue,
      selectedVenueId,
      availableVenues: venues,
      isPortfolioView,
      selectVenue,
      togglePortfolioView,
      isLoading,
      error: error ? 'Failed to load venues' : null,
    }}>
      {children}
    </VenueContext.Provider>
  )
}

export const useVenueContext = () => {
  const context = useContext(VenueContext)
  if (context === undefined) {
    throw new Error('useVenueContext must be used within a VenueContextProvider')
  }
  return context
}
