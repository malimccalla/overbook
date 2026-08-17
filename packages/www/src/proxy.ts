import { clerkMiddleware } from '@clerk/nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';

const RESERVED_SUBDOMAINS = new Set(['app', 'admin', 'www']);
const PUBLIC_PATHS = new Set(['/sign-in', '/sign-up']);

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.has(pathname) || pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
}

function subdomainRouter(request: NextRequest) {
  const hostname = (request.headers.get('host') || '').split(':')[0];
  const parts = hostname.split('.');
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.endsWith('.ico')
  ) {
    return NextResponse.next();
  }

  let subdomain: string | null = null;
  if (hostname === 'localhost' || parts.length <= 2) {
    subdomain = null;
  } else {
    subdomain = parts[0];
  }

  if (!subdomain || subdomain === 'www') {
    return NextResponse.next();
  }

  // Auth routes are shared across all subdomains
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (subdomain === 'app') {
    return NextResponse.rewrite(
      new URL(`/dashboard${pathname}${request.nextUrl.search}`, request.url),
    );
  }

  if (subdomain === 'admin') {
    return NextResponse.rewrite(
      new URL(`/admin${pathname}${request.nextUrl.search}`, request.url),
    );
  }

  if (!RESERVED_SUBDOMAINS.has(subdomain)) {
    const newUrl = new URL(`/${subdomain}${pathname}`, request.url);
    newUrl.search = request.nextUrl.search;
    return NextResponse.rewrite(newUrl);
  }

  return NextResponse.next();
}

export default clerkMiddleware(async (auth, request) => {
  const pathname = request.nextUrl.pathname;
  const hostname = (request.headers.get('host') || '').split(':')[0];
  const parts = hostname.split('.');
  const subdomain = parts.length > 2 ? parts[0] : null;

  // Protect app and admin subdomains (but not auth pages or marketing)
  const isAppRoute = subdomain === 'app' || subdomain === 'admin';
  if (isAppRoute && !isPublicPath(pathname)) {
    await auth.protect();
  }

  return subdomainRouter(request);
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
    '/__clerk/:path*',
  ],
};
