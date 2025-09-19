'use client'

// PRIMA Layout Shell Component for PRIMA Partner Dashboard
// Based on RFC-003: Layout Shell & Multi-Venue Navigation

import { useState } from 'react'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { PrimaHeader } from './header'
import { PrimaBreadcrumb } from './breadcrumb'

interface PrimaLayoutShellProps {
  children: React.ReactNode
}

export function PrimaLayoutShell({ children }: PrimaLayoutShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          {/* Header with venue selector and controls */}
          <PrimaHeader />
          
          {/* Breadcrumb navigation */}
          <PrimaBreadcrumb />
          
          {/* Main content area */}
          <main className="flex-1 p-4 md:p-6">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
