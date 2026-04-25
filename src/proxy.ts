import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export async function proxy(request: NextRequest) {
  // ── 1. Propagate x-pathname so server components can read the current path ──
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  let response = NextResponse.next({ request: { headers: requestHeaders } });

  // ── 2. Refresh the Supabase session so auth cookies stay valid ─────────────
  // This silently updates the session tokens on every request. When the refresh
  // token is expired/invalid it throws an AuthApiError, which we swallow here;
  // the admin layout's checkAuth() will then clear the stale session and show
  // the login form.
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        // Rebuild the response so the x-pathname header is preserved, then
        // stamp the new session cookies onto it.
        response = NextResponse.next({ request: { headers: requestHeaders } });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  try {
    await supabase.auth.getUser();
  } catch {
    // Invalid / expired refresh token — admin layout handles the sign-out.
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on all routes except:
     *  - Next.js internals (_next/static, _next/image, favicon.ico)
     *  - Public file extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
