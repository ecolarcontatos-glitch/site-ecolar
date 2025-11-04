import { Produto } from '@/contexts/DataContext';

export interface ItemOrcamento {
  produto: Produto;
  quantidade: number;
}

export const formatPrice = (value: number): string => {
  const numericValue = Number(value) || 0;
  return `R$ ${numericValue.toFixed(2).replace('.', ',')}`;
};

export const calcularOrcamento = (itens: ItemOrcamento[]) => {
  let total = 0;
  const detalhes: string[] = [];

  itens.forEach(item => {
    const preco = Number(item.produto.preco) || 0;
    const desconto = Number(item.produto.desconto) || 0;
    
    // Calcular preço unitário com desconto
    const precoUnitario = preco * (1 - desconto / 100);
    const subtotal = precoUnitario * item.quantidade;
    
    total += subtotal;
    
    detalhes.push(`${item.produto.nome} - Qtd: ${item.quantidade} - R$ ${subtotal.toFixed(2)}`);
  });

  return {
    total,
    detalhes,
    formatado: `R$ ${total.toFixed(2)}`
  };
};

export const gerarMensagemWhatsApp = (itens: ItemOrcamento[], dadosCliente?: {
  nome?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
}) => {
  let mensagem = '*Solicitação de Orçamento - ECOLAR*%0A%0A';
  
  if (dadosCliente?.nome) {
    mensagem += `*Cliente:* ${dadosCliente.nome}%0A`;
  }
  if (dadosCliente?.telefone) {
    mensagem += `*Telefone:* ${dadosCliente.telefone}%0A`;
  }
  if (dadosCliente?.email) {
    mensagem += `*Email:* ${dadosCliente.email}%0A`;
  }
  if (dadosCliente?.endereco) {
    mensagem += `*Endereço:* ${dadosCliente.endereco}%0A`;
  }
  
  mensagem += '%0A*Produtos solicitados:*%0A%0A';
  
  let total = 0;
  
  itens.forEach(item => {
    const preco = Number(item.produto.preco) || 0;
    const desconto = Number(item.produto.desconto) || 0;
    
    // Calcular preço unitário com desconto
    const precoUnitario = preco * (1 - desconto / 100);
    const subtotal = precoUnitario * item.quantidade;
    
    total += subtotal;
    
    mensagem += `*${item.produto.nome}*%0A`;
    mensagem += `  Qtd: ${item.quantidade} — Unit: R$ ${precoUnitario.toFixed(2)} — Sub: R$ ${subtotal.toFixed(2)}%0A%0A`;
  });
  
  mensagem += `*Total: R$ ${total.toFixed(2)}*%0A%0A`;
  mensagem += 'Aguardo retorno com disponibilidade e prazo de entrega.%0A%0A';
  mensagem += 'Obrigado!';
  
  return mensagem;
};