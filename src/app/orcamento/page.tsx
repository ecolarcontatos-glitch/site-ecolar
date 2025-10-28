'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, MessageCircle, ShoppingCart, ArrowLeft } from 'lucide-react';
import { OrcamentoService, formatPrice } from '@/lib/orcamento';
import { ItemOrcamento } from '@/lib/types';
import { config } from '@/lib/data';

export default function OrcamentoPage() {
  const [itens, setItens] = useState<ItemOrcamento[]>([]);
  const [observacoes, setObservacoes] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadItens = () => {
      const itensOrcamento = OrcamentoService.getItens();
      setItens(itensOrcamento);
      setIsLoading(false);
    };

    loadItens();
    
    // Atualizar quando localStorage mudar
    const handleStorageChange = () => loadItens();
    window.addEventListener('storage', handleStorageChange);
    
    // Verificar mudanças periodicamente
    const interval = setInterval(loadItens, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
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

  const alterarModalidade = (produtoId: string, modalidadeAtual: 'fabrica' | 'pronta_entrega', novaModalidade: 'fabrica' | 'pronta_entrega') => {
    OrcamentoService.atualizarModalidade(produtoId, modalidadeAtual, novaModalidade);
    setItens(OrcamentoService.getItens());
  };

  const limparOrcamento = () => {
    OrcamentoService.limparOrcamento();
    setItens([]);
  };

  const finalizarOrcamento = () => {
    const link = OrcamentoService.gerarLinkWhatsApp(config.whatsapp, observacoes);
    window.open(link, '_blank');
  };

  const total = OrcamentoService.getTotal();

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
              Seu Orçamento
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
                      Itens do Orçamento ({itens.length})
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
                  {itens.map((item, index) => {
                    // Proteção contra imagens undefined - usar imagem ou fallback
                    const imagemSrc = (item.produto.imagens && item.produto.imagens.length > 0) 
                      ? item.produto.imagens[0] 
                      : (item.produto.imagem || '/placeholder.webp');

                    return (
                      <div key={`${item.produto.id}-${item.modalidade}`} className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Imagem do Produto */}
                          <div className="relative w-full md:w-24 h-24 flex-shrink-0">
                            <Image
                              src={imagemSrc}
                              alt={item.produto.nome}
                              fill
                              className="object-cover rounded-xl"
                            />
                          </div>

                          {/* Detalhes do Produto */}
                          <div className="flex-1">
                            <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2">
                              {item.produto.nome}
                            </h3>
                            
                            {/* Modalidade */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              <button
                                onClick={() => alterarModalidade(item.produto.id, item.modalidade, 'fabrica')}
                                className={`px-3 py-1 rounded-lg text-sm font-inter font-medium transition-colors ${
                                  item.modalidade === 'fabrica'
                                    ? 'bg-[#7FBA3D] text-white'
                                    : 'bg-[#f1f5f9] text-[#6b7280] hover:bg-[#e5e7eb]'
                                }`}
                              >
                                Fábrica - {formatPrice(item.produto.preco_fabrica)}
                              </button>
                              {item.produto.pronta_entrega_disponivel && item.produto.preco_pronta_entrega && (
                                <button
                                  onClick={() => alterarModalidade(item.produto.id, item.modalidade, 'pronta_entrega')}
                                  className={`px-3 py-1 rounded-lg text-sm font-inter font-medium transition-colors ${
                                    item.modalidade === 'pronta_entrega'
                                      ? 'bg-[#C05A2B] text-white'
                                      : 'bg-[#f1f5f9] text-[#6b7280] hover:bg-[#e5e7eb]'
                                  }`}
                                >
                                  Pronta Entrega - {formatPrice(item.produto.preco_pronta_entrega)}
                                </button>
                              )}
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

                              {/* Preço e Remover */}
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <div className="font-inter font-semibold text-[#111827] text-lg">
                                    {formatPrice(item.preco_unitario * item.quantidade)}
                                  </div>
                                  <div className="text-sm text-[#6b7280] font-inter">
                                    {formatPrice(item.preco_unitario)} cada
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

            {/* Resumo */}
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
                    <span className="font-inter font-bold text-[#111827] text-2xl">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Observações */}
                <div className="mb-6">
                  <label className="block font-inter font-medium text-[#111827] mb-2">
                    Cidade/Observações (opcional)
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
                  <span>Fechar orçamento pelo WhatsApp</span>
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