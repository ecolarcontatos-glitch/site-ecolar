import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeUpdate, executeDelete, testConnection } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const id = parseInt(params.id);
    console.log(`📋 Buscando produto ID: ${id} no MySQL`);

    if (isNaN(id)) {
      console.error('❌ ID inválido fornecido:', params.id);
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const produtos = await executeQuery(`
      SELECT 
        p.id, p.nome, p.categoria_id, p.descricao, p.preco, p.desconto, 
        p.imagem, p.destaque, p.disponivel, p.unidade, p.created_at, p.updated_at,
        c.nome as categoria_nome, c.slug as categoria_slug
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = ?
    `, [id]);

    console.log(`🔍 Query executada para produto ID ${id}, resultados:`, produtos.length);

    if (produtos.length === 0) {
      console.log(`❌ Produto ID ${id} não encontrado no MySQL`);
      
      // Debug: verificar se existem produtos na tabela
      const totalProdutos = await executeQuery('SELECT COUNT(*) as total FROM produtos');
      console.log(`📊 Total de produtos na tabela: ${totalProdutos[0]?.total || 0}`);
      
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    const produto = produtos[0];
    console.log(`✅ Produto encontrado no MySQL:`, {
      id: produto.id,
      nome: produto.nome,
      categoria_id: produto.categoria_id,
      categoria_nome: produto.categoria_nome
    });

    return NextResponse.json(produto);
  } catch (error) {
    console.error('❌ Erro ao buscar produto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const id = parseInt(params.id);
    const body = await request.json();
    const { 
      nome, categoria_id, descricao, preco, desconto, 
      imagem, destaque, disponivel, unidade 
    } = body;

    console.log(`✏️ Atualizando produto ID: ${id} no MySQL`, { 
      nome, 
      categoria_id: categoria_id,
      categoria_id_type: typeof categoria_id,
      unidade 
    });

    if (isNaN(id)) {
      console.error('❌ ID inválido fornecido:', params.id);
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    if (!nome || !categoria_id) {
      console.error('❌ Dados obrigatórios faltando:', { nome: !!nome, categoria_id: !!categoria_id });
      return NextResponse.json(
        { error: 'Nome e categoria são obrigatórios' },
        { status: 400 }
      );
    }

    // Converter categoria_id para número se necessário
    const categoriaIdNumero = parseInt(categoria_id.toString());
    if (isNaN(categoriaIdNumero)) {
      console.error('❌ categoria_id inválido:', categoria_id);
      return NextResponse.json(
        { error: 'ID da categoria deve ser um número válido' },
        { status: 400 }
      );
    }

    // Verificar se a categoria existe
    const categoriaExiste = await executeQuery(
      'SELECT id FROM categorias WHERE id = ?', 
      [categoriaIdNumero]
    );
    
    if (categoriaExiste.length === 0) {
      console.error('❌ Categoria não encontrada:', categoriaIdNumero);
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 400 }
      );
    }

    const result = await executeUpdate(`
      UPDATE produtos 
      SET nome = ?, categoria_id = ?, descricao = ?, preco = ?, desconto = ?, 
          imagem = ?, destaque = ?, disponivel = ?, unidade = ?, updated_at = NOW()
      WHERE id = ?
    `, [
      nome,
      categoriaIdNumero, // Usar o número convertido
      descricao || '',
      preco || 0,
      desconto || 0,
      imagem || '',
      destaque ? 1 : 0,
      disponivel !== false ? 1 : 0,
      unidade || 'unidade',
      id
    ]);

    if (result.affectedRows === 0) {
      console.log(`❌ Produto ID ${id} não encontrado para atualização no MySQL`);
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    console.log(`✅ Produto ID ${id} atualizado com sucesso no MySQL`);
    
    // Verificar se o produto foi realmente atualizado com JOIN para pegar categoria
    const produtoAtualizado = await executeQuery(`
      SELECT 
        p.*, 
        c.nome as categoria_nome 
      FROM produtos p 
      LEFT JOIN categorias c ON p.categoria_id = c.id 
      WHERE p.id = ?
    `, [id]);
    
    if (produtoAtualizado.length > 0) {
      console.log('✅ Confirmado: produto atualizado no banco:', {
        id: produtoAtualizado[0].id,
        nome: produtoAtualizado[0].nome,
        categoria_id: produtoAtualizado[0].categoria_id,
        categoria_nome: produtoAtualizado[0].categoria_nome
      });
    }

    return NextResponse.json({
      id,
      nome,
      categoria_id: categoriaIdNumero,
      descricao: descricao || '',
      preco: preco || 0,
      desconto: desconto || 0,
      imagem: imagem || '',
      destaque: destaque ? 1 : 0,
      disponivel: disponivel !== false ? 1 : 0,
      unidade: unidade || 'unidade',
      message: 'Produto atualizado com sucesso no MySQL'
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar produto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const id = parseInt(params.id);
    console.log(`🗑️ Deletando produto ID: ${id} do MySQL`);

    if (isNaN(id)) {
      console.error('❌ ID inválido fornecido:', params.id);
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const result = await executeDelete(`
      DELETE FROM produtos WHERE id = ?
    `, [id]);

    if (result.affectedRows === 0) {
      console.log(`❌ Produto ID ${id} não encontrado para deleção no MySQL`);
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    console.log(`✅ Produto ID ${id} deletado com sucesso do MySQL`);
    return NextResponse.json({
      message: 'Produto deletado com sucesso do MySQL'
    });
  } catch (error) {
    console.error('❌ Erro ao deletar produto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}