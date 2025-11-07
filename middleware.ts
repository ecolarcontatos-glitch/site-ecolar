import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar se é uma rota de API que precisa de proteção
  if (pathname.startsWith('/api/')) {
    // Rotas públicas que não precisam de autenticação
    const publicRoutes = [
      '/api/public',
      '/api/health',
      '/api/status'
    ];

    // Verificar se é uma rota pública
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    
    if (!isPublicRoute) {
      // Verificar se o token de admin está presente
      const adminApiKey = request.headers.get('x-admin-api-key') || 
                         request.headers.get('authorization')?.replace('Bearer ', '') ||
                         request.nextUrl.searchParams.get('admin_key');

      const expectedApiKey = process.env.ADMIN_API_KEY;

      // Se não há chave configurada no ambiente, bloquear acesso
      if (!expectedApiKey) {
        return NextResponse.json(
          { 
            error: 'API protection not configured',
            message: 'ADMIN_API_KEY environment variable is required'
          },
          { status: 500 }
        );
      }

      // Se não há token na requisição ou token inválido
      if (!adminApiKey || adminApiKey !== expectedApiKey) {
        return NextResponse.json(
          { 
            error: 'Unauthorized',
            message: 'Valid admin API key required. Include x-admin-api-key header or admin_key query parameter.'
          },
          { status: 401 }
        );
      }
    }
  }

  // Continuar com a requisição se passou na validação
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};