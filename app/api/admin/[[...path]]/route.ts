import { adminApiFetch } from '@/lib/admin-api';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy to Supabase Admin API. Forwards path and query string.
 * Example: GET /api/admin/dashboard/stats -> Admin API GET /dashboard/stats
 * Example: GET /api/admin/users?page=1&search=john -> Admin API GET /users?page=1&search=john
 */
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  try {
    const { path: pathSegments } = await context.params;
    const path = Array.isArray(pathSegments) ? pathSegments.join('/') : '';
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
    const res = await adminApiFetch(path, { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Admin API error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
