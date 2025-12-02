import mysql, { Pool, PoolOptions, ResultSetHeader } from "mysql2/promise";

declare global {
  // Evita duplicações durante hot reload no Next.js
  // eslint-disable-next-line no-var
  var _mysqlPool: Pool | undefined;
}

/**
 * Valida as variáveis de ambiente antes de usar
 */
function validateEnv() {
  const required = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`❌ Variáveis faltando: ${missing.join(", ")}`);
  }
}

/**
 * Retorna um pool global (compartilhado entre execuções serverless)
 */
export function getPool(): Pool {
  validateEnv();

  if (!global._mysqlPool) {
    const config: PoolOptions = {
      host: process.env.DB_HOST!,
      port: Number(process.env.DB_PORT!) || 3306,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,
      waitForConnections: true,
      connectionLimit: 5, // ⚠️ IMPORTANTE: limitar para não estourar HostGator
      queueLimit: 0,
      connectTimeout: 10000,
      charset: "utf8mb4",
      timezone: "+00:00"
    };

    console.log("🔧 Criando pool MySQL (global):", {
      host: config.host,
      port: config.port,
      user: config.user,
      database: config.database
    });

    global._mysqlPool = mysql.createPool(config);
  }

  return global._mysqlPool;
}

/**
 * Execução padrão para SELECT
 */
export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(query, params);
    return rows as T[];
  } catch (error) {
    console.error("❌ Erro executeQuery:", error);
    console.error("Query:", query);
    throw error;
  }
}

/**
 * Execução para INSERT
 */
export async function executeInsert(
  query: string,
  params: any[] = []
): Promise<{ insertId: number; affectedRows: number }> {
  try {
    const pool = getPool();
    const [result] = await pool.execute<ResultSetHeader>(query, params);
    return { insertId: result.insertId, affectedRows: result.affectedRows };
  } catch (error) {
    console.error("❌ Erro executeInsert:", error);
    console.error("Query:", query);
    throw error;
  }
}

/**
 * Execução para UPDATE
 */
export async function executeUpdate(
  query: string,
  params: any[] = []
): Promise<{ affectedRows: number }> {
  try {
    const pool = getPool();
    const [result] = await pool.execute<ResultSetHeader>(query, params);
    return { affectedRows: result.affectedRows };
  } catch (error) {
    console.error("❌ Erro executeUpdate:", error);
    console.error("Query:", query);
    throw error;
  }
}

/**
 * Execução para DELETE
 */
export async function executeDelete(
  query: string,
  params: any[] = []
): Promise<{ affectedRows: number }> {
  try {
    const pool = getPool();
    const [result] = await pool.execute<ResultSetHeader>(query, params);
    return { affectedRows: result.affectedRows };
  } catch (error) {
    console.error("❌ Erro executeDelete:", error);
    console.error("Query:", query);
    throw error;
  }
}

export async function testConnection(): Promise<boolean> {
  try {
    const pool = getPool();
    await pool.execute("SELECT 1");
    console.log("✅ MySQL OK");
    return true;
  } catch (error) {
    console.error("❌ Falha ao conectar no MySQL:", error);
    return false;
  }
}
