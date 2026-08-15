import { type NextRequest, NextResponse } from "next/server";

const RESERVED_SUBDOMAINS = new Set(["app", "admin", "www"]);

export default function proxy(request: NextRequest) {
  const hostname = (request.headers.get("host") || "").split(":")[0];
  const parts = hostname.split(".");
  const pathname = request.nextUrl.pathname;

  // Skip static assets
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.endsWith(".ico")
  ) {
    return NextResponse.next();
  }

  // Determine subdomain (works for overbook.test, overbook.io, localhost)
  let subdomain: string | null = null;
  if (hostname === "localhost" || parts.length <= 2) {
    subdomain = null;
  } else {
    subdomain = parts[0];
  }

  // Root domain → (marketing), no rewrite needed
  if (!subdomain || subdomain === "www") {
    return NextResponse.next();
  }

  // app.overbook.* → (dashboard)/dashboard/*
  if (subdomain === "app") {
    return NextResponse.rewrite(
      new URL(`/dashboard${pathname}${request.nextUrl.search}`, request.url),
    );
  }

  // admin.overbook.* → (admin)/admin/*
  if (subdomain === "admin") {
    return NextResponse.rewrite(
      new URL(`/admin${pathname}${request.nextUrl.search}`, request.url),
    );
  }

  // [tenant].overbook.* → (tenant)/[slug]/*
  if (!RESERVED_SUBDOMAINS.has(subdomain)) {
    const newUrl = new URL(`/${subdomain}${pathname}`, request.url);
    newUrl.search = request.nextUrl.search;
    return NextResponse.rewrite(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
