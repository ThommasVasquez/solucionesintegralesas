import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from './lib/auth.config';

const { auth } = NextAuth(authConfig);

// ── Brand domain → landing page mapping ──────────────────────────────────────
// Add new brand domains here as they are registered.
const BRAND_DOMAINS: Record<string, string> = {
  'ingenova.com.co':     '/empresas/ingenova',
  'www.ingenova.com.co': '/empresas/ingenova',
  // Future:
  // 'vivacalentadores.com':   '/empresas/viva-calentadores',
  // 'promascotas.com.co': '/empresas/promascotas',
};

export default auth((req) => {
  const { nextUrl } = req;
  const hostname = req.headers.get('host') ?? '';
  const isAuthenticated = !!req.auth;

  // 0. Brand-domain rewrite — serve brand landing page at root
  //    The visitor's URL stays as ingenova.com.co, no redirect.
  const brandPath = BRAND_DOMAINS[hostname];
  if (brandPath && nextUrl.pathname === '/') {
    const url = nextUrl.clone();
    url.pathname = brandPath;
    return NextResponse.rewrite(url);
  }

  // 1. Si está en el login y ya está autenticado, mandarlo al dashboard
  if (nextUrl.pathname.startsWith('/login') && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  // 2. Proteger RUTAS CRÍTICAS: Dashboard y API de hojas
  const isProtectedRoute = nextUrl.pathname.startsWith('/dashboard') || 
                           nextUrl.pathname.startsWith('/api/sheets');

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
