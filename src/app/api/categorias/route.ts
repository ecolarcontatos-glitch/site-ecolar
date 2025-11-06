import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeInsert } from '@/lib/db';

export async function GET() {
  try {
    console.log('📋 Listando categorias...');
    
    const categorias = await executeQuery(`
      SELECT id, nome, imagem, descricao, slug, created_at, updated_at
      FROM categorias 
      ORDER BY nome ASC
    `);

    console.log(`✅ ${categorias.length} categorias encontradas`);
    return NextResponse.json(categorias);
  } catch (error) {
    console.error('❌ Erro ao listar categorias:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, imagem, descricao, slug } = body;

    console.log('➕ Criando categoria:', { nome, slug });

    if (!nome || !slug) {
      return NextResponse.json(
        { error: 'Nome e slug são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await executeInsert(`
      INSERT INTO categorias (nome, imagem, descricao, slug, created_at, updated_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())
    `, [nome, imagem || '', descricao || '', slug]);

    console.log(`✅ Categoria criada com ID: ${result.insertId}`);

    return NextResponse.json(
      { 
        id: result.insertId,
        nome,
        imagem: imagem || '',
        descricao: descricao || '',
        slug,
        message: 'Categoria criada com sucesso'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Erro ao criar categoria:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}