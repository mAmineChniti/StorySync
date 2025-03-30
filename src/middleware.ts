import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = request.cookies.get("user");

  if (
    (pathname === "/" ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/register")) &&
    user
  ) {
    return NextResponse.redirect(new URL("/browse", request.url), 307);
  }

  const protectedRoutes = [
    "/browse",
    "/profile",
    "/collaborations",
    "/story",
    "/create-story",
    "/my-stories",
    "/email-confirmation",
  ];

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !user) {
    return NextResponse.redirect(new URL("/login", request.url), 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/browse/:path*",
    "/profile",
    "/collaborations",
    "/story/:path*",
    "/create-story",
    "/my-stories",
    "/email-confirmation",
    "/login",
    "/register",
    "/terms-of-service",
    "/privacy-policy",
  ],
};
