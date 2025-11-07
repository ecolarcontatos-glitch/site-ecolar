import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getPool() {
  if (!pool) {
    // Log das variáveis de ambiente para debug
    console.log('🔧 Configurando conexão MySQL:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      // Não loggar a senha por segurança
      password: process.env.DB_PASSWORD ? '[DEFINIDA]' : '[NÃO DEFINIDA]'
    });

    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      acquireTimeout: 10000,
      // Configurações adicionais para HostGator
      ssl: false,
      charset: 'utf8mb4',
      timezone: '+00:00'
    });

    // Log de confirmação da criação do pool
    console.log('✅ Pool de conexão MySQL criado');
  }
  return pool;
}

export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const pool = getPool();
    console.log('🔍 Executando query:', query.substring(0, 100) + (query.length > 100 ? '...' : ''));
    console.log('📊 Parâmetros:', params);
    
    const [rows] = await pool.execute(query, params);
    console.log('✅ Query executada com sucesso, linhas retornadas:', (rows as any[]).length);
    
    return rows as T[];
  } catch (error) {
    console.error('❌ Erro na execução da query:', error);
    console.error('🔍 Query que falhou:', query);
    console.error('📊 Parâmetros:', params);
    throw error;
  }
}

export async function executeInsert(
  query: string,
  params: any[] = []
): Promise<{ insertId: number; affectedRows: number }> {
  try {
    const pool = getPool();
    console.log('➕ Executando INSERT:', query.substring(0, 100) + (query.length > 100 ? '...' : ''));
    console.log('📊 Parâmetros:', params);
    
    const [result] = await pool.execute(query, params);
    const insertResult = result as mysql.ResultSetHeader;
    
    console.log('✅ INSERT executado com sucesso:', {
      insertId: insertResult.insertId,
      affectedRows: insertResult.affectedRows
    });
    
    return {
      insertId: insertResult.insertId,
      affectedRows: insertResult.affectedRows
    };
  } catch (error) {
    console.error('❌ Erro na execução do insert:', error);
    console.error('🔍 Query que falhou:', query);
    console.error('📊 Parâmetros:', params);
    throw error;
  }
}

export async function executeUpdate(
  query: string,
  params: any[] = []
): Promise<{ affectedRows: number }> {
  try {
    const pool = getPool();
    console.log('✏️ Executando UPDATE:', query.substring(0, 100) + (query.length > 100 ? '...' : ''));
    console.log('📊 Parâmetros:', params);
    
    const [result] = await pool.execute(query, params);
    const updateResult = result as mysql.ResultSetHeader;
    
    console.log('✅ UPDATE executado com sucesso:', {
      affectedRows: updateResult.affectedRows
    });
    
    return {
      affectedRows: updateResult.affectedRows
    };
  } catch (error) {
    console.error('❌ Erro na execução do update:', error);
    console.error('🔍 Query que falhou:', query);
    console.error('📊 Parâmetros:', params);
    throw error;
  }
}

export async function executeDelete(
  query: string,
  params: any[] = []
): Promise<{ affectedRows: number }> {
  try {
    const pool = getPool();
    console.log('🗑️ Executando DELETE:', query.substring(0, 100) + (query.length > 100 ? '...' : ''));
    console.log('📊 Parâmetros:', params);
    
    const [result] = await pool.execute(query, params);
    const deleteResult = result as mysql.ResultSetHeader;
    
    console.log('✅ DELETE executado com sucesso:', {
      affectedRows: deleteResult.affectedRows
    });
    
    return {
      affectedRows: deleteResult.affectedRows
    };
  } catch (error) {
    console.error('❌ Erro na execução do delete:', error);
    console.error('🔍 Query que falhou:', query);
    console.error('📊 Parâmetros:', params);
    throw error;
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    const pool = getPool();
    console.log('🔌 Testando conexão com MySQL...');
    
    const [rows] = await pool.execute('SELECT 1 as test, CONNECTION_ID() as connection_id, DATABASE() as database_name');
    const result = (rows as any[])[0];
    
    console.log('✅ Conexão com MySQL estabelecida com sucesso:', {
      connectionId: result.connection_id,
      database: result.database_name,
      host: process.env.DB_HOST
    });
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com MySQL:', error);
    console.error('🔧 Variáveis de ambiente:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD ? '[DEFINIDA]' : '[NÃO DEFINIDA]'
    });
    return false;
  }
}