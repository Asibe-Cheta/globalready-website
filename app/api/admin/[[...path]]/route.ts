import { adminApiFetch } from '@/lib/admin-api';
import { verifyAdminSessionNode, type VerifyResult } from '@/lib/admin-session-sign';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

/** Require valid admin session; returns 401 response or null if valid. Uses Node crypto so it matches login signing. */
function requireAdmin(req: NextRequest): NextResponse | null {
  const result = verifyAdminSessionNode(req);
  if (result !== 'ok') {
    const message =
      result === 'no_secret'
        ? 'Server misconfiguration. Set ADMIN_SESSION_SECRET in Vercel and redeploy.'
        : result === 'no_cookie'
          ? 'No session cookie. Log in at /admin/login from the same domain (e.g. www.globalready.tech).'
          : 'Session expired or invalid. Log out and log in again.';
    return NextResponse.json(
      { error: message, code: result },
      { status: 401 }
    );
  }
  return null;
}

/**
 * Proxy to Supabase Admin API. Forwards path and query string.
 * Session is verified here (Node) so the Cookie header is available.
 */
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  try {
    const { path: pathSegments } = await context.params;
    const path = Array.isArray(pathSegments) ? pathSegments.join('/') || '' : '';
    const authError = requireAdmin(_req);
    if (authError) return authError;
    const url = new URL(_req.url);
    const search = url.searchParams.toString();
    const res = await adminApiFetch(path, {
      method: 'GET',
      searchParams: search ? `?${search}` : undefined,
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Admin API error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  try {
    const { path: pathSegments } = await context.params;
    const path = Array.isArray(pathSegments) ? pathSegments.join('/') : '';
    const authError = requireAdmin(req);
    if (authError) return authError;
    const body = await req.json().catch(() => ({}));
    const res = await adminApiFetch(path, { method: 'POST', body });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Admin API error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  try {
    const { path: pathSegments } = await context.params;
    const path = Array.isArray(pathSegments) ? pathSegments.join('/') : '';
    const authError = requireAdmin(req);
    if (authError) return authError;
    const body = await req.json().catch(() => ({}));
    const res = await adminApiFetch(path, { method: 'PUT', body });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Admin API error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  try {
    const { path: pathSegments } = await context.params;
    const path = Array.isArray(pathSegments) ? pathSegments.join('/') : '';
    const authError = requireAdmin(req);
    if (authError) return authError;
    const body = await req.json().catch(() => ({}));
    const res = await adminApiFetch(path, { method: 'PATCH', body });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Admin API error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  try {
    const { path: pathSegments } = await context.params;
    const path = Array.isArray(pathSegments) ? pathSegments.join('/') : '';
    const authError = requireAdmin(_req);
    if (authError) return authError;
    const res = await adminApiFetch(path, { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Admin API error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
