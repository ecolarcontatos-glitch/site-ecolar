// src/app/api/depoimentos/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeUpdate, executeDelete } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const depoimentos = await executeQuery(
      `
      SELECT id, nome, comentario, imagem, foto, data, created_at, updated_at 
      FROM depoimentos 
      WHERE id = ?
      `,
      [params.id]
    );

    if (depoimentos.length === 0) {
      return NextResponse.json({ error: 'Depoimento não encontrado' }, { status: 404 });
    }

    return NextResponse.json(depoimentos[0]);
  } catch (error) {
    console.error('Erro GET depoimento:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { nome, comentario, imagem, foto, data } = body;

    if (!nome || !comentario) {
      return NextResponse.json(
        { error: 'Nome e comentário são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await executeUpdate(
      `
      UPDATE depoimentos
      SET nome = ?, comentario = ?, imagem = ?, foto = ?, data = ?, updated_at = NOW()
      WHERE id = ?
      `,
      [
        nome,
        comentario,
        imagem || '',
        foto || '',
        data || new Date().toISOString(),
        params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Depoimento não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: params.id,
      nome,
      comentario,
      imagem: imagem || '',
      foto: foto || '',
      data: data || new Date().toISOString(),
      message: 'Depoimento atualizado com sucesso',
    });
  } catch (error) {
    console.error('Erro PUT depoimento:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await executeDelete(
      `
      DELETE FROM depoimentos WHERE id = ?
      `,
      [params.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Depoimento não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Depoimento deletado com sucesso' });
  } catch (error) {
    console.error('Erro DELETE depoimento:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
