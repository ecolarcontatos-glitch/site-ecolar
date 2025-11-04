'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, SortAsc } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Produto } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

export default function ProdutosPageContent() {
  const searchParams = useSearchParams();
  const { produtos, categorias } = useData();
  const [filteredProdutos, setFilteredProdutos] = useState<Produto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoria') || '');
  const [sortBy, setSortBy] = useState('relevancia');

  useEffect(() => {
    let filtered = produtos;

    // Todos os produtos são exibidos automaticamente (campo disponível removido)
    
    // Filtro por categoria
    if (selectedCategory) {
      filtered = filtered.filter(produto => {
        const categoria = categorias.find(c => c.id === produto.categoria);
        return categoria?.slug === selectedCategory;
      });
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(produto =>
        produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenação
    switch (sortBy) {
      case 'menor_preco':
        filtered.sort((a, b) => {
          const precoA = a.desconto ? a.preco * (1 - a.desconto / 100) : a.preco;
          const precoB = b.desconto ? b.preco * (1 - b.desconto / 100) : b.preco;
          return precoA - precoB;
        });
        break;
      case 'maior_preco':
        filtered.sort((a, b) => {
          const precoA = a.desconto ? a.preco * (1 - a.desconto / 100) : a.preco;
          const precoB = b.desconto ? b.preco * (1 - b.desconto / 100) : b.preco;
          return precoB - precoA;
        });
        break;
      case 'desconto':
        filtered.sort((a, b) => {
          const descontoA = a.desconto || 0;
          const descontoB = b.desconto || 0;
          return descontoB - descontoA;
        });
        break;
      default: // relevancia
        filtered.sort((a, b) => {
          if (a.destaque && !b.destaque) return -1;
          if (!a.destaque && b.destaque) return 1;
          return 0;
        });
    }

    setFilteredProdutos(filtered);
  }, [produtos, categorias, searchTerm, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('relevancia');
  };

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="max-w-[1200px] mx-auto px-5">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-inter font-bold text-3xl md:text-4xl text-[#111827] mb-4">
            Catálogo de Produtos
          </h1>
          <p className="font-inter text-lg text-[#6b7280]">
            Encontre os melhores materiais de construção com preços especiais
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#e5e7eb] rounded-xl font-inter focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent"
              />
            </div>

            {/* Categoria */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] w-4 h-4" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#e5e7eb] rounded-xl font-inter focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent appearance-none bg-white"
              >
                <option value="">Todas as categorias</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.slug}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenação */}
            <div className="relative">
              <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] w-4 h-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#e5e7eb] rounded-xl font-inter focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent appearance-none bg-white"
              >
                <option value="relevancia">Relevância</option>
                <option value="menor_preco">Menor preço</option>
                <option value="maior_preco">Maior preço</option>
                <option value="desconto">Maior desconto</option>
              </select>
            </div>

            {/* Limpar Filtros */}
            <button
              onClick={clearFilters}
              className="bg-[#f1f5f9] text-[#6b7280] px-4 py-3 rounded-xl hover:bg-[#e5e7eb] transition-colors duration-200 font-inter font-medium"
            >
              Limpar filtros
            </button>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-6">
          <p className="font-inter text-[#6b7280]">
            {filteredProdutos.length} produto{filteredProdutos.length !== 1 ? 's' : ''} encontrado{filteredProdutos.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid de Produtos - 1 coluna no mobile, 2+ no tablet/desktop */}
        {filteredProdutos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredProdutos.map((produto, index) => (
              <div 
                key={produto.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard produto={produto} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[#f1f5f9] rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-[#6b7280]" />
            </div>
            <h3 className="font-inter font-semibold text-[#111827] text-xl mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="font-inter text-[#6b7280] mb-6">
              Tente ajustar os filtros ou termos de busca
            </p>
            <button
              onClick={clearFilters}
              className="bg-[#7FBA3D] text-white px-6 py-3 rounded-2xl hover:bg-[#0A3D2E] transition-colors duration-200 font-inter font-medium"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}