import { NextResponse } from 'next/server'

/**
 * Public health check — no middleware. Use to verify API routes work on your domain.
 * GET https://your-domain/api/health
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'API is reachable. If you see this, serverless routes work on this domain.',
    timestamp: new Date().toISOString(),
  })
}
