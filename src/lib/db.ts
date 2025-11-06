import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getPool() {
  if (!pool) {
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
    const [rows] = await pool.execute(query, params);
    return rows as T[];
  } catch (error) {
    console.error('Erro na execução da query:', error);
    throw error;
  }
}

export async function executeInsert(
  query: string,
  params: any[] = []
): Promise<{ insertId: number; affectedRows: number }> {
  try {
    const pool = getPool();
    const [result] = await pool.execute(query, params);
    const insertResult = result as mysql.ResultSetHeader;
    return {
      insertId: insertResult.insertId,
      affectedRows: insertResult.affectedRows
    };
  } catch (error) {
    console.error('Erro na execução do insert:', error);
    throw error;
  }
}

export async function executeUpdate(
  query: string,
  params: any[] = []
): Promise<{ affectedRows: number }> {
  try {
    const pool = getPool();
    const [result] = await pool.execute(query, params);
    const updateResult = result as mysql.ResultSetHeader;
    return {
      affectedRows: updateResult.affectedRows
    };
  } catch (error) {
    console.error('Erro na execução do update:', error);
    throw error;
  }
}

export async function executeDelete(
  query: string,
  params: any[] = []
): Promise<{ affectedRows: number }> {
  try {
    const pool = getPool();
    const [result] = await pool.execute(query, params);
    const deleteResult = result as mysql.ResultSetHeader;
    return {
      affectedRows: deleteResult.affectedRows
    };
  } catch (error) {
    console.error('Erro na execução do delete:', error);
    throw error;
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    const pool = getPool();
    await pool.execute('SELECT 1');
    console.log('✅ Conexão com MySQL estabelecida com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com MySQL:', error);
    return false;
  }
}