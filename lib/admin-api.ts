/**
 * Server-only: call the Supabase Admin API (used by API routes).
 * Requires ADMIN_API_BASE_URL and ADMIN_API_KEY in env.
 */

const getBaseUrl = () => {
  const url = process.env.ADMIN_API_BASE_URL;
  if (!url) throw new Error('ADMIN_API_BASE_URL is not set');
  return url.replace(/\/$/, '');
};

const getAdminKey = () => {
  const key = process.env.ADMIN_API_KEY;
  if (!key) throw new Error('ADMIN_API_KEY is not set');
  return key;
};

export type AdminApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Forward a request to the Admin API. Use from Next.js API routes only.
 * path: e.g. "dashboard/stats" or "users?page=1&limit=20"
 * searchParams: optional; if body is for POST/PUT/PATCH, pass it separately.
 */
export async function adminApiFetch(
  path: string,
  options: {
    method?: AdminApiMethod;
    body?: unknown;
    searchParams?: URLSearchParams | string;
  } = {}
): Promise<Response> {
  const { method = 'GET', body, searchParams } = options;
  const base = getBaseUrl();
  const key = getAdminKey();
  const pathClean = path.replace(/^\//, '');
  let query = '';
  if (searchParams) {
    if (typeof searchParams === 'string') {
      query = searchParams.startsWith('?') ? searchParams : `?${searchParams}`;
    } else {
      const str = searchParams.toString();
      query = str ? `?${str}` : '';
    }
  }
  const url = `${base}/${pathClean}${query}`;

  const headers: Record<string, string> = {
    'x-admin-key': key,
    'Content-Type': 'application/json',
  };

  const init: RequestInit = {
    method,
    headers,
  };
  if ((method === 'POST' || method === 'PUT' || method === 'PATCH') && body !== undefined) {
    init.body = JSON.stringify(body);
  }

  return fetch(url, init);
}
