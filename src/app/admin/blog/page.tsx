'use client';

import AdminLayout from '@/components/AdminLayout';
import { Plus, Edit, Trash2, Calendar, User, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

// Forçar renderização dinâmica
export const dynamic = "force-dynamic";

interface Post {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  imagem: string;
  autor: string;
  data: string;
  slug: string;
  publicado: boolean;
  categoria?: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');

  // Buscar dados da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Buscar posts
        const postsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, { 
          cache: "no-store",
          headers: {
            'X-Admin-Key': process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''
          }
        });
        
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setPosts(postsData || []);
        } else {
          console.error('Erro ao buscar posts:', postsResponse.status);
          setPosts([]);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const togglePublicacao = async (postId: string, publicado: boolean) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''
        },
        body: JSON.stringify({ publicado: !publicado })
      });

      if (response.ok) {
        // Atualizar estado local
        setPosts(prev => prev.map(p => 
          p.id === postId ? { ...p, publicado: !publicado } : p
        ));
      }
    } catch (error) {
      console.error('Erro ao atualizar publicação:', error);
    }
  };

  const removerPost = async (postId: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?id=${postId}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Key': process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''
        }
      });

      if (response.ok) {
        // Remover do estado local
        setPosts(prev => prev.filter(p => p.id !== postId));
      }
    } catch (error) {
      console.error('Erro ao remover post:', error);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'publicados') return post.publicado !== false;
    if (filter === 'rascunhos') return post.publicado === false;
    return true;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando posts...</p>
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
              Blog
            </h1>
            <p className="font-inter text-[#6b7280]">
              Gerencie os posts do blog da ECOLAR
            </p>
          </div>
          <Link
            href="/admin/blog/novo"
            className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-2xl hover:bg-blue-600 transition-colors duration-200 font-inter font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Post</span>
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('todos')}
              className={`px-4 py-2 rounded-xl font-inter font-medium transition-colors ${
                filter === 'todos'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos ({posts.length})
            </button>
            <button
              onClick={() => setFilter('publicados')}
              className={`px-4 py-2 rounded-xl font-inter font-medium transition-colors ${
                filter === 'publicados'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Publicados ({posts.filter(p => p.publicado !== false).length})
            </button>
            <button
              onClick={() => setFilter('rascunhos')}
              className={`px-4 py-2 rounded-xl font-inter font-medium transition-colors ${
                filter === 'rascunhos'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Rascunhos ({posts.filter(p => p.publicado === false).length})
            </button>
          </div>
        </div>

        {/* Lista de Posts */}
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
          {filteredPosts.length > 0 ? (
            <div className="space-y-6 p-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex space-x-6">
                    {/* Imagem */}
                    <div className="flex-shrink-0">
                      <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={post.imagem || '/placeholder.webp'}
                          alt={post.titulo}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-inter font-semibold text-[#111827] text-xl mb-2">
                            {post.titulo}
                          </h3>
                          <p className="font-inter text-[#6b7280] mb-4 line-clamp-2">
                            {post.resumo}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-[#6b7280] mb-3">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{post.autor}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(post.data).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                          
                          {/* Status */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => togglePublicacao(post.id, post.publicado !== false)}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                                post.publicado !== false
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              }`}
                            >
                              {post.publicado !== false ? (
                                <>
                                  <Eye className="w-3 h-3 mr-1" />
                                  Publicado
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3 mr-1" />
                                  Rascunho
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="flex space-x-2 ml-4">
                          <Link
                            href={`/admin/blog/editar/${post.id}`}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => removerPost(post.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                Nenhum post encontrado
              </div>
              <Link
                href="/admin/blog/novo"
                className="inline-flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-2xl hover:bg-blue-600 transition-colors duration-200 font-inter font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Criar Primeiro Post</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}