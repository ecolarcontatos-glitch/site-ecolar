'use client';

import AdminLayout from '@/components/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { MessageSquare, Plus, Edit, Trash2, Search, Star } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function AdminDepoimentos() {
  const { depoimentos, removerDepoimento } = useData();
  const [busca, setBusca] = useState('');

  const depoimentosFiltrados = depoimentos.filter(depoimento =>
    depoimento.nome.toLowerCase().includes(busca.toLowerCase()) ||
    depoimento.texto.toLowerCase().includes(busca.toLowerCase())
  );

  const handleRemover = (id: string, nome: string) => {
    if (confirm(`Tem certeza que deseja remover o depoimento de "${nome}"?`)) {
      removerDepoimento(id);
    }
  };

  const renderStars = (estrelas: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < estrelas ? 'text-[#7FBA3D] fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-inter font-bold text-3xl text-[#111827] mb-2">
              Depoimentos
            </h1>
            <p className="font-inter text-[#6b7280]">
              Gerencie os depoimentos dos clientes
            </p>
          </div>
          <Link
            href="/admin/depoimentos/novo"
            className="flex items-center space-x-2 bg-purple-500 text-white px-6 py-3 rounded-2xl hover:bg-purple-600 transition-colors duration-200 font-inter font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Depoimento</span>
          </Link>
        </div>

        {/* Busca */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar depoimentos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-inter"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter text-[#6b7280] text-sm">Total</p>
                <p className="font-inter font-bold text-2xl text-[#111827]">{depoimentos.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter text-[#6b7280] text-sm">5 Estrelas</p>
                <p className="font-inter font-bold text-2xl text-[#111827]">
                  {depoimentos.filter(d => d.estrelas === 5).length}
                </p>
              </div>
              <Star className="w-8 h-8 text-[#7FBA3D]" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter text-[#6b7280] text-sm">4+ Estrelas</p>
                <p className="font-inter font-bold text-2xl text-[#111827]">
                  {depoimentos.filter(d => d.estrelas >= 4).length}
                </p>
              </div>
              <Star className="w-8 h-8 text-[#C05A2B]" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter text-[#6b7280] text-sm">Média</p>
                <p className="font-inter font-bold text-2xl text-[#111827]">
                  {depoimentos.length > 0 
                    ? (depoimentos.reduce((acc, d) => acc + d.estrelas, 0) / depoimentos.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
              <Star className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Lista de Depoimentos */}
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
          {depoimentosFiltrados.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-[#6b7280] mx-auto mb-4" />
              <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2">
                Nenhum depoimento encontrado
              </h3>
              <p className="font-inter text-[#6b7280] mb-6">
                {busca ? 'Tente ajustar o termo de busca.' : 'Comece adicionando seu primeiro depoimento.'}
              </p>
              <Link
                href="/admin/depoimentos/novo"
                className="inline-flex items-center space-x-2 bg-purple-500 text-white px-6 py-3 rounded-2xl hover:bg-purple-600 transition-colors duration-200 font-inter font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Novo Depoimento</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {depoimentosFiltrados.map((depoimento) => (
                <div
                  key={depoimento.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="font-inter font-semibold text-purple-600 text-lg">
                          {depoimento.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-inter font-semibold text-[#111827]">
                          {depoimento.nome}
                        </h3>
                        <div className="flex items-center space-x-1">
                          {renderStars(depoimento.estrelas)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/depoimentos/${depoimento.id}/editar`}
                        className="p-2 text-[#6b7280] hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleRemover(depoimento.id, depoimento.nome)}
                        className="p-2 text-[#6b7280] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Texto */}
                  <blockquote className="font-inter text-[#6b7280] italic leading-relaxed">
                    "{depoimento.texto}"
                  </blockquote>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}