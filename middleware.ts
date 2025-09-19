// Middleware for PRIMA Partner Dashboard
// Based on RFC-001: Authentication & Base Infrastructure

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define PRIMA protected routes
const PRIMA_ROUTES = [
  '/overview',
  '/bookings',
  '/pricing',
  '/promoters',
  '/finance',
  '/incentives',
  '/commissions',
  '/team',
  '/settings'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if accessing PRIMA routes
  const isPrimaRoute = PRIMA_ROUTES.some(route => 
    pathname.startsWith(route) || pathname.startsWith(`/prima${route}`)
  )

  if (isPrimaRoute) {
    // In a real application, this would check server-side session
    // For the demo prototype, we rely on client-side auth checks
    // This middleware serves as a placeholder for future implementation
    
    // Add security headers for PRIMA routes
    const response = NextResponse.next()
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    
    return response
  }

  // Default behavior for non-PRIMA routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
