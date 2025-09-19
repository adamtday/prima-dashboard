// PRIMA Route Group Layout
// Based on RFC-003: Layout Shell & Multi-Venue Navigation

import { Suspense } from 'react'
import { ProtectedRoute } from '@/lib/auth/protected-route'
import { PrimaLayoutShell } from '@/components/prima/layout-shell'
import { VenueContextProvider } from '@/lib/contexts/venue-context'
import { ErrorBoundary } from '@/components/error-boundary'

interface PrimaLayoutProps {
  children: React.ReactNode
}

export default function PrimaLayout({ children }: PrimaLayoutProps) {
  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <VenueContextProvider>
          <PrimaLayoutShell>
            <Suspense fallback={
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            }>
              {children}
            </Suspense>
          </PrimaLayoutShell>
        </VenueContextProvider>
      </ErrorBoundary>
    </ProtectedRoute>
  )
}
