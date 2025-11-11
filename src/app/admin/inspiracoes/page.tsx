'use client';

import AdminLayout from '@/components/AdminLayout';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

// Forçar renderização dinâmica
export const dynamic = "force-dynamic";

interface Inspiracao {
  id: string;
  titulo: string;
  descricao: string;
  imagem: string;
  categoria?: string;
  tags?: string[];
  destaque: boolean;
  ativo: boolean;
  data: string;
}

export default function InspiracoesPage() {
  const [inspiracoes, setInspiracoes] = useState<Inspiracao[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');

  // Buscar dados da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Buscar inspirações
        const inspiracoesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inspiracoes`, { 
          cache: "no-store",
          headers: {
            'X-Admin-Key': process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''
          }
        });
        
        if (inspiracoesResponse.ok) {
          const inspiracoesData = await inspiracoesResponse.json();
          setInspiracoes(inspiracoesData || []);
        } else {
          console.error('Erro ao buscar inspirações:', inspiracoesResponse.status);
          setInspiracoes([]);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setInspiracoes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleStatus = async (inspiracaoId: string, ativo: boolean) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inspiracoes/${inspiracaoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''
        },
        body: JSON.stringify({ ativo: !ativo })
      });

      if (response.ok) {
        // Atualizar estado local
        setInspiracoes(prev => prev.map(i => 
          i.id === inspiracaoId ? { ...i, ativo: !ativo } : i
        ));
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const removerInspiracao = async (inspiracaoId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta inspiração?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inspiracoes/${inspiracaoId}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Key': process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''
        }
      });

      if (response.ok) {
        // Remover do estado local
        setInspiracoes(prev => prev.filter(i => i.id !== inspiracaoId));
      }
    } catch (error) {
      console.error('Erro ao remover inspiração:', error);
    }
  };

  const filteredInspiracoes = inspiracoes.filter(inspiracao => {
    if (filter === 'ativas') return inspiracao.ativo !== false;
    if (filter === 'inativas') return inspiracao.ativo === false;
    if (filter === 'destaque') return inspiracao.destaque === true;
    return true;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando inspirações...</p>
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

        {/* Filtros */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('todos')}
              className={`px-4 py-2 rounded-xl font-inter font-medium transition-colors ${
                filter === 'todos'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos ({inspiracoes.length})
            </button>
            <button
              onClick={() => setFilter('ativas')}
              className={`px-4 py-2 rounded-xl font-inter font-medium transition-colors ${
                filter === 'ativas'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Ativas ({inspiracoes.filter(i => i.ativo !== false).length})
            </button>
            <button
              onClick={() => setFilter('inativas')}
              className={`px-4 py-2 rounded-xl font-inter font-medium transition-colors ${
                filter === 'inativas'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Inativas ({inspiracoes.filter(i => i.ativo === false).length})
            </button>
            <button
              onClick={() => setFilter('destaque')}
              className={`px-4 py-2 rounded-xl font-inter font-medium transition-colors ${
                filter === 'destaque'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Destaque ({inspiracoes.filter(i => i.destaque === true).length})
            </button>
          </div>
        </div>

        {/* Grid de Inspirações */}
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
          {filteredInspiracoes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredInspiracoes.map((inspiracao) => (
                <div
                  key={inspiracao.id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={inspiracao.imagem || '/placeholder.webp'}
                      alt={inspiracao.titulo}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <Link
                        href={`/admin/inspiracoes/${inspiracao.id}/editar`}
                        className="p-2 bg-white bg-opacity-90 text-[#6b7280] hover:text-pink-500 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => removerInspiracao(inspiracao.id)}
                        className="p-2 bg-white bg-opacity-90 text-[#6b7280] hover:text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {inspiracao.destaque && (
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Destaque
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2">
                      {inspiracao.titulo}
                    </h3>
                    <p className="font-inter text-[#6b7280] text-sm mb-4 line-clamp-3">
                      {inspiracao.descricao}
                    </p>
                    
                    {/* Tags */}
                    {inspiracao.tags && inspiracao.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {inspiracao.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                        {inspiracao.tags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                            +{inspiracao.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleStatus(inspiracao.id, inspiracao.ativo !== false)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                          inspiracao.ativo !== false
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {inspiracao.ativo !== false ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Ativa
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Inativa
                          </>
                        )}
                      </button>
                      <span className="text-xs text-gray-500">
                        {new Date(inspiracao.data).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                Nenhuma inspiração encontrada
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
      </div>
    </AdminLayout>
  );
}