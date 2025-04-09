import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = request.cookies.get("user");
  const access = request.cookies.get("access");
  const refresh = request.cookies.get("refresh");
  const isLoggedIn = user && access && refresh;

  if (["/", "/login", "/register"].includes(pathname) && isLoggedIn) {
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

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url), 307);
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
