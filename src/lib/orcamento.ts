import { Produto } from '@/contexts/DataContext';

export interface ItemOrcamento {
  produto: Produto;
  quantidade: number;
  modalidade: 'fabrica' | 'pronta_entrega';
  preco_unitario: number;
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

// Classe OrcamentoService que estava sendo importada
export class OrcamentoService {
  private static readonly STORAGE_KEY = 'ecolar_orcamento';

  static getItens(): ItemOrcamento[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static adicionarItem(produto: Produto, modalidade: 'fabrica' | 'pronta_entrega' = 'pronta_entrega', quantidade: number = 1) {
    const itens = this.getItens();
    
    // Calcular preço unitário com desconto
    const precoOriginal = Number(produto.preco) || 0;
    const desconto = Number(produto.desconto) || 0;
    const precoUnitario = precoOriginal * (1 - desconto / 100);
    
    // Verificar se item já existe
    const itemExistente = itens.find(item => 
      item.produto.id === produto.id && item.modalidade === modalidade
    );

    if (itemExistente) {
      itemExistente.quantidade += quantidade;
    } else {
      itens.push({
        produto,
        quantidade,
        modalidade,
        preco_unitario: precoUnitario
      });
    }

    this.salvarItens(itens);
  }

  static removerItem(produtoId: string, modalidade: 'fabrica' | 'pronta_entrega') {
    const itens = this.getItens().filter(item => 
      !(item.produto.id === produtoId && item.modalidade === modalidade)
    );
    this.salvarItens(itens);
  }

  static atualizarQuantidade(produtoId: string, modalidade: 'fabrica' | 'pronta_entrega', novaQuantidade: number) {
    const itens = this.getItens();
    const item = itens.find(item => 
      item.produto.id === produtoId && item.modalidade === modalidade
    );

    if (item) {
      item.quantidade = Math.max(1, novaQuantidade);
      this.salvarItens(itens);
    }
  }

  static atualizarModalidade(produtoId: string, modalidadeAtual: 'fabrica' | 'pronta_entrega', novaModalidade: 'fabrica' | 'pronta_entrega') {
    const itens = this.getItens();
    const itemIndex = itens.findIndex(item => 
      item.produto.id === produtoId && item.modalidade === modalidadeAtual
    );

    if (itemIndex !== -1) {
      const item = itens[itemIndex];
      
      // Recalcular preço com desconto
      const precoOriginal = Number(item.produto.preco) || 0;
      const desconto = Number(item.produto.desconto) || 0;
      const novoPrecoUnitario = precoOriginal * (1 - desconto / 100);

      // Verificar se já existe item com a nova modalidade
      const itemExistente = itens.find(item => 
        item.produto.id === produtoId && item.modalidade === novaModalidade
      );

      if (itemExistente) {
        // Somar quantidades
        itemExistente.quantidade += item.quantidade;
        // Remover item antigo
        itens.splice(itemIndex, 1);
      } else {
        // Atualizar modalidade e preço
        item.modalidade = novaModalidade;
        item.preco_unitario = novoPrecoUnitario;
      }

      this.salvarItens(itens);
    }
  }

  static getTotal(): number {
    const itens = this.getItens();
    return itens.reduce((total, item) => {
      return total + (item.preco_unitario * item.quantidade);
    }, 0);
  }

  static getTotalItens(): number {
    const itens = this.getItens();
    return itens.reduce((total, item) => total + item.quantidade, 0);
  }

  static limparOrcamento() {
    this.salvarItens([]);
  }

  static gerarLinkWhatsApp(numeroWhatsApp: string, observacoes?: string): string {
    const itens = this.getItens();
    let mensagem = '*Solicitação de Orçamento - ECOLAR*%0A%0A';
    
    mensagem += '*Produtos solicitados:*%0A%0A';
    
    let total = 0;
    
    itens.forEach(item => {
      const subtotal = item.preco_unitario * item.quantidade;
      total += subtotal;
      
      const modalidadeTexto = item.modalidade === 'fabrica' ? 'Fábrica' : 'Pronta Entrega';
      
      mensagem += `*${item.produto.nome}*%0A`;
      mensagem += `  Modalidade: ${modalidadeTexto}%0A`;
      mensagem += `  Qtd: ${item.quantidade} — Unit: R$ ${item.preco_unitario.toFixed(2)} — Sub: R$ ${subtotal.toFixed(2)}%0A%0A`;
    });
    
    mensagem += `*Total: R$ ${total.toFixed(2)}*%0A%0A`;
    
    if (observacoes?.trim()) {
      mensagem += `*Observações:* ${observacoes.trim()}%0A%0A`;
    }
    
    mensagem += 'Aguardo retorno com disponibilidade e prazo de entrega.%0A%0A';
    mensagem += 'Obrigado!';
    
    return `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;
  }

  private static salvarItens(itens: ItemOrcamento[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(itens));
      
      // Disparar evento customizado para atualizar contador
      window.dispatchEvent(new CustomEvent('orcamentoUpdated'));
    }
  }
}