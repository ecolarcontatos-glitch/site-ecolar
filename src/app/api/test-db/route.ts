import { NextResponse } from 'next/server';
import { testConnection, executeQuery } from '@/lib/db';

export async function GET() {
  try {
    console.log('🔧 Testando conexão com banco MySQL...');
    
    // Teste básico de conexão
    const connectionOk = await testConnection();
    
    if (!connectionOk) {
      return NextResponse.json({
        success: false,
        message: 'Falha na conexão com o banco de dados',
        env: {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          user: process.env.DB_USER,
          database: process.env.DB_NAME,
          password: process.env.DB_PASSWORD ? 'DEFINIDA' : 'NÃO DEFINIDA'
        }
      }, { status: 500 });
    }

    // Teste das tabelas
    const tabelas = await executeQuery(`
      SELECT TABLE_NAME, TABLE_ROWS 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'
    `, [process.env.DB_NAME]);

    console.log('📊 Tabelas encontradas:', tabelas);

    // Contar registros nas tabelas principais
    const countProdutos = await executeQuery('SELECT COUNT(*) as total FROM produtos');
    const countCategorias = await executeQuery('SELECT COUNT(*) as total FROM categorias');

    return NextResponse.json({
      success: true,
      message: 'Conexão com MySQL estabelecida com sucesso',
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      tabelas: tabelas.map(t => ({
        nome: t.TABLE_NAME,
        registros: t.TABLE_ROWS
      })),
      contadores: {
        produtos: countProdutos[0]?.total || 0,
        categorias: countCategorias[0]?.total || 0
      }
    });

  } catch (error) {
    console.error('❌ Erro no teste de conexão:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro no teste de conexão',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      env: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD ? 'DEFINIDA' : 'NÃO DEFINIDA'
      }
    }, { status: 500 });
  }
}