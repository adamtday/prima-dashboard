// Test API endpoint to verify MSW is working
// This is a temporary endpoint for testing purposes

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'API is working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
}
