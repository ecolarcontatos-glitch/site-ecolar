'use client';

import AdminLayout from '@/components/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function InspiracoesPage() {
  const { inspiracoes, removerInspiracao } = useData();

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-inter font-bold text-3xl text-[#111827] mb-2">
              Inspirações
            </h1>
            <p className="font-inter text-[#6b7280]">
              Gerencie as inspirações do portfólio da ECOLAR
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

        {/* Grid de Inspirações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inspiracoes.map((inspiracao) => (
            <div
              key={inspiracao.id}
              className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={inspiracao.imagem}
                  alt={inspiracao.titulo}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2">
                  {inspiracao.titulo}
                </h3>
                <p className="font-inter text-[#6b7280] text-sm mb-4 line-clamp-3">
                  {inspiracao.descricao}
                </p>
                <div className="flex space-x-2">
                  <Link
                    href={`/admin/inspiracoes/${inspiracao.id}/editar`}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Alterar</span>
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir esta inspiração?')) {
                        removerInspiracao(inspiracao.id);
                      }
                    }}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {inspiracoes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              Nenhuma inspiração cadastrada
            </div>
            <Link
              href="/admin/inspiracoes/nova"
              className="inline-flex items-center space-x-2 bg-pink-500 text-white px-6 py-3 rounded-2xl hover:bg-pink-600 transition-colors duration-200 font-inter font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Adicionar Primeira Inspiração</span>
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}