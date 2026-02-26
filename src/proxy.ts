import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. The Bouncer Logic
export function proxy(request: NextRequest) {
  // A. Look for a VIP wristband (a specific cookie)
  // Note: We will actually create the login system that sets this cookie later!
  const authToken = request.cookies.get('admin_session');

  // B. If there is NO token, they are not logged in.
  if (!authToken) {
    // We create a URL that points to your home page (or a login page if you make one)
    const loginUrl = new URL('/login', request.url);
    
    // Redirect them to that page immediately
    return NextResponse.redirect(loginUrl);
  }

  // C. If they DO have the token, let them pass through normally
  return NextResponse.next();
}

// 2. The Guest List (Matcher)
export const config = {
  matcher: [
    /*
     * Match all request paths that start with /admin
     * The /:path* means it applies to /admin AND everything inside it
     * like /admin/dashboard, /admin/posts/new, etc.
     */
    '/admin/:path*'
  ],
};