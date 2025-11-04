'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Produto } from '@/lib/types';
import { formatPrice, OrcamentoService } from '@/lib/orcamento';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  produto: Produto;
  onAddToCart?: () => void;
}

export default function ProductCard({ produto, onAddToCart }: ProductCardProps) {
  const [quantidade, setQuantidade] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Calcular preço com desconto
  const precoOriginal = produto.preco;
  const temDesconto = produto.desconto && produto.desconto > 0;
  const precoComDesconto = temDesconto 
    ? precoOriginal * (1 - produto.desconto! / 100)
    : precoOriginal;
  
  const precoFinal = precoComDesconto;

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    OrcamentoService.adicionarItem({
      produto,
      modalidade: 'fabrica', // Modalidade única agora
      quantidade,
      preco_unitario: precoFinal
    });

    // Feedback visual
    setTimeout(() => {
      setIsAdding(false);
      onAddToCart?.();
    }, 500);
  };

  // Proteção contra imagem undefined - compatibilidade entre painel e site
  const imagemSrc = produto.imagem || '/placeholder.webp';

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:scale-[1.02] transition-all duration-300 overflow-hidden group">
      {/* Imagem */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imagemSrc}
          alt={produto.nome}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {produto.destaque && (
          <div className="absolute top-3 left-3 bg-[#C05A2B] text-white px-3 py-1 rounded-full text-xs font-inter font-semibold">
            Destaque
          </div>
        )}
        {temDesconto && (
          <div className="absolute top-3 right-3 bg-[#7FBA3D] text-white px-3 py-1 rounded-full text-xs font-inter font-semibold">
            -{produto.desconto}%
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-5">
        <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2 line-clamp-2 text-center">
          {produto.nome}
        </h3>
        
        <p className="text-[#6b7280] font-inter text-sm mb-4 line-clamp-2 text-center">
          {produto.descricao}
        </p>

        {/* Preços */}
        <div className="text-center py-3 mb-4">
          {temDesconto ? (
            <div className="space-y-1">
              <div className="text-sm text-gray-500 line-through">
                {formatPrice(precoOriginal)}
              </div>
              <div className="font-inter font-bold text-[#7FBA3D] text-xl">
                {formatPrice(precoComDesconto)}
              </div>
            </div>
          ) : (
            <div className="font-inter font-bold text-[#111827] text-xl">
              {formatPrice(precoOriginal)}
            </div>
          )}
          {produto.unidade && produto.unidade !== 'unidade' && (
            <div className="text-xs text-gray-500 mt-1">
              por {produto.unidade}
            </div>
          )}
        </div>

        {/* Quantidade */}
        <div className="flex items-center justify-center space-x-3 mb-4">
          <label className="text-sm font-inter font-semibold text-[#111827]">
            Qtd:
          </label>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min="1"
            step="1"
            value={quantidade}
            onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 px-2 py-1.5 border border-[#e5e7eb] rounded-lg text-sm font-inter text-center focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent"
          />
        </div>

        {/* Preço Total */}
        <div className="text-center py-2 mb-4">
          <div className="text-xs font-inter text-[#6b7280] mb-1">Total:</div>
          <div className="font-inter font-bold text-[#111827] text-xl">
            {formatPrice(precoFinal * quantidade)}
          </div>
        </div>

        {/* Botão Adicionar */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-2xl font-inter font-bold text-base transition-all duration-200 ${
            isAdding
              ? 'bg-[#7FBA3D] text-white cursor-not-allowed opacity-80'
              : 'bg-[#7FBA3D] text-white hover:bg-[#0A3D2E] hover:shadow-lg hover:scale-[1.02]'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{isAdding ? 'Adicionando...' : 'Adicionar ao orçamento'}</span>
        </button>
      </div>
    </div>
  );
}