// MSW initialization component for PRIMA Partner Dashboard
// Based on RFC-002: Data Layer & State Management

'use client'

import { useEffect, useState } from 'react'
import { enableMocking } from '@/lib/msw-init'

interface MSWInitProps {
  children?: React.ReactNode
}

export function MSWInit({ children }: MSWInitProps) {
  const [mswReady, setMswReady] = useState(process.env.NODE_ENV !== 'development')

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      enableMocking()
        .then(() => {
          setMswReady(true)
        })
        .catch((error) => {
          console.error('Failed to initialize MSW:', error)
          setMswReady(true) // Continue anyway
        })
    }
  }, [])

  // Don't render children until MSW is ready in development
  if (!mswReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing mock API...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
