import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const config = await request.json();
    
    // Aqui você salvaria as configurações em um banco de dados ou arquivo
    // Por enquanto, vamos simular o salvamento
    console.log('Configurações recebidas:', config);
    
    // Simular delay de salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({ success: true, message: 'Configurações salvas com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}