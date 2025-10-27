'use client';

import AdminLayout from '@/components/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { Image as ImageIcon, Plus, Edit, Trash2, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function AdminInspiracoes() {
  const { inspiracoes, removerInspiracao } = useData();
  const [busca, setBusca] = useState('');

  const inspiracoesFiltradas = inspiracoes.filter(inspiracao =>
    inspiracao.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    inspiracao.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  const handleRemover = (id: string, titulo: string) => {
    if (confirm(`Tem certeza que deseja remover a inspiração "${titulo}"?`)) {
      removerInspiracao(id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-inter font-bold text-3xl text-[#111827] mb-2">
              Inspirações
            </h1>
            <p className="font-inter text-[#6b7280]">
              Gerencie as inspirações e projetos em destaque
            </p>
          </div>
          <Link
            href="/admin/inspiracoes/nova"
            className="flex items-center space-x-2 bg-pink-500 text-white px-6 py-3 rounded-2xl hover:bg-pink-600 transition-colors duration-200 font-inter font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Nova Inspiração</span>
          </Link>
        </div>

        {/* Busca */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar inspirações..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent font-inter"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter text-[#6b7280] text-sm">Total de Inspirações</p>
                <p className="font-inter font-bold text-2xl text-[#111827]">{inspiracoes.length}</p>
              </div>
              <ImageIcon className="w-8 h-8 text-pink-500" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter text-[#6b7280] text-sm">Projetos Destacados</p>
                <p className="font-inter font-bold text-2xl text-[#111827]">{inspiracoes.length}</p>
              </div>
              <ImageIcon className="w-8 h-8 text-[#7FBA3D]" />
            </div>
          </div>
        </div>

        {/* Lista de Inspirações */}
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
          {inspiracoesFiltradas.length === 0 ? (
            <div className="p-12 text-center">
              <ImageIcon className="w-16 h-16 text-[#6b7280] mx-auto mb-4" />
              <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2">
                Nenhuma inspiração encontrada
              </h3>
              <p className="font-inter text-[#6b7280] mb-6">
                {busca ? 'Tente ajustar o termo de busca.' : 'Comece adicionando sua primeira inspiração.'}
              </p>
              <Link
                href="/admin/inspiracoes/nova"
                className="inline-flex items-center space-x-2 bg-pink-500 text-white px-6 py-3 rounded-2xl hover:bg-pink-600 transition-colors duration-200 font-inter font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Nova Inspiração</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {inspiracoesFiltradas.map((inspiracao) => (
                <div
                  key={inspiracao.id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 group"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={inspiracao.imagem}
                      alt={inspiracao.titulo}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/inspiracoes/${inspiracao.id}/editar`}
                        className="p-2 bg-white bg-opacity-90 text-[#6b7280] hover:text-pink-500 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleRemover(inspiracao.id, inspiracao.titulo)}
                        className="p-2 bg-white bg-opacity-90 text-[#6b7280] hover:text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2">
                      {inspiracao.titulo}
                    </h3>
                    <p className="font-inter text-[#6b7280] text-sm line-clamp-3">
                      {inspiracao.descricao}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}