// Temporary API route for testing data flow
// This will be replaced by MSW in production

import { NextResponse } from 'next/server'
import { mockPortfolioMetrics } from '@/mocks/data'

export async function GET(request: Request) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400))
  
  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  
  // Return mock data with updated period if provided
  const metrics = {
    ...mockPortfolioMetrics,
    period: from && to ? { from, to } : mockPortfolioMetrics.period
  }
  
  return NextResponse.json(metrics)
}
