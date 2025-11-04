import { ItemOrcamento } from './types';

export class OrcamentoService {
  private static STORAGE_KEY = 'ecolar_orcamento';

  static getItens(): ItemOrcamento[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static adicionarItem(item: ItemOrcamento): void {
    if (typeof window === 'undefined') return;
    
    const itens = this.getItens();
    const existingIndex = itens.findIndex(
      i => i.produto.id === item.produto.id && i.modalidade === item.modalidade
    );

    if (existingIndex >= 0) {
      itens[existingIndex].quantidade += item.quantidade;
    } else {
      itens.push(item);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(itens));
  }

  static removerItem(produtoId: string, modalidade: 'fabrica' | 'pronta_entrega'): void {
    if (typeof window === 'undefined') return;
    
    const itens = this.getItens().filter(
      item => !(item.produto.id === produtoId && item.modalidade === modalidade)
    );
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(itens));
  }

  static atualizarQuantidade(produtoId: string, modalidade: 'fabrica' | 'pronta_entrega', quantidade: number): void {
    if (typeof window === 'undefined') return;
    
    const itens = this.getItens();
    const item = itens.find(i => i.produto.id === produtoId && i.modalidade === modalidade);
    
    if (item) {
      item.quantidade = quantidade;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(itens));
    }
  }

  static atualizarModalidade(produtoId: string, modalidadeAtual: 'fabrica' | 'pronta_entrega', novaModalidade: 'fabrica' | 'pronta_entrega'): void {
    if (typeof window === 'undefined') return;
    
    const itens = this.getItens();
    const item = itens.find(i => i.produto.id === produtoId && i.modalidade === modalidadeAtual);
    
    if (item) {
      item.modalidade = novaModalidade;
      item.preco_unitario = novaModalidade === 'fabrica' 
        ? item.produto.preco_fabrica 
        : (item.produto.preco_pronta_entrega || item.produto.preco_fabrica);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(itens));
    }
  }

  static limparOrcamento(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static getTotal(): number {
    return this.getItens().reduce((total, item) => {
      const precoUnitario = typeof item.preco_unitario === 'number' ? item.preco_unitario : 0;
      const quantidade = typeof item.quantidade === 'number' ? item.quantidade : 0;
      return total + (precoUnitario * quantidade);
    }, 0);
  }

  static gerarLinkWhatsApp(whatsappNumber: string, observacoes?: string): string {
    const itens = this.getItens();
    const total = this.getTotal();
    
    let mensagem = 'Olá! Quero orçamento:%0A%0A';
    
    itens.forEach(item => {
      const modalidadeTexto = item.modalidade === 'fabrica' ? 'Fábrica' : 'Pronta Entrega';
      const precoUnitario = typeof item.preco_unitario === 'number' ? item.preco_unitario : 0;
      const quantidade = typeof item.quantidade === 'number' ? item.quantidade : 0;
      const subtotal = precoUnitario * quantidade;
      
      mensagem += `- ${item.produto.nome}%0A`;
      mensagem += `  Modalidade: ${modalidadeTexto}%0A`;
      mensagem += `  Qtd: ${quantidade} — Unit: R$ ${precoUnitario.toFixed(2)} — Sub: R$ ${subtotal.toFixed(2)}%0A%0A`;
    });
    
    mensagem += `*Total: R$ ${total.toFixed(2)}*%0A%0A`;
    
    if (observacoes) {
      mensagem += `Observações: ${observacoes}%0A%0A`;
    }
    
    mensagem += 'Aguardo retorno!';
    
    return `https://wa.me/${whatsappNumber}?text=${mensagem}`;
  }
}

export const formatPrice = (price: number | undefined | null): string => {
  const validPrice = typeof price === 'number' ? price : 0;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(validPrice);
};