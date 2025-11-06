import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeInsert } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const destaque = searchParams.get('destaque');
    const disponivel = searchParams.get('disponivel');

    console.log('📋 Listando produtos...', { categoria, destaque, disponivel });

    let query = `
      SELECT 
        p.id, p.nome, p.categoria_id, p.descricao, p.preco, p.desconto, 
        p.imagem, p.destaque, p.status, p.disponivel, p.created_at, p.updated_at,
        c.nome as categoria_nome, c.slug as categoria_slug
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (categoria) {
      query += ` AND c.slug = ?`;
      params.push(categoria);
    }

    if (destaque === 'true') {
      query += ` AND p.destaque = 1`;
    }

    if (disponivel !== null && disponivel !== undefined) {
      query += ` AND p.disponivel = ?`;
      params.push(disponivel === 'true' ? 1 : 0);
    }

    query += ` ORDER BY p.destaque DESC, p.created_at DESC`;

    const produtos = await executeQuery(query, params);

    console.log(`✅ ${produtos.length} produtos encontrados`);
    return NextResponse.json(produtos);
  } catch (error) {
    console.error('❌ Erro ao listar produtos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      nome, categoria_id, descricao, preco, desconto, 
      imagem, destaque, status, disponivel 
    } = body;

    console.log('➕ Criando produto:', { nome, categoria_id });

    if (!nome || !categoria_id) {
      return NextResponse.json(
        { error: 'Nome e categoria são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await executeInsert(`
      INSERT INTO produtos (
        nome, categoria_id, descricao, preco, desconto, 
        imagem, destaque, status, disponivel, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      nome,
      categoria_id,
      descricao || '',
      preco || 0,
      desconto || 0,
      imagem || '',
      destaque ? 1 : 0,
      status || 'ativo',
      disponivel !== false ? 1 : 0
    ]);

    console.log(`✅ Produto criado com ID: ${result.insertId}`);

    return NextResponse.json(
      { 
        id: result.insertId,
        nome,
        categoria_id,
        descricao: descricao || '',
        preco: preco || 0,
        desconto: desconto || 0,
        imagem: imagem || '',
        destaque: destaque ? 1 : 0,
        status: status || 'ativo',
        disponivel: disponivel !== false ? 1 : 0,
        message: 'Produto criado com sucesso'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Erro ao criar produto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}