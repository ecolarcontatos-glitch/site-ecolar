import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const filePath = path.join(process.cwd(), 'data', 'posts.json');

// Função para garantir que o arquivo existe
function ensureFileExists() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
  }
}

export async function GET() {
  try {
    ensureFileExists();
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao ler posts:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureFileExists();
    const body = await request.json();
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    // Adicionar ID se não existir
    const novoPost = {
      ...body,
      id: body.id || Date.now().toString()
    };
    
    data.push(novoPost);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true, data: novoPost });
  } catch (error) {
    console.error('Erro ao criar post:', error);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    ensureFileExists();
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID é obrigatório' }, { status: 400 });
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const index = data.findIndex((item: any) => item.id === id);
    
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Post não encontrado' }, { status: 404 });
    }
    
    data[index] = { ...data[index], ...updateData };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true, data: data[index] });
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    ensureFileExists();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID é obrigatório' }, { status: 400 });
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const filteredData = data.filter((item: any) => item.id !== id);
    
    if (data.length === filteredData.length) {
      return NextResponse.json({ success: false, error: 'Post não encontrado' }, { status: 404 });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(filteredData, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 });
  }
}