import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeInsert, testConnection } from '@/lib/db';

export async function GET() {
  try {
    // Teste de conexão antes de executar queries
    const connectionOk = await testConnection();
    if (!connectionOk) {
      console.error('❌ Falha na conexão com o banco de dados');
      return NextResponse.json(
        { error: 'Erro de conexão com banco de dados' },
        { status: 500 }
      );
    }

    console.log('📋 Listando categorias do MySQL...');
    
    const categorias = await executeQuery(`
      SELECT id, nome, imagem, descricao, slug, cor, created_at, updated_at
      FROM categorias 
      ORDER BY nome ASC
    `);

    console.log(`✅ ${categorias.length} categorias encontradas no banco MySQL`);
    
    // Log das primeiras categorias para debug
    if (categorias.length > 0) {
      console.log('📂 Primeiras categorias:', categorias.slice(0, 3).map(c => ({ id: c.id, nome: c.nome, slug: c.slug })));
    }

    return NextResponse.json(categorias);
  } catch (error) {
    console.error('❌ Erro ao listar categorias:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Teste de conexão antes de executar queries
    const connectionOk = await testConnection();
    if (!connectionOk) {
      console.error('❌ Falha na conexão com o banco de dados');
      return NextResponse.json(
        { error: 'Erro de conexão com banco de dados' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { nome, imagem, descricao, slug, cor } = body;

    console.log('➕ Criando categoria no MySQL:', { nome, slug, cor });

    if (!nome || !slug) {
      return NextResponse.json(
        { error: 'Nome e slug são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await executeInsert(`
      INSERT INTO categorias (nome, imagem, descricao, slug, cor, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `, [nome, imagem || '', descricao || '', slug, cor || '#3B82F6']);

    console.log(`✅ Categoria criada no MySQL com ID: ${result.insertId}`);

    // Verificar se a categoria foi realmente inserida
    const categoriaInserida = await executeQuery(
      'SELECT * FROM categorias WHERE id = ?', 
      [result.insertId]
    );
    
    if (categoriaInserida.length > 0) {
      console.log('✅ Confirmado: categoria existe no banco:', categoriaInserida[0]);
    } else {
      console.error('❌ ERRO: categoria não foi encontrada após inserção!');
    }

    return NextResponse.json(
      { 
        id: result.insertId,
        nome,
        imagem: imagem || '',
        descricao: descricao || '',
        slug,
        cor: cor || '#3B82F6',
        message: 'Categoria criada com sucesso no MySQL'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Erro ao criar categoria:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}