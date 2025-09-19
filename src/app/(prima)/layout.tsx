// PRIMA Route Group Layout
// Based on RFC-001: Authentication & Base Infrastructure

import { ProtectedRoute } from '@/lib/auth/protected-route'

interface PrimaLayoutProps {
  children: React.ReactNode
}

export default function PrimaLayout({ children }: PrimaLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Temporary layout for RFC-001 - will be enhanced in RFC-003 */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-semibold text-foreground">
              PRIMA Partner Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Revenue optimization and partner management platform
            </p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
