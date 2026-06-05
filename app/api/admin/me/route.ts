import { ADMIN_ROLE_LABELS } from '@/lib/admin-roles'
import { getAdminRoleFromRequest, verifyAdminSessionNode } from '@/lib/admin-session-sign'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  if (verifyAdminSessionNode(request) !== 'ok') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const role = getAdminRoleFromRequest(request) ?? 'full'
  return NextResponse.json({
    role,
    label: ADMIN_ROLE_LABELS[role],
  })
}
