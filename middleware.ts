import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar se é uma rota de API que precisa de proteção
  if (pathname.startsWith('/api/')) {
    // Rotas públicas que não precisam de autenticação
    const publicRoutes = [
      '/api/public',
      '/api/health',
      '/api/status',
      '/api/test-config'
    ];

    // Verificar se é uma rota pública
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    
    if (!isPublicRoute) {
      // Verificar se o token de admin está presente
      const adminApiKey = request.headers.get('x-admin-api-key') || 
                         request.headers.get('authorization')?.replace('Bearer ', '') ||
                         request.nextUrl.searchParams.get('admin_key');

      // Usar a chave correta do ambiente
      const expectedApiKey = process.env.ADMIN_API_KEY || 'ecolar-API-2025@secure';

      console.log('🔐 Middleware - Verificando autenticação:', {
        path: pathname,
        hasApiKey: !!adminApiKey,
        apiKeyPreview: adminApiKey ? adminApiKey.substring(0, 8) + '...' : 'none',
        expectedKeyPreview: expectedApiKey.substring(0, 8) + '...'
      });

      // Se não há token na requisição ou token inválido
      if (!adminApiKey || adminApiKey !== expectedApiKey) {
        console.error('❌ Middleware - Acesso negado:', {
          path: pathname,
          providedKey: adminApiKey ? adminApiKey.substring(0, 8) + '...' : 'none',
          expectedKey: expectedApiKey.substring(0, 8) + '...'
        });
        
        return NextResponse.json(
          { 
            error: 'Unauthorized',
            message: 'Valid admin API key required. Include x-admin-api-key header.',
            debug: {
              providedKey: adminApiKey ? adminApiKey.substring(0, 8) + '...' : 'none',
              expectedKeyPrefix: expectedApiKey.substring(0, 8) + '...'
            }
          },
          { status: 401 }
        );
      }

      console.log('✅ Middleware - Acesso autorizado para:', pathname);
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