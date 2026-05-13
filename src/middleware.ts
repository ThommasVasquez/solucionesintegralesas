import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from './lib/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const isAuthPage = nextUrl.pathname.startsWith('/login');

  if (isAuthPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }
    return null;
  }

  if (!isAuthenticated && nextUrl.pathname !== '/') {
    // Only protect /dashboard and other routes, allow home
    if (nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/api/sheets')) {
      return NextResponse.redirect(new URL('/login', nextUrl));
    }
  }

  return null;
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
