'use client';

import AdminLayout from '@/components/AdminLayout';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

interface Depoimento {
  id: number;
  nome: string;
  comentario: string;
  imagem?: string;
  foto?: string;
  estrelas?: number;
  data?: string;
}

export default function DepoimentosPage() {
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await fetch('/api/depoimentos', {
          cache: 'no-store',
        });

        if (!response.ok) {
          console.error('Erro ao buscar depoimentos:', response.status);
          setDepoimentos([]);
          return;
        }

        const data = await response.json();

        const normalizados: Depoimento[] = (data || []).map((item: any) => ({
          id: Number(item.id),
          nome: item.nome ?? '',
          comentario: item.comentario ?? '',
          imagem: item.imagem ?? '',
          estrelas: item.estrelas ?? 5,
          data: item.created_at ?? null,
        }));

        setDepoimentos(normalizados);
      } catch (error) {
        console.error('Erro ao buscar depoimentos:', error);
        setDepoimentos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const removerDepoimento = async (depoimentoId: number) => {
    if (!confirm('Tem certeza que deseja excluir este depoimento?')) return;

    try {
      const response = await fetch(`/api/depoimentos/${depoimentoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.error('Erro ao remover depoimento:', response.status);
        return;
      }

      setDepoimentos((prev) => prev.filter((d) => d.id !== depoimentoId));
    } catch (error) {
      console.error('Erro ao remover depoimento:', error);
    }
  };

  const renderStars = (rating?: number) => {
    const valor = rating ?? 5;

    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < valor ? 'text-[#7FBA3D] fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando depoimentos...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        
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

        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
          {depoimentos.length > 0 ? (
            <div className="space-y-6 p-6">
              {depoimentos.map((depoimento) => (
                <div
                  key={depoimento.id}
                  className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">

                    <div className="flex-shrink-0">
                      {depoimento.imagem ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden">
                          <Image
                            src={depoimento.imagem}
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

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-inter font-semibold text-[#111827] text-lg">
                          {depoimento.nome}
                        </h3>

                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/depoimentos/${depoimento.id}/editar`}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => removerDepoimento(depoimento.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center mb-3">
                        {renderStars(depoimento.estrelas)}
                        <span className="ml-2 text-sm text-gray-600">
                          {depoimento.estrelas ?? 5} de 5 estrelas
                        </span>
                      </div>

                      <blockquote className="font-inter text-[#6b7280] italic mb-4">
                        "{depoimento.comentario}"
                      </blockquote>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {depoimento.data
                            ? new Date(depoimento.data).toLocaleDateString('pt-BR')
                            : 'Sem data'}
                        </span>
                      </div>

                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                Nenhum depoimento encontrado
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

      </div>
    </AdminLayout>
  );
}
