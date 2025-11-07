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
      passwordSet: !!process.env.DB_PASSWORD
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

    // Log da conexão estabelecida
    pool.on('connection', (connection) => {
      console.log('✅ DB Connected:', connection.config.host);
    });

    pool.on('error', (err) => {
      console.error('❌ DB Pool Error:', err);
    });
  }
  return pool;
}

export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const pool = getPool();
    console.log('🔍 Executando query:', query.substring(0, 100) + '...');
    const [rows] = await pool.execute(query, params);
    console.log('✅ Query executada com sucesso, linhas retornadas:', (rows as any[]).length);
    return rows as T[];
  } catch (error) {
    console.error('❌ Erro na execução da query:', error);
    console.error('Query:', query);
    console.error('Params:', params);
    throw error;
  }
}

export async function executeInsert(
  query: string,
  params: any[] = []
): Promise<{ insertId: number; affectedRows: number }> {
  try {
    const pool = getPool();
    console.log('➕ Executando insert:', query.substring(0, 100) + '...');
    const [result] = await pool.execute(query, params);
    const insertResult = result as mysql.ResultSetHeader;
    console.log('✅ Insert executado com sucesso, ID:', insertResult.insertId);
    return {
      insertId: insertResult.insertId,
      affectedRows: insertResult.affectedRows
    };
  } catch (error) {
    console.error('❌ Erro na execução do insert:', error);
    console.error('Query:', query);
    console.error('Params:', params);
    throw error;
  }
}

export async function executeUpdate(
  query: string,
  params: any[] = []
): Promise<{ affectedRows: number }> {
  try {
    const pool = getPool();
    console.log('✏️ Executando update:', query.substring(0, 100) + '...');
    const [result] = await pool.execute(query, params);
    const updateResult = result as mysql.ResultSetHeader;
    console.log('✅ Update executado com sucesso, linhas afetadas:', updateResult.affectedRows);
    return {
      affectedRows: updateResult.affectedRows
    };
  } catch (error) {
    console.error('❌ Erro na execução do update:', error);
    console.error('Query:', query);
    console.error('Params:', params);
    throw error;
  }
}

export async function executeDelete(
  query: string,
  params: any[] = []
): Promise<{ affectedRows: number }> {
  try {
    const pool = getPool();
    console.log('🗑️ Executando delete:', query.substring(0, 100) + '...');
    const [result] = await pool.execute(query, params);
    const deleteResult = result as mysql.ResultSetHeader;
    console.log('✅ Delete executado com sucesso, linhas afetadas:', deleteResult.affectedRows);
    return {
      affectedRows: deleteResult.affectedRows
    };
  } catch (error) {
    console.error('❌ Erro na execução do delete:', error);
    console.error('Query:', query);
    console.error('Params:', params);
    throw error;
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    const pool = getPool();
    console.log('🔍 Testando conexão com o banco...');
    await pool.execute('SELECT 1 as test');
    console.log('✅ Conexão com MySQL estabelecida com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com MySQL:', error);
    return false;
  }
}