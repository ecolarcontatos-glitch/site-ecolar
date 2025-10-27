import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lista de rotas válidas
  const validRoutes = [
    '/',
    '/produtos',
    '/parcerias', 
    '/blog',
    '/contato',
    '/orcamento',
    '/admin',
    '/admin/produtos'
  ];

  // Verificar se é uma rota de API ou arquivo estático
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Se a rota não existe, redirecionar para 404
  if (!validRoutes.includes(pathname) && !pathname.startsWith('/admin/')) {
    return NextResponse.rewrite(new URL('/not-found', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};