import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeUpdate, executeDelete } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    console.log(`📋 Buscando categoria ID: ${id}`);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const categorias = await executeQuery(`
      SELECT id, nome, imagem, descricao, slug, cor, created_at, updated_at
      FROM categorias 
      WHERE id = ?
    `, [id]);

    if (categorias.length === 0) {
      console.log(`❌ Categoria ID ${id} não encontrada`);
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }

    console.log(`✅ Categoria encontrada: ${categorias[0].nome}`);
    return NextResponse.json(categorias[0]);
  } catch (error) {
    console.error('❌ Erro ao buscar categoria:', error);
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
    const { nome, imagem, descricao, slug, cor } = body;

    console.log(`✏️ Atualizando categoria ID: ${id}`, { nome, slug, cor });

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    if (!nome || !slug) {
      return NextResponse.json(
        { error: 'Nome e slug são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await executeUpdate(`
      UPDATE categorias 
      SET nome = ?, imagem = ?, descricao = ?, slug = ?, cor = ?, updated_at = NOW()
      WHERE id = ?
    `, [nome, imagem || '', descricao || '', slug, cor || '#3B82F6', id]);

    if (result.affectedRows === 0) {
      console.log(`❌ Categoria ID ${id} não encontrada para atualização`);
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }

    console.log(`✅ Categoria ID ${id} atualizada com sucesso`);
    return NextResponse.json({
      id,
      nome,
      imagem: imagem || '',
      descricao: descricao || '',
      slug,
      cor: cor || '#3B82F6',
      message: 'Categoria atualizada com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar categoria:', error);
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
    console.log(`🗑️ Deletando categoria ID: ${id}`);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    // Verificar se existem produtos vinculados
    const produtos = await executeQuery(`
      SELECT COUNT(*) as count FROM produtos WHERE categoria_id = ?
    `, [id]);

    if (produtos[0]?.count > 0) {
      console.log(`❌ Categoria ID ${id} possui produtos vinculados`);
      return NextResponse.json(
        { error: 'Não é possível deletar categoria com produtos vinculados' },
        { status: 400 }
      );
    }

    const result = await executeDelete(`
      DELETE FROM categorias WHERE id = ?
    `, [id]);

    if (result.affectedRows === 0) {
      console.log(`❌ Categoria ID ${id} não encontrada para deleção`);
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }

    console.log(`✅ Categoria ID ${id} deletada com sucesso`);
    return NextResponse.json({
      message: 'Categoria deletada com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao deletar categoria:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}