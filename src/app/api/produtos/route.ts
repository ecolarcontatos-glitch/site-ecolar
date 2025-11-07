import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeInsert, testConnection } from '@/lib/db';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const destaque = searchParams.get('destaque');
    const disponivel = searchParams.get('disponivel');

    console.log('📋 Listando produtos...', { categoria, destaque, disponivel });

    let query = `
      SELECT 
        p.id, p.nome, p.categoria_id, p.descricao, p.preco, p.desconto, 
        p.imagem, p.destaque, p.disponivel, p.unidade, p.created_at, p.updated_at,
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

    console.log(`✅ ${produtos.length} produtos encontrados no banco MySQL`);
    
    // Log dos primeiros produtos para debug
    if (produtos.length > 0) {
      console.log('📦 Primeiros produtos:', produtos.slice(0, 3).map(p => ({ id: p.id, nome: p.nome })));
    }

    return NextResponse.json(produtos);
  } catch (error) {
    console.error('❌ Erro ao listar produtos:', error);
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
    const { 
      nome, categoria_id, descricao, preco, desconto, 
      imagem, destaque, disponivel, unidade 
    } = body;

    console.log('➕ Criando produto no MySQL:', { nome, categoria_id, unidade });

    if (!nome || !categoria_id) {
      return NextResponse.json(
        { error: 'Nome e categoria são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await executeInsert(`
      INSERT INTO produtos (
        nome, categoria_id, descricao, preco, desconto, 
        imagem, destaque, disponivel, unidade, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      nome,
      categoria_id,
      descricao || '',
      preco || 0,
      desconto || 0,
      imagem || '',
      destaque ? 1 : 0,
      disponivel !== false ? 1 : 0,
      unidade || 'unidade'
    ]);

    console.log(`✅ Produto criado no MySQL com ID: ${result.insertId}`);

    // Verificar se o produto foi realmente inserido
    const produtoInserido = await executeQuery(
      'SELECT * FROM produtos WHERE id = ?', 
      [result.insertId]
    );
    
    if (produtoInserido.length > 0) {
      console.log('✅ Confirmado: produto existe no banco:', produtoInserido[0]);
    } else {
      console.error('❌ ERRO: produto não foi encontrado após inserção!');
    }

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
        disponivel: disponivel !== false ? 1 : 0,
        unidade: unidade || 'unidade',
        message: 'Produto criado com sucesso no MySQL'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Erro ao criar produto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}