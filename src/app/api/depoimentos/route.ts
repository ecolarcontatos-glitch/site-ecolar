import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeInsert } from '@/lib/db';

export async function GET() {
  try {
    const depoimentos = await executeQuery(`
     SELECT id, nome, comentario, estrelas, imagem, foto, data, created_at, updated_at
      FROM depoimentos 
      ORDER BY data DESC
    `);

    return NextResponse.json(depoimentos);
  } catch (error) {
    console.error('Erro ao listar depoimentos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, comentario, estrelas, foto, imagem, data } = body;

    if (!nome || !comentario) {
      return NextResponse.json(
        { error: 'Nome e comentário são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await executeInsert(`
      INSERT INTO depoimentos (nome, comentario, estrelas, imagem, foto, data, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      nome,
      comentario,
      estrelas ?? 5,
      imagem || '',
      foto || '',
      data || new Date().toISOString()
    ]);

    return NextResponse.json(
      {
        id: result.insertId,
        nome,
        comentario,
        estrelas: estrelas ?? 5,   // 👈 ADICIONE ESTA LINHA
        imagem: imagem || '',
        foto: foto || '',
        data: data || new Date().toISOString(),
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro ao criar depoimento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
