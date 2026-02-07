/**
 * Type declarations for Supabase Edge Functions (Deno runtime).
 * These files (admin_api/, notify_admin/) are deployed to Supabase, not built by Next.js.
 */

declare namespace Deno {
  namespace env {
    function get(key: string): string | undefined;
  }
  function serve(
    handler: (req: Request) => Response | Promise<Response>,
    options?: { port?: number; hostname?: string }
  ): void;
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
  export function createClient(
    url: string,
    key: string,
    options?: Record<string, unknown>
  ): {
    from: (table: string) => unknown;
    rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
    auth: { getUser: (jwt: string) => Promise<unknown> };
    [key: string]: unknown;
  };
}
