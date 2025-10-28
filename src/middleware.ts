import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Verificar se é uma rota do painel administrativo (exceto login)
  if (request.nextUrl.pathname.startsWith('/admin') && 
      request.nextUrl.pathname !== '/admin' && 
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    
    // Verificar se existe cookie de autenticação
    const isAuthenticated = request.cookies.get('admin_authenticated');
    
    if (!isAuthenticated || isAuthenticated.value !== 'true') {
      // Redirecionar para página de login
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};