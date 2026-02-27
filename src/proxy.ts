// src/proxy.ts
//
// This is the route protection layer for the entire app.
// It runs on the server BEFORE any page renders, on every matching request.
//
// Logic:
//   - /admin/* without a valid session → redirect to /login
//   - /login  with    a valid session → redirect to /admin (already logged in)
//   - everything else → pass through untouched (public blog stays open)

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLoginPage = nextUrl.pathname === "/login";

  // Trying to access admin without being logged in → send to login
  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Already logged in but visiting /login → send to admin dashboard
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", nextUrl));
  }

  // Everything else: let the request through normally
  return NextResponse.next();
});

// Tell Next.js which routes this proxy runs on.
// We explicitly exclude static files, images, and Next.js internals
// so they are never accidentally blocked.
export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
  ],
};