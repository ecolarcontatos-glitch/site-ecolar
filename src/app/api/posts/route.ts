import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeInsert, executeUpdate, executeDelete } from '@/lib/db';

export async function GET() {
  try {
    console.log('📋 Listando posts...');
    
    const posts = await executeQuery(`
      SELECT id, titulo, descricao, resumo, imagem, autor, data_publicacao, status, created_at, updated_at
      FROM posts 
      ORDER BY data_publicacao DESC
    `);

    console.log(`✅ ${posts.length} posts encontrados`);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('❌ Erro ao listar posts:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titulo, descricao, resumo, imagem, autor, data_publicacao, status } = body;

    console.log('➕ Criando post:', { titulo, autor });

    if (!titulo || !descricao) {
      return NextResponse.json(
        { error: 'Título e descrição são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await executeInsert(`
      INSERT INTO posts (titulo, descricao, resumo, imagem, autor, data_publicacao, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      titulo,
      descricao,
      resumo || '',
      imagem || '',
      autor || 'Admin',
      data_publicacao || new Date().toISOString(),
      status || 'publicado'
    ]);

    console.log(`✅ Post criado com ID: ${result.insertId}`);

    return NextResponse.json(
      { 
        id: result.insertId,
        titulo,
        descricao,
        resumo: resumo || '',
        imagem: imagem || '',
        autor: autor || 'Admin',
        data_publicacao: data_publicacao || new Date().toISOString(),
        status: status || 'publicado',
        message: 'Post criado com sucesso'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Erro ao criar post:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, titulo, descricao, resumo, imagem, autor, data_publicacao, status } = body;

    console.log(`✏️ Atualizando post ID: ${id}`, { titulo });

    if (!id || !titulo || !descricao) {
      return NextResponse.json(
        { error: 'ID, título e descrição são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await executeUpdate(`
      UPDATE posts 
      SET titulo = ?, descricao = ?, resumo = ?, imagem = ?, autor = ?, 
          data_publicacao = ?, status = ?, updated_at = NOW()
      WHERE id = ?
    `, [
      titulo,
      descricao,
      resumo || '',
      imagem || '',
      autor || 'Admin',
      data_publicacao || new Date().toISOString(),
      status || 'publicado',
      id
    ]);

    if (result.affectedRows === 0) {
      console.log(`❌ Post ID ${id} não encontrado para atualização`);
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      );
    }

    console.log(`✅ Post ID ${id} atualizado com sucesso`);
    return NextResponse.json({
      id,
      titulo,
      descricao,
      resumo: resumo || '',
      imagem: imagem || '',
      autor: autor || 'Admin',
      data_publicacao: data_publicacao || new Date().toISOString(),
      status: status || 'publicado',
      message: 'Post atualizado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar post:', error);
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

    console.log(`🗑️ Deletando post ID: ${id}`);

    if (isNaN(id) || id <= 0) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const result = await executeDelete(`
      DELETE FROM posts WHERE id = ?
    `, [id]);

    if (result.affectedRows === 0) {
      console.log(`❌ Post ID ${id} não encontrado para deleção`);
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      );
    }

    console.log(`✅ Post ID ${id} deletado com sucesso`);
    return NextResponse.json({
      message: 'Post deletado com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao deletar post:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}