'use client';

import AdminLayout from '@/components/AdminLayout';
import { Plus, Edit, Trash2, Star, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

// Forçar renderização dinâmica
export const dynamic = "force-dynamic";

interface Depoimento {
  id: string;
  nome: string;
  texto: string;
  estrelas: number;
  foto?: string;
  cargo?: string;
  empresa?: string;
  aprovado: boolean;
  data: string;
}

export default function DepoimentosPage() {
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');

  // Buscar dados da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Buscar depoimentos
        const depoimentosResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/depoimentos`, { 
          cache: "no-store",
          headers: {
            'X-Admin-Key': process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''
          }
        });
        
        if (depoimentosResponse.ok) {
          const depoimentosData = await depoimentosResponse.json();
          setDepoimentos(depoimentosData || []);
        } else {
          console.error('Erro ao buscar depoimentos:', depoimentosResponse.status);
          setDepoimentos([]);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setDepoimentos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleAprovacao = async (depoimentoId: string, aprovado: boolean) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/depoimentos/${depoimentoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''
        },
        body: JSON.stringify({ aprovado: !aprovado })
      });

      if (response.ok) {
        // Atualizar estado local
        setDepoimentos(prev => prev.map(d => 
          d.id === depoimentoId ? { ...d, aprovado: !aprovado } : d
        ));
      }
    } catch (error) {
      console.error('Erro ao atualizar aprovação:', error);
    }
  };

  const removerDepoimento = async (depoimentoId: string) => {
    if (!confirm('Tem certeza que deseja excluir este depoimento?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/depoimentos/${depoimentoId}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Key': process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''
        }
      });

      if (response.ok) {
        // Remover do estado local
        setDepoimentos(prev => prev.filter(d => d.id !== depoimentoId));
      }
    } catch (error) {
      console.error('Erro ao remover depoimento:', error);
    }
  };

  const filteredDepoimentos = depoimentos.filter(depoimento => {
    if (filter === 'aprovados') return depoimento.aprovado !== false;
    if (filter === 'pendentes') return depoimento.aprovado === false;
    return true;
  });

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-[#7FBA3D] fill-current' : 'text-gray-300'}`}
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

        {/* Filtros */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('todos')}
              className={`px-4 py-2 rounded-xl font-inter font-medium transition-colors ${
                filter === 'todos'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos ({depoimentos.length})
            </button>
            <button
              onClick={() => setFilter('aprovados')}
              className={`px-4 py-2 rounded-xl font-inter font-medium transition-colors ${
                filter === 'aprovados'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Aprovados ({depoimentos.filter(d => d.aprovado !== false).length})
            </button>
            <button
              onClick={() => setFilter('pendentes')}
              className={`px-4 py-2 rounded-xl font-inter font-medium transition-colors ${
                filter === 'pendentes'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Pendentes ({depoimentos.filter(d => d.aprovado === false).length})
            </button>
          </div>
        </div>

        {/* Lista de Depoimentos */}
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
          {filteredDepoimentos.length > 0 ? (
            <div className="space-y-6 p-6">
              {filteredDepoimentos.map((depoimento) => (
                <div
                  key={depoimento.id}
                  className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
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
                        <div>
                          <h3 className="font-inter font-semibold text-[#111827] text-lg">
                            {depoimento.nome}
                          </h3>
                          {depoimento.cargo && depoimento.empresa && (
                            <p className="text-sm text-gray-600">
                              {depoimento.cargo} - {depoimento.empresa}
                            </p>
                          )}
                        </div>
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
                          {depoimento.estrelas} de 5 estrelas
                        </span>
                      </div>

                      <blockquote className="font-inter text-[#6b7280] italic mb-4">
                        "{depoimento.texto}"
                      </blockquote>

                      {/* Status e Data */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => toggleAprovacao(depoimento.id, depoimento.aprovado !== false)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                            depoimento.aprovado !== false
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          }`}
                        >
                          {depoimento.aprovado !== false ? (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              Aprovado
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              Pendente
                            </>
                          )}
                        </button>
                        <span className="text-sm text-gray-500">
                          {new Date(depoimento.data).toLocaleDateString('pt-BR')}
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