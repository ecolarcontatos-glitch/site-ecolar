import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeUpdate, executeDelete } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    console.log(`📋 Buscando inspiração ID: ${id}`);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const inspiracoes = await executeQuery(`
      SELECT id, titulo, descricao, imagem, created_at, updated_at
      FROM inspiracoes 
      WHERE id = ?
    `, [id]);

    if (inspiracoes.length === 0) {
      console.log(`❌ Inspiração ID ${id} não encontrada`);
      return NextResponse.json(
        { error: 'Inspiração não encontrada' },
        { status: 404 }
      );
    }

    console.log(`✅ Inspiração encontrada: ${inspiracoes[0].titulo}`);
    return NextResponse.json(inspiracoes[0]);
  } catch (error) {
    console.error('❌ Erro ao buscar inspiração:', error);
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
    const { titulo, descricao, imagem } = body;

    console.log(`✏️ Atualizando inspiração ID: ${id}`, { titulo });

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    if (!titulo) {
      return NextResponse.json(
        { error: 'Título é obrigatório' },
        { status: 400 }
      );
    }

    const result = await executeUpdate(`
      UPDATE inspiracoes 
      SET titulo = ?, descricao = ?, imagem = ?, updated_at = NOW()
      WHERE id = ?
    `, [
      titulo,
      descricao || '',
      imagem || '',
      id
    ]);

    if (result.affectedRows === 0) {
      console.log(`❌ Inspiração ID ${id} não encontrada para atualização`);
      return NextResponse.json(
        { error: 'Inspiração não encontrada' },
        { status: 404 }
      );
    }

    console.log(`✅ Inspiração ID ${id} atualizada com sucesso`);
    return NextResponse.json({
      id,
      titulo,
      descricao: descricao || '',
      imagem: imagem || '',
      message: 'Inspiração atualizada com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar inspiração:', error);
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
    console.log(`🗑️ Deletando inspiração ID: ${id}`);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const result = await executeDelete(`
      DELETE FROM inspiracoes WHERE id = ?
    `, [id]);

    if (result.affectedRows === 0) {
      console.log(`❌ Inspiração ID ${id} não encontrada para deleção`);
      return NextResponse.json(
        { error: 'Inspiração não encontrada' },
        { status: 404 }
      );
    }

    console.log(`✅ Inspiração ID ${id} deletada com sucesso`);
    return NextResponse.json({
      message: 'Inspiração deletada com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao deletar inspiração:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}