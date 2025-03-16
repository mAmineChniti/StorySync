import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const user = req.cookies.get("user");

  if (
    (pathname === "/" ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/register")) &&
    user
  ) {
    return NextResponse.redirect(new URL("/browse", req.url), 307);
  }

  const protectedRoutes = [
    "/browse",
    "/profile",
    "/collaborations",
    "/story",
    "/create-story",
    "/user-stories",
  ];

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !user) {
    return NextResponse.redirect(new URL("/login", req.url), 401);
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
    "/user-stories",
    "/login",
    "/register",
  ],
};
