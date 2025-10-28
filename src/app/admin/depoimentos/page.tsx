'use client';

import AdminLayout from '@/components/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function DepoimentosPage() {
  const { depoimentos, removerDepoimento } = useData();

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-[#7FBA3D] fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-inter font-bold text-3xl text-[#111827] mb-2">
              Depoimentos
            </h1>
            <p className="font-inter text-[#6b7280]">
              Gerencie os depoimentos dos clientes da ECOLAR
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

        {/* Lista de Depoimentos */}
        <div className="space-y-6">
          {depoimentos.map((depoimento) => (
            <div
              key={depoimento.id}
              className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            >
              <div className="flex items-start space-x-4">
                {/* Foto do cliente */}
                <div className="flex-shrink-0">
                  {depoimento.foto ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={depoimento.foto}
                        alt={depoimento.nome}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="font-inter font-semibold text-purple-600 text-xl">
                        {depoimento.nome.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-inter font-semibold text-[#111827] text-lg">
                      {depoimento.nome}
                    </h3>
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/depoimentos/${depoimento.id}/editar`}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Editar</span>
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir este depoimento?')) {
                            removerDepoimento(depoimento.id);
                          }
                        }}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Excluir</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center mb-3">
                    {renderStars(depoimento.estrelas)}
                    <span className="ml-2 text-sm text-gray-600">
                      {depoimento.estrelas} de 5 estrelas
                    </span>
                  </div>

                  <blockquote className="font-inter text-[#6b7280] italic">
                    "{depoimento.texto}"
                  </blockquote>
                </div>
              </div>
            </div>
          ))}
        </div>

        {depoimentos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              Nenhum depoimento cadastrado
            </div>
            <Link
              href="/admin/depoimentos/novo"
              className="inline-flex items-center space-x-2 bg-purple-500 text-white px-6 py-3 rounded-2xl hover:bg-purple-600 transition-colors duration-200 font-inter font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Adicionar Primeiro Depoimento</span>
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}