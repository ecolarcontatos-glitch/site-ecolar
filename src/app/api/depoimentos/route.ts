import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeInsert, executeUpdate, executeDelete } from '@/lib/db';

export async function GET() {
  try {
    console.log('📋 Listando depoimentos...');
    
    const depoimentos = await executeQuery(`
      SELECT id, nome, comentario, imagem, foto, data, created_at, updated_at
      FROM depoimentos 
      ORDER BY data DESC
    `);

    console.log(`✅ ${depoimentos.length} depoimentos encontrados`);
    return NextResponse.json(depoimentos);
  } catch (error) {
    console.error('❌ Erro ao listar depoimentos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, comentario, imagem, foto, data } = body;

    console.log('➕ Criando depoimento:', { nome });

    if (!nome || !comentario) {
      return NextResponse.json(
        { error: 'Nome e comentário são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await executeInsert(`
      INSERT INTO depoimentos (nome, comentario, imagem, foto, data, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      nome,
      comentario,
      imagem || '',
      foto || '',
      data || new Date().toISOString()
    ]);

    console.log(`✅ Depoimento criado com ID: ${result.insertId}`);

    return NextResponse.json(
      { 
        id: result.insertId,
        nome,
        comentario,
        imagem: imagem || '',
        foto: foto || '',
        data: data || new Date().toISOString(),
        message: 'Depoimento criado com sucesso'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Erro ao criar depoimento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, nome, comentario, imagem, foto, data } = body;

    console.log(`✏️ Atualizando depoimento ID: ${id}`, { nome });

    if (!id || !nome || !comentario) {
      return NextResponse.json(
        { error: 'ID, nome e comentário são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await executeUpdate(`
      UPDATE depoimentos 
      SET nome = ?, comentario = ?, imagem = ?, foto = ?, data = ?, updated_at = NOW()
      WHERE id = ?
    `, [
      nome,
      comentario,
      imagem || '',
      foto || '',
      data || new Date().toISOString(),
      id
    ]);

    if (result.affectedRows === 0) {
      console.log(`❌ Depoimento ID ${id} não encontrado para atualização`);
      return NextResponse.json(
        { error: 'Depoimento não encontrado' },
        { status: 404 }
      );
    }

    console.log(`✅ Depoimento ID ${id} atualizado com sucesso`);
    return NextResponse.json({
      id,
      nome,
      comentario,
      imagem: imagem || '',
      foto: foto || '',
      data: data || new Date().toISOString(),
      message: 'Depoimento atualizado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar depoimento:', error);
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

    console.log(`🗑️ Deletando depoimento ID: ${id}`);

    if (isNaN(id) || id <= 0) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const result = await executeDelete(`
      DELETE FROM depoimentos WHERE id = ?
    `, [id]);

    if (result.affectedRows === 0) {
      console.log(`❌ Depoimento ID ${id} não encontrado para deleção`);
      return NextResponse.json(
        { error: 'Depoimento não encontrado' },
        { status: 404 }
      );
    }

    console.log(`✅ Depoimento ID ${id} deletado com sucesso`);
    return NextResponse.json({
      message: 'Depoimento deletado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao deletar depoimento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}