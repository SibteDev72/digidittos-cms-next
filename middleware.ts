import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  // If visiting a public auth page while already authenticated, redirect to dashboard
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path)) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If visiting a protected page without authentication, redirect to login
  if (!PUBLIC_PATHS.some((path) => pathname.startsWith(path)) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/blogs/:path*",
    "/teams/:path*",
    "/users/:path*",
    "/content/:path*",
    "/media/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
