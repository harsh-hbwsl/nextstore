import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Admin routes require admin role
    if (pathname.startsWith('/admin')) {
      if (token?.role !== 'admin') {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('error', 'unauthorized');
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Token must exist to access these routes
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (pathname.startsWith('/admin'))   return !!token;
        if (pathname.startsWith('/checkout')) return !!token;
        return true;
      },
    },
  }
);

export const config = {
  // Which routes the middleware runs on
  matcher: ['/admin/:path*', '/checkout/:path*'],
};
