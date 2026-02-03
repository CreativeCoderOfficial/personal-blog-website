import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Check if user is trying to access the dashboard
  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    
    // 2. Check for a session cookie (In a real app, verify this token)
    const isAdmin = request.cookies.get('admin_session');

    // 3. If no cookie, redirect to login
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which paths this middleware runs on
export const config = {
  matcher: '/admin/:path*',
};