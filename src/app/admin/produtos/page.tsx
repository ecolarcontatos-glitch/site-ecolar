'use client';

import AdminLayout from '@/components/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function ProdutosPage() {
  const { produtos, categorias, atualizarProduto, removerProduto } = useData();
  const [filter, setFilter] = useState('todos');

  const getCategoriaById = (id: string) => {
    return categorias.find(c => c.id === id);
  };

  const toggleDisponibilidade = (produtoId: string, disponivel: boolean) => {
    atualizarProduto(produtoId, { disponivel: !disponivel });
  };

  const filteredProdutos = produtos.filter(produto => {
    if (filter === 'disponiveis') return produto.disponivel !== false;
    if (filter === 'indisponiveis') return produto.disponivel === false;
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-inter font-bold text-3xl text-[#111827] mb-2">
              Produtos
            </h1>
            <p className="font-inter text-[#6b7280]">
              Gerencie o catálogo de produtos da ECOLAR
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
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('todos')}
              className={`px-4 py-2 rounded-xl font-inter font-medium transition-colors ${
                filter === 'todos'
                  ? 'bg-[#7FBA3D] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos ({produtos.length})
            </button>
            <button
              onClick={() => setFilter('disponiveis')}
              className={`px-4 py-2 rounded-xl font-inter font-medium transition-colors ${
                filter === 'disponiveis'
                  ? 'bg-[#7FBA3D] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Disponíveis ({produtos.filter(p => p.disponivel !== false).length})
            </button>
            <button
              onClick={() => setFilter('indisponiveis')}
              className={`px-4 py-2 rounded-xl font-inter font-medium transition-colors ${
                filter === 'indisponiveis'
                  ? 'bg-[#7FBA3D] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Indisponíveis ({produtos.filter(p => p.disponivel === false).length})
            </button>
          </div>
        </div>

        {/* Lista de Produtos */}
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
          {filteredProdutos.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProdutos.map((produto) => {
                    const categoria = getCategoriaById(produto.categoria);
                    const preco = Number(produto?.preco) || 0;
                    const desconto = Number(produto?.desconto) || 0;
                    const precoFinal = desconto > 0 ? preco * (1 - desconto / 100) : preco;
                    
                    return (
                      <tr key={produto.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100 mr-4">
                              <Image
                                src={produto.imagem || '/placeholder.webp'}
                                alt={produto.nome}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {produto.nome}
                              </div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">
                                {produto.descricao}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {categoria?.nome || 'Sem categoria'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="space-y-1">
                            <div className="font-medium">
                              Preço base: R$ {preco.toFixed(2).replace('.', ',')}
                            </div>
                            {desconto > 0 && (
                              <>
                                <div className="text-xs text-gray-500">
                                  Desconto: {desconto.toFixed(1)}%
                                </div>
                                <div className="text-sm font-bold text-[#7FBA3D]">
                                  Valor final: R$ {precoFinal.toFixed(2).replace('.', ',')}
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <button
                              onClick={() => toggleDisponibilidade(produto.id, produto.disponivel !== false)}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                                produto.disponivel !== false
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {produto.disponivel !== false ? (
                                <>
                                  <Eye className="w-3 h-3 mr-1" />
                                  Disponível
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3 mr-1" />
                                  Indisponível
                                </>
                              )}
                            </button>
                            {produto.destaque && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Destaque
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              href={`/admin/produtos/${produto.id}/editar`}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => {
                                if (confirm('Tem certeza que deseja excluir este produto?')) {
                                  removerProduto(produto.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
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
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                Nenhum produto encontrado
              </div>
              <Link
                href="/admin/produtos/novo"
                className="inline-flex items-center space-x-2 bg-[#7FBA3D] text-white px-6 py-3 rounded-2xl hover:bg-[#0A3D2E] transition-colors duration-200 font-inter font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Adicionar Primeiro Produto</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}