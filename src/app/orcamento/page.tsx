'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, MessageCircle, ShoppingCart, ArrowLeft } from 'lucide-react';
import { formatPrice, OrcamentoService } from '@/lib/orcamento';
import { ItemOrcamento } from '@/lib/orcamento';
import { config } from '@/lib/data';

export default function OrcamentoPage() {
  const [itens, setItens] = useState<ItemOrcamento[]>([]);
  const [observacoes, setObservacoes] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadItens = () => {
      try {
        const itensOrcamento = OrcamentoService.getItens();
        setItens(itensOrcamento);
      } catch (error) {
        console.error('Erro ao carregar orçamento:', error);
        setItens([]);
      }
      setIsLoading(false);
    };

    loadItens();
    
    // Atualizar quando localStorage mudar
    const handleStorageChange = () => loadItens();
    const handleOrcamentoUpdate = () => loadItens();
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('orcamentoUpdated', handleOrcamentoUpdate);
    
    // Verificar mudanças periodicamente
    const interval = setInterval(loadItens, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('orcamentoUpdated', handleOrcamentoUpdate);
      clearInterval(interval);
    };
  }, []);

  const removerItem = (produtoId: string, modalidade: 'fabrica' | 'pronta_entrega') => {
    OrcamentoService.removerItem(produtoId, modalidade);
    setItens(OrcamentoService.getItens());
  };

  const atualizarQuantidade = (produtoId: string, modalidade: 'fabrica' | 'pronta_entrega', novaQuantidade: number) => {
    if (novaQuantidade < 1) return;
    
    OrcamentoService.atualizarQuantidade(produtoId, modalidade, novaQuantidade);
    setItens(OrcamentoService.getItens());
  };

  const limparOrcamento = () => {
    OrcamentoService.limparOrcamento();
    setItens([]);
  };

  const calcularPrecoFinal = (item: ItemOrcamento) => {
    // O preço já vem calculado com desconto no preco_unitario
    return item.preco_unitario;
  };

  const calcularTotal = () => {
    return OrcamentoService.getTotal();
  };

  const finalizarOrcamento = () => {
    const total = calcularTotal();
    const totalItens = OrcamentoService.getTotalItens();
    
    let mensagem = `🛒 *ORÇAMENTO ECOLAR*\n\n`;
    mensagem += `📋 *Itens (${totalItens}):*\n`;
    
    itens.forEach((item, index) => {
      const precoFinal = calcularPrecoFinal(item);
      const subtotal = precoFinal * item.quantidade;
      const modalidadeTexto = item.modalidade === 'fabrica' ? 'Fábrica' : 'Pronta Entrega';
      
      mensagem += `\n${index + 1}. *${item.produto.nome}*\n`;
      mensagem += `   Modalidade: ${modalidadeTexto}\n`;
      mensagem += `   Quantidade: ${item.quantidade}\n`;
      mensagem += `   Preço unitário: ${formatPrice(precoFinal)}\n`;
      mensagem += `   Subtotal: ${formatPrice(subtotal)}\n`;
    });
    
    mensagem += `\n💰 *TOTAL: ${formatPrice(total)}*\n`;
    
    if (observacoes.trim()) {
      mensagem += `\n📝 *Observações:*\n${observacoes}\n`;
    }
    
    mensagem += `\n---\n🌱 Orçamento gerado pelo site ECOLAR`;
    
    const link = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(mensagem)}`;
    window.open(link, '_blank');
  };

  const total = calcularTotal();
  const totalItens = OrcamentoService.getTotalItens();

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 md:py-12">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-2 border-[#7FBA3D] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="font-inter text-[#6b7280]">Carregando orçamento...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="max-w-[1200px] mx-auto px-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-inter font-bold text-3xl md:text-4xl text-[#111827] mb-2">
              Itens do Orçamento ({totalItens})
            </h1>
            <p className="font-inter text-lg text-[#6b7280]">
              Revise os itens e finalize pelo WhatsApp
            </p>
          </div>
          <Link
            href="/produtos"
            className="flex items-center space-x-2 text-[#7FBA3D] hover:text-[#0A3D2E] font-inter font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continuar comprando</span>
          </Link>
        </div>

        {itens.length === 0 ? (
          /* Orçamento Vazio */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[#f1f5f9] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-[#6b7280]" />
            </div>
            <h3 className="font-inter font-semibold text-[#111827] text-xl mb-2">
              Seu orçamento está vazio
            </h3>
            <p className="font-inter text-[#6b7280] mb-6">
              Adicione produtos para começar seu orçamento
            </p>
            <Link
              href="/produtos"
              className="inline-flex items-center space-x-2 bg-[#7FBA3D] text-white px-6 py-3 rounded-2xl hover:bg-[#0A3D2E] transition-colors duration-200 font-inter font-medium"
            >
              <span>Ver produtos</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de Itens */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
                <div className="p-6 border-b border-[#f1f5f9]">
                  <div className="flex items-center justify-between">
                    <h2 className="font-inter font-semibold text-[#111827] text-xl">
                      Produtos Selecionados
                    </h2>
                    <button
                      onClick={limparOrcamento}
                      className="text-[#C05A2B] hover:text-red-600 font-inter font-medium text-sm"
                    >
                      Limpar tudo
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-[#f1f5f9]">
                  {itens.map((item) => {
                    const precoFinal = calcularPrecoFinal(item);
                    const imagemSrc = item.produto.imagem || '/placeholder.webp';
                    const modalidadeTexto = item.modalidade === 'fabrica' ? 'Fábrica' : 'Pronta Entrega';
                    const subtotal = precoFinal * item.quantidade;

                    return (
                      <div key={`${item.produto.id}-${item.modalidade}`} className="p-6">
                        <div className="flex gap-4">
                          {/* Imagem do Produto */}
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <Image
                              src={imagemSrc}
                              alt={item.produto.nome}
                              fill
                              className="object-cover rounded-xl"
                            />
                          </div>

                          {/* Detalhes do Produto */}
                          <div className="flex-1">
                            <h3 className="font-inter font-semibold text-[#111827] text-lg mb-1">
                              {item.produto.nome}
                            </h3>
                            
                            {/* Modalidade */}
                            <div className="mb-2">
                              <span className="inline-block bg-[#f1f5f9] text-[#6b7280] px-2 py-1 rounded-lg text-xs font-inter font-medium">
                                {modalidadeTexto}
                              </span>
                            </div>
                            
                            {/* Preço */}
                            <div className="mb-4">
                              <span className="font-inter font-bold text-[#111827] text-lg">
                                {formatPrice(precoFinal)}
                              </span>
                              <span className="text-[#6b7280] text-sm font-inter ml-1">
                                por unidade
                              </span>
                            </div>

                            {/* Controles */}
                            <div className="flex items-center justify-between">
                              {/* Quantidade */}
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => atualizarQuantidade(item.produto.id, item.modalidade, item.quantidade - 1)}
                                  className="w-8 h-8 bg-[#f1f5f9] rounded-lg flex items-center justify-center hover:bg-[#e5e7eb] transition-colors"
                                >
                                  <Minus className="w-4 h-4 text-[#6b7280]" />
                                </button>
                                <span className="font-inter font-medium text-[#111827] min-w-[2rem] text-center">
                                  {item.quantidade}
                                </span>
                                <button
                                  onClick={() => atualizarQuantidade(item.produto.id, item.modalidade, item.quantidade + 1)}
                                  className="w-8 h-8 bg-[#f1f5f9] rounded-lg flex items-center justify-center hover:bg-[#e5e7eb] transition-colors"
                                >
                                  <Plus className="w-4 h-4 text-[#6b7280]" />
                                </button>
                              </div>

                              {/* Subtotal e Remover */}
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <div className="font-inter font-semibold text-[#111827] text-lg">
                                    {formatPrice(subtotal)}
                                  </div>
                                </div>
                                <button
                                  onClick={() => removerItem(item.produto.id, item.modalidade)}
                                  className="w-8 h-8 text-[#C05A2B] hover:text-red-600 flex items-center justify-center"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Resumo do Orçamento */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 sticky top-24">
                <h2 className="font-inter font-semibold text-[#111827] text-xl mb-6">
                  Resumo do Orçamento
                </h2>

                {/* Total */}
                <div className="border-t border-[#f1f5f9] pt-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-inter font-semibold text-[#111827] text-lg">
                      Total:
                    </span>
                    <span className="font-inter font-bold text-[#7FBA3D] text-2xl">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Observações */}
                <div className="mb-6">
                  <label className="block font-inter font-medium text-[#111827] mb-2">
                    Observações (opcional)
                  </label>
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Ex: São Paulo - SP, entrega urgente..."
                    rows={3}
                    className="w-full px-4 py-3 border border-[#e5e7eb] rounded-xl font-inter focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent resize-none"
                  />
                </div>

                {/* Botão Finalizar */}
                <button
                  onClick={finalizarOrcamento}
                  className="w-full flex items-center justify-center space-x-2 bg-[#7FBA3D] text-white py-4 rounded-2xl hover:bg-[#0A3D2E] transition-colors duration-200 font-inter font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Enviar Orçamento via WhatsApp</span>
                </button>

                <p className="text-xs text-[#6b7280] font-inter text-center mt-3">
                  Você será redirecionado para o WhatsApp com o orçamento completo
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}