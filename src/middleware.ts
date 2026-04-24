import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const LEGACY_DETAIL_UUID_PATH = /^\/(venues|vendors)\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (LEGACY_DETAIL_UUID_PATH.test(pathname)) {
    const base = pathname.startsWith('/vendors/') ? '/vendors' : '/venues';
    const targetUrl = new URL(base, request.url);
    return NextResponse.redirect(targetUrl, 308);
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
