import mysql, { Pool, PoolOptions, ResultSetHeader } from "mysql2/promise";

let pool: Pool | null = null;

/**
 * Valida as variáveis de ambiente antes de usar
 */
function validateEnv() {
  const required = [
    "DB_HOST",
    "DB_PORT",
    "DB_USER",
    "DB_PASSWORD",
    "DB_NAME"
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `❌ Variáveis de ambiente faltando: ${missing.join(", ")}`
    );
  }
}

/**
 * Retorna um pool MySQL singleton
 */
export function getPool(): Pool {
  if (!pool) {
    validateEnv();

    const config: PoolOptions = {
      host: process.env.DB_HOST!,
      port: Number(process.env.DB_PORT!) || 3306,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 10000,
      charset: "utf8mb4",
      timezone: "+00:00"
      // ssl removido pois a tipagem não aceita "false"
    };

    console.log("🔧 Criando pool MySQL:", {
      host: config.host,
      port: config.port,
      user: config.user,
      database: config.database
    });

    pool = mysql.createPool(config);

    pool.on("connection", (conn) => {
      console.log("✅ Conexão estabelecida com MySQL:", conn.config.host);
    });
  }

  return pool;
}

/**
 * Execução padrão para SELECT
 */
export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const connection = getPool();

    const [rows] = await connection.execute(query, params);

    return rows as T[];
  } catch (error) {
    console.error("❌ Erro executeQuery:", error);
    console.error("Query:", query);
    console.error("Params:", params);
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
    const connection = getPool();
    const [result] = await connection.execute<ResultSetHeader>(query, params);

    return {
      insertId: result.insertId,
      affectedRows: result.affectedRows
    };
  } catch (error) {
    console.error("❌ Erro executeInsert:", error);
    console.error("Query:", query);
    console.error("Params:", params);
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
    const connection = getPool();
    const [result] = await connection.execute<ResultSetHeader>(query, params);

    return {
      affectedRows: result.affectedRows
    };
  } catch (error) {
    console.error("❌ Erro executeUpdate:", error);
    console.error("Query:", query);
    console.error("Params:", params);
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
    const connection = getPool();
    const [result] = await connection.execute<ResultSetHeader>(query, params);

    return {
      affectedRows: result.affectedRows
    };
  } catch (error) {
    console.error("❌ Erro executeDelete:", error);
    console.error("Query:", query);
    console.error("Params:", params);
    throw error;
  }
}

/**
 * Teste manual da conexão
 */
export async function testConnection(): Promise<boolean> {
  try {
    const connection = getPool();
    await connection.execute("SELECT 1");
    console.log("✅ MySQL OK");
    return true;
  } catch (error) {
    console.error("❌ Falha ao conectar no MySQL:", error);
    return false;
  }
}
