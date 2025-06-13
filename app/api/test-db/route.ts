import { NextResponse } from 'next/server'
import { testConnection } from '@/lib/db'

export async function GET() {
  try {
    const result = await testConnection()
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Database connection successful',
        timestamp: result.timestamp 
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to connect to database',
          details: result.error
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to connect to database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 