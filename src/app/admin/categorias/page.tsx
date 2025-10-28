'use client';

import AdminLayout from '@/components/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { FolderOpen, Plus, Edit, Trash2, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function AdminCategorias() {
  const { categorias, produtos, removerCategoria } = useData();
  const [busca, setBusca] = useState('');

  const categoriasFiltradas = categorias.filter(categoria =>
    categoria.nome.toLowerCase().includes(busca.toLowerCase()) ||
    categoria.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  const handleRemover = (id: string, nome: string) => {
    const produtosNaCategoria = produtos.filter(p => p.categoria_id === id).length;
    
    if (produtosNaCategoria > 0) {
      alert(`Não é possível remover a categoria "${nome}" pois ela possui ${produtosNaCategoria} produto(s) vinculado(s).`);
      return;
    }

    if (confirm(`Tem certeza que deseja remover a categoria "${nome}"?`)) {
      removerCategoria(id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-inter font-bold text-3xl text-[#111827] mb-2">
              Categorias
            </h1>
            <p className="font-inter text-[#6b7280]">
              Organize os produtos em categorias
            </p>
          </div>
          <Link
            href="/admin/categorias/nova"
            className="flex items-center space-x-2 bg-[#C05A2B] text-white px-6 py-3 rounded-2xl hover:bg-[#A0481F] transition-colors duration-200 font-inter font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Nova Categoria</span>
          </Link>
        </div>

        {/* Busca */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar categorias..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C05A2B] focus:border-transparent font-inter"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter text-[#6b7280] text-sm">Total de Categorias</p>
                <p className="font-inter font-bold text-2xl text-[#111827]">{categorias.length}</p>
              </div>
              <FolderOpen className="w-8 h-8 text-[#C05A2B]" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter text-[#6b7280] text-sm">Produtos Categorizados</p>
                <p className="font-inter font-bold text-2xl text-[#111827]">
                  {produtos.filter(p => p.categoria_id).length}
                </p>
              </div>
              <FolderOpen className="w-8 h-8 text-[#7FBA3D]" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter text-[#6b7280] text-sm">Sem Categoria</p>
                <p className="font-inter font-bold text-2xl text-[#111827]">
                  {produtos.filter(p => !p.categoria_id).length}
                </p>
              </div>
              <FolderOpen className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Lista de Categorias */}
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
          {categoriasFiltradas.length === 0 ? (
            <div className="p-12 text-center">
              <FolderOpen className="w-16 h-16 text-[#6b7280] mx-auto mb-4" />
              <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2">
                Nenhuma categoria encontrada
              </h3>
              <p className="font-inter text-[#6b7280] mb-6">
                {busca ? 'Tente ajustar o termo de busca.' : 'Comece criando sua primeira categoria.'}
              </p>
              <Link
                href="/admin/categorias/nova"
                className="inline-flex items-center space-x-2 bg-[#C05A2B] text-white px-6 py-3 rounded-2xl hover:bg-[#A0481F] transition-colors duration-200 font-inter font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Nova Categoria</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {categoriasFiltradas.map((categoria) => {
                const produtosNaCategoria = produtos.filter(p => p.categoria_id === categoria.id).length;
                return (
                  <div
                    key={categoria.id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={categoria.imagem}
                        alt={categoria.nome}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <Link
                          href={`/admin/categorias/editar/${categoria.id}`}
                          className="p-2 bg-white bg-opacity-90 text-[#6b7280] hover:text-[#C05A2B] rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleRemover(categoria.id, categoria.nome)}
                          className="p-2 bg-white bg-opacity-90 text-[#6b7280] hover:text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2">
                        {categoria.nome}
                      </h3>
                      <p className="font-inter text-[#6b7280] text-sm mb-4 line-clamp-2">
                        {categoria.descricao}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-inter font-medium bg-[#C05A2B] text-white">
                          {produtosNaCategoria} produto{produtosNaCategoria !== 1 ? 's' : ''}
                        </span>
                        {categoria.cor && (
                          <div
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: categoria.cor }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}