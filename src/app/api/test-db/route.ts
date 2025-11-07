import { NextResponse } from 'next/server';
import { testConnection, executeQuery } from '@/lib/db';

export async function GET() {
  try {
    console.log('🔍 Iniciando teste de conexão...');
    
    // Verificar variáveis de ambiente
    const envVars = {
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_USER: process.env.DB_USER,
      DB_NAME: process.env.DB_NAME,
      DB_PASSWORD: process.env.DB_PASSWORD ? '[DEFINIDA]' : '[NÃO DEFINIDA]'
    };
    
    console.log('🔧 Variáveis de ambiente:', envVars);
    
    // Testar conexão
    const connectionOk = await testConnection();
    
    if (!connectionOk) {
      return NextResponse.json({
        success: false,
        message: 'Falha na conexão com o banco',
        envVars
      }, { status: 500 });
    }
    
    // Testar query básica
    const result = await executeQuery('SELECT DATABASE() as current_db, CONNECTION_ID() as connection_id');
    
    // Testar se as tabelas existem
    const tables = await executeQuery('SHOW TABLES');
    
    return NextResponse.json({
      success: true,
      message: 'Conexão estabelecida com sucesso',
      database: result[0],
      tables: tables.map((t: any) => Object.values(t)[0]),
      envVars
    });
    
  } catch (error) {
    console.error('❌ Erro no teste de conexão:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro no teste de conexão',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      envVars: {
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_USER: process.env.DB_USER,
        DB_NAME: process.env.DB_NAME,
        DB_PASSWORD: process.env.DB_PASSWORD ? '[DEFINIDA]' : '[NÃO DEFINIDA]'
      }
    }, { status: 500 });
  }
}