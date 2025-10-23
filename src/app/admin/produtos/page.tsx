'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { Plus, Search, Edit, Trash2, Eye, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminProdutos() {
  const { produtos, categorias, removerProduto } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const produtosFiltrados = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.descricao_curta.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || produto.categoria_id.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string, nome: string) => {
    if (confirm(`Tem certeza que deseja excluir o produto "${nome}"?`)) {
      removerProduto(id);
    }
  };

  const getCategoriaName = (categoriaIds: string[]) => {
    return categoriaIds
      .map(id => categorias.find(c => c.id === id)?.nome)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-inter font-bold text-3xl text-[#111827] mb-2">
              Produtos
            </h1>
            <p className="font-inter text-[#6b7280]">
              Gerencie todos os produtos do catálogo
            </p>
          </div>
          
          <Link
            href="/admin/produtos/novo"
            className="flex items-center space-x-2 bg-[#7FBA3D] text-white px-6 py-3 rounded-2xl hover:bg-[#0A3D2E] transition-colors duration-200 font-inter font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Produto</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#e5e7eb] rounded-xl font-inter focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="sm:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-[#e5e7eb] rounded-xl font-inter focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent"
              >
                <option value="">Todas as categorias</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtosFiltrados.map((produto) => (
            <div key={produto.id} className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden">
              {/* Image */}
              <div className="relative aspect-[4/3]">
                <Image
                  src={produto.imagens[0]}
                  alt={produto.nome}
                  fill
                  className="object-cover"
                />
                {produto.destaque && (
                  <div className="absolute top-3 left-3 bg-[#C05A2B] text-white px-3 py-1 rounded-full text-xs font-inter font-semibold flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>Destaque</span>
                  </div>
                )}
                {produto.pronta_entrega_disponivel && (
                  <div className="absolute top-3 right-3 bg-[#7FBA3D] text-white px-3 py-1 rounded-full text-xs font-inter font-semibold">
                    Pronta Entrega
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2 line-clamp-2">
                  {produto.nome}
                </h3>
                
                <p className="text-[#6b7280] font-inter text-sm mb-3 line-clamp-2">
                  {produto.descricao_curta}
                </p>

                <div className="text-xs font-inter text-[#6b7280] mb-3">
                  {getCategoriaName(produto.categoria_id)}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-inter">
                    <div className="text-[#6b7280]">Fábrica:</div>
                    <div className="font-semibold text-[#111827]">
                      R$ {produto.preco_fabrica.toFixed(2)}
                    </div>
                  </div>
                  {produto.preco_pronta_entrega && (
                    <div className="text-sm font-inter text-right">
                      <div className="text-[#6b7280]">Pronta:</div>
                      <div className="font-semibold text-[#111827]">
                        R$ {produto.preco_pronta_entrega.toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link
                    href={`/admin/produtos/${produto.id}`}
                    className="flex-1 flex items-center justify-center space-x-2 bg-[#f1f5f9] text-[#6b7280] px-3 py-2 rounded-xl hover:bg-[#e5e7eb] transition-colors duration-200 font-inter font-medium text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ver</span>
                  </Link>
                  
                  <Link
                    href={`/admin/produtos/${produto.id}/editar`}
                    className="flex-1 flex items-center justify-center space-x-2 bg-[#7FBA3D] text-white px-3 py-2 rounded-xl hover:bg-[#0A3D2E] transition-colors duration-200 font-inter font-medium text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(produto.id, produto.nome)}
                    className="flex items-center justify-center bg-red-500 text-white px-3 py-2 rounded-xl hover:bg-red-600 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {produtosFiltrados.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-center">
            <div className="w-16 h-16 bg-[#f1f5f9] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[#6b7280]" />
            </div>
            <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="font-inter text-[#6b7280] mb-6">
              {searchTerm || selectedCategory 
                ? 'Tente ajustar os filtros de busca'
                : 'Comece adicionando seu primeiro produto'
              }
            </p>
            {!searchTerm && !selectedCategory && (
              <Link
                href="/admin/produtos/novo"
                className="inline-flex items-center space-x-2 bg-[#7FBA3D] text-white px-6 py-3 rounded-2xl hover:bg-[#0A3D2E] transition-colors duration-200 font-inter font-semibold"
              >
                <Plus className="w-5 h-5" />
                <span>Adicionar Produto</span>
              </Link>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-inter font-bold text-[#111827] mb-1">
                {produtos.length}
              </div>
              <div className="text-sm font-inter text-[#6b7280]">
                Total de Produtos
              </div>
            </div>
            
            <div>
              <div className="text-2xl font-inter font-bold text-[#7FBA3D] mb-1">
                {produtos.filter(p => p.destaque).length}
              </div>
              <div className="text-sm font-inter text-[#6b7280]">
                Em Destaque
              </div>
            </div>
            
            <div>
              <div className="text-2xl font-inter font-bold text-[#C05A2B] mb-1">
                {produtos.filter(p => p.pronta_entrega_disponivel).length}
              </div>
              <div className="text-sm font-inter text-[#6b7280]">
                Pronta Entrega
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}