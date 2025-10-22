'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Produto } from '@/lib/types';
import { formatPrice, OrcamentoService } from '@/lib/orcamento';
import { ShoppingCart, Clock, Package } from 'lucide-react';

interface ProductCardProps {
  produto: Produto;
  onAddToCart?: () => void;
}

export default function ProductCard({ produto, onAddToCart }: ProductCardProps) {
  const [selectedModalidade, setSelectedModalidade] = useState<'fabrica' | 'pronta_entrega'>('fabrica');
  const [quantidade, setQuantidade] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const precoAtual = selectedModalidade === 'fabrica' 
    ? produto.preco_fabrica 
    : (produto.preco_pronta_entrega || produto.preco_fabrica);

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    OrcamentoService.adicionarItem({
      produto,
      modalidade: selectedModalidade,
      quantidade,
      preco_unitario: precoAtual
    });

    // Feedback visual
    setTimeout(() => {
      setIsAdding(false);
      onAddToCart?.();
    }, 500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden group">
      {/* Imagem */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={produto.imagens[0]}
          alt={produto.nome}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {produto.destaque && (
          <div className="absolute top-3 left-3 bg-[#C05A2B] text-white px-2 py-1 rounded-lg text-xs font-inter font-medium">
            Destaque
          </div>
        )}
        {produto.pronta_entrega_disponivel && (
          <div className="absolute top-3 right-3 bg-[#7FBA3D] text-white px-2 py-1 rounded-lg text-xs font-inter font-medium">
            Pronta Entrega
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2 line-clamp-2">
          {produto.nome}
        </h3>
        
        <p className="text-[#6b7280] font-inter text-sm mb-4 line-clamp-2">
          {produto.descricao_curta}
        </p>

        {/* Preços */}
        <div className="space-y-3 mb-4">
          {/* Preço Fábrica */}
          <div className="flex items-center justify-between p-3 bg-[#f1f5f9] rounded-xl">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#7FBA3D]" />
              <div>
                <div className="text-xs text-[#6b7280] font-inter">Fábrica — melhor preço</div>
                <div className="text-sm text-[#6b7280] font-inter">{produto.lead_time_fabrica}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-inter font-semibold text-[#111827]">
                {formatPrice(produto.preco_fabrica)}
              </div>
            </div>
          </div>

          {/* Preço Pronta Entrega */}
          {produto.pronta_entrega_disponivel && produto.preco_pronta_entrega && (
            <div className="flex items-center justify-between p-3 bg-[#f1f5f9] rounded-xl">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-[#C05A2B]" />
                <div>
                  <div className="text-xs text-[#6b7280] font-inter">Pronta entrega — para urgência</div>
                  <div className="text-sm text-[#6b7280] font-inter">
                    {produto.estoque_pronta_entrega ? `${produto.estoque_pronta_entrega} unidades` : 'Retirada imediata'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-inter font-semibold text-[#111827]">
                  {formatPrice(produto.preco_pronta_entrega)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Seleção de Modalidade */}
        <div className="mb-4">
          <div className="flex space-x-2 mb-3">
            <button
              onClick={() => setSelectedModalidade('fabrica')}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-inter font-medium transition-colors ${
                selectedModalidade === 'fabrica'
                  ? 'bg-[#7FBA3D] text-white'
                  : 'bg-[#f1f5f9] text-[#6b7280] hover:bg-[#e5e7eb]'
              }`}
            >
              Fábrica
            </button>
            {produto.pronta_entrega_disponivel && produto.preco_pronta_entrega && (
              <button
                onClick={() => setSelectedModalidade('pronta_entrega')}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-inter font-medium transition-colors ${
                  selectedModalidade === 'pronta_entrega'
                    ? 'bg-[#C05A2B] text-white'
                    : 'bg-[#f1f5f9] text-[#6b7280] hover:bg-[#e5e7eb]'
                }`}
              >
                Pronta Entrega
              </button>
            )}
          </div>

          {/* Quantidade */}
          <div className="flex items-center space-x-3 mb-4">
            <label className="text-sm font-inter font-medium text-[#111827]">
              Quantidade:
            </label>
            <input
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 px-3 py-2 border border-[#e5e7eb] rounded-xl text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent"
            />
          </div>

          {/* Preço Total */}
          <div className="flex items-center justify-between mb-4 p-3 bg-[#f5f6f7] rounded-xl">
            <span className="text-sm font-inter font-medium text-[#111827]">
              Total:
            </span>
            <span className="font-inter font-bold text-[#111827] text-lg">
              {formatPrice(precoAtual * quantidade)}
            </span>
          </div>
        </div>

        {/* Botão Adicionar */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl font-inter font-medium transition-all duration-200 ${
            isAdding
              ? 'bg-[#7FBA3D] text-white cursor-not-allowed'
              : 'bg-[#7FBA3D] text-white hover:bg-[#0A3D2E] hover:shadow-lg'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{isAdding ? 'Adicionando...' : 'Adicionar ao orçamento'}</span>
        </button>
      </div>
    </div>
  );
}