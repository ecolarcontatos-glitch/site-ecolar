import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeInsert, executeUpdate, executeDelete } from '@/lib/db';

export async function GET() {
  try {
    console.log('📋 Listando inspirações...');
    
    const inspiracoes = await executeQuery(`
      SELECT id, titulo, descricao, imagem, created_at, updated_at
      FROM inspiracoes 
      ORDER BY created_at DESC
    `);

    console.log(`✅ ${inspiracoes.length} inspirações encontradas`);
    return NextResponse.json(inspiracoes);
  } catch (error) {
    console.error('❌ Erro ao listar inspirações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titulo, descricao, imagem } = body;

    console.log('➕ Criando inspiração:', { titulo });

    if (!titulo) {
      return NextResponse.json(
        { error: 'Título é obrigatório' },
        { status: 400 }
      );
    }

    const result = await executeInsert(`
      INSERT INTO inspiracoes (titulo, descricao, imagem, created_at, updated_at)
      VALUES (?, ?, ?, NOW(), NOW())
    `, [
      titulo,
      descricao || '',
      imagem || ''
    ]);

    console.log(`✅ Inspiração criada com ID: ${result.insertId}`);

    return NextResponse.json(
      { 
        id: result.insertId,
        titulo,
        descricao: descricao || '',
        imagem: imagem || '',
        message: 'Inspiração criada com sucesso'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Erro ao criar inspiração:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, titulo, descricao, imagem } = body;

    console.log(`✏️ Atualizando inspiração ID: ${id}`, { titulo });

    if (!id || !titulo) {
      return NextResponse.json(
        { error: 'ID e título são obrigatórios' },
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    console.log(`🗑️ Deletando inspiração ID: ${id}`);

    if (isNaN(id) || id <= 0) {
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