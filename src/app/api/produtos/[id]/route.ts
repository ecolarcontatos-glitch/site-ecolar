import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeUpdate, executeDelete } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    console.log(`📋 Buscando produto ID: ${id}`);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const produtos = await executeQuery(`
      SELECT 
        p.id, p.nome, p.categoria_id, p.descricao, p.preco, p.desconto, 
        p.imagem, p.destaque, p.status, p.disponivel, p.unidade, p.created_at, p.updated_at,
        c.nome as categoria_nome, c.slug as categoria_slug
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = ?
    `, [id]);

    if (produtos.length === 0) {
      console.log(`❌ Produto ID ${id} não encontrado`);
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    console.log(`✅ Produto encontrado: ${produtos[0].nome}`);
    return NextResponse.json(produtos[0]);
  } catch (error) {
    console.error('❌ Erro ao buscar produto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { 
      nome, categoria_id, descricao, preco, desconto, 
      imagem, destaque, status, disponivel, unidade 
    } = body;

    console.log(`✏️ Atualizando produto ID: ${id}`, { nome, categoria_id, unidade });

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    if (!nome || !categoria_id) {
      return NextResponse.json(
        { error: 'Nome e categoria são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await executeUpdate(`
      UPDATE produtos 
      SET nome = ?, categoria_id = ?, descricao = ?, preco = ?, desconto = ?, 
          imagem = ?, destaque = ?, status = ?, disponivel = ?, unidade = ?, updated_at = NOW()
      WHERE id = ?
    `, [
      nome,
      categoria_id,
      descricao || '',
      preco || 0,
      desconto || 0,
      imagem || '',
      destaque ? 1 : 0,
      status || 'ativo',
      disponivel !== false ? 1 : 0,
      unidade || 'unidade',
      id
    ]);

    if (result.affectedRows === 0) {
      console.log(`❌ Produto ID ${id} não encontrado para atualização`);
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    console.log(`✅ Produto ID ${id} atualizado com sucesso`);
    return NextResponse.json({
      id,
      nome,
      categoria_id,
      descricao: descricao || '',
      preco: preco || 0,
      desconto: desconto || 0,
      imagem: imagem || '',
      destaque: destaque ? 1 : 0,
      status: status || 'ativo',
      disponivel: disponivel !== false ? 1 : 0,
      unidade: unidade || 'unidade',
      message: 'Produto atualizado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar produto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    console.log(`🗑️ Deletando produto ID: ${id}`);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const result = await executeDelete(`
      DELETE FROM produtos WHERE id = ?
    `, [id]);

    if (result.affectedRows === 0) {
      console.log(`❌ Produto ID ${id} não encontrado para deleção`);
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    console.log(`✅ Produto ID ${id} deletado com sucesso`);
    return NextResponse.json({
      message: 'Produto deletado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao deletar produto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}