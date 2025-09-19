// Temporary API route for testing data flow
// This will be replaced by MSW in production

import { NextResponse } from 'next/server'
import { mockVenues } from '@/mocks/data'

export async function GET() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return NextResponse.json(mockVenues)
}
