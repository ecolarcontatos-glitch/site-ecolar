'use client';

import AdminLayout from '@/components/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { Package, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function AdminProdutos() {
  const { produtos, categorias, removerProduto } = useData();
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');

  const produtosFiltrados = produtos.filter(produto => {
    const matchBusca = produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
                      produto.descricao.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria = !categoriaFiltro || produto.categoria_id === categoriaFiltro;
    return matchBusca && matchCategoria;
  });

  const handleRemover = (id: string, nome: string) => {
    if (confirm(`Tem certeza que deseja remover o produto "${nome}"?`)) {
      removerProduto(id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-inter font-bold text-3xl text-[#111827] mb-2">
              Produtos
            </h1>
            <p className="font-inter text-[#6b7280]">
              Gerencie todos os produtos da ECOLAR
            </p>
          </div>
          <Link
            href="/admin/produtos/novo"
            className="flex items-center space-x-2 bg-[#7FBA3D] text-white px-6 py-3 rounded-2xl hover:bg-[#0A3D2E] transition-colors duration-200 font-inter font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Produto</span>
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent font-inter"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] w-5 h-5" />
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent font-inter bg-white min-w-[200px]"
              >
                <option value="">Todas as categorias</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter text-[#6b7280] text-sm">Total</p>
                <p className="font-inter font-bold text-2xl text-[#111827]">{produtos.length}</p>
              </div>
              <Package className="w-8 h-8 text-[#7FBA3D]" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter text-[#6b7280] text-sm">Em Destaque</p>
                <p className="font-inter font-bold text-2xl text-[#111827]">
                  {produtos.filter(p => p.destaque).length}
                </p>
              </div>
              <Package className="w-8 h-8 text-[#C05A2B]" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter text-[#6b7280] text-sm">Disponíveis</p>
                <p className="font-inter font-bold text-2xl text-[#111827]">
                  {produtos.filter(p => p.disponivel).length}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter text-[#6b7280] text-sm">Indisponíveis</p>
                <p className="font-inter font-bold text-2xl text-[#111827]">
                  {produtos.filter(p => !p.disponivel).length}
                </p>
              </div>
              <Package className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Lista de Produtos */}
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
          {produtosFiltrados.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-[#6b7280] mx-auto mb-4" />
              <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="font-inter text-[#6b7280] mb-6">
                {busca || categoriaFiltro ? 'Tente ajustar os filtros de busca.' : 'Comece adicionando seu primeiro produto.'}
              </p>
              <Link
                href="/admin/produtos/novo"
                className="inline-flex items-center space-x-2 bg-[#7FBA3D] text-white px-6 py-3 rounded-2xl hover:bg-[#0A3D2E] transition-colors duration-200 font-inter font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Novo Produto</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f8fafc] border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-inter font-semibold text-[#111827] text-sm">
                      Produto
                    </th>
                    <th className="text-left py-4 px-6 font-inter font-semibold text-[#111827] text-sm">
                      Categoria
                    </th>
                    <th className="text-left py-4 px-6 font-inter font-semibold text-[#111827] text-sm">
                      Preços
                    </th>
                    <th className="text-left py-4 px-6 font-inter font-semibold text-[#111827] text-sm">
                      Status
                    </th>
                    <th className="text-right py-4 px-6 font-inter font-semibold text-[#111827] text-sm">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {produtosFiltrados.map((produto) => {
                    const categoria = categorias.find(c => c.id === produto.categoria_id);
                    return (
                      <tr key={produto.id} className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-4">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                              <Image
                                src={produto.imagem}
                                alt={produto.nome}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-inter font-semibold text-[#111827] text-sm">
                                {produto.nome}
                              </h3>
                              <p className="font-inter text-[#6b7280] text-xs line-clamp-1">
                                {produto.descricao}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-inter font-medium bg-[#7FBA3D] bg-opacity-10 text-[#0A3D2E]">
                            {categoria?.nome || 'Sem categoria'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="text-xs font-inter text-[#111827]">
                              Fábrica: R$ {produto.preco_fabrica.toFixed(2)}
                            </div>
                            <div className="text-xs font-inter text-[#111827]">
                              Pronta: R$ {produto.preco_pronta_entrega.toFixed(2)}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col space-y-1">
                            {produto.destaque && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-inter font-medium bg-[#C05A2B] text-white">
                                Destaque
                              </span>
                            )}
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-inter font-medium ${
                              produto.disponivel 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {produto.disponivel ? 'Disponível' : 'Indisponível'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/admin/produtos/editar/${produto.id}`}
                              className="p-2 text-[#6b7280] hover:text-[#7FBA3D] hover:bg-[#7FBA3D] hover:bg-opacity-10 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleRemover(produto.id, produto.nome)}
                              className="p-2 text-[#6b7280] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}