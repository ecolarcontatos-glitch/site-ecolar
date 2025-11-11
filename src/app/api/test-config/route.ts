import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Verificar variáveis de ambiente
    const config = {
      hasDbHost: !!process.env.DB_HOST,
      hasDbUser: !!process.env.DB_USER,
      hasDbPassword: !!process.env.DB_PASSWORD,
      hasDbName: !!process.env.DB_NAME,
      hasAdminApiKey: !!process.env.ADMIN_API_KEY,
      dbHost: process.env.DB_HOST,
      dbUser: process.env.DB_USER,
      dbName: process.env.DB_NAME,
      adminApiKeyPrefix: process.env.ADMIN_API_KEY ? process.env.ADMIN_API_KEY.substring(0, 8) + '...' : 'none'
    };

    console.log('🔧 Configuração do servidor:', config);

    return NextResponse.json({
      message: 'Configuração verificada',
      config,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erro ao verificar configuração:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar configuração', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}