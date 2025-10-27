'use client';

import AdminLayout from '@/components/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { FileText, Plus, Edit, Trash2, Search, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function AdminBlog() {
  const { posts, removerPost } = useData();
  const [busca, setBusca] = useState('');

  const postsFiltrados = posts.filter(post =>
    post.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    post.resumo.toLowerCase().includes(busca.toLowerCase()) ||
    post.conteudo.toLowerCase().includes(busca.toLowerCase())
  ).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const handleRemover = (id: string, titulo: string) => {
    if (confirm(`Tem certeza que deseja remover o post "${titulo}"?`)) {
      removerPost(id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

        {/* Busca */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b7280] w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar posts..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter text-[#6b7280] text-sm">Total de Posts</p>
                <p className="font-inter font-bold text-2xl text-[#111827]">{posts.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter text-[#6b7280] text-sm">Este Mês</p>
                <p className="font-inter font-bold text-2xl text-[#111827]">
                  {posts.filter(p => {
                    const postDate = new Date(p.data);
                    const now = new Date();
                    return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-[#7FBA3D]" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter text-[#6b7280] text-sm">Última Semana</p>
                <p className="font-inter font-bold text-2xl text-[#111827]">
                  {posts.filter(p => {
                    const postDate = new Date(p.data);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return postDate >= weekAgo;
                  }).length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-[#C05A2B]" />
            </div>
          </div>
        </div>

        {/* Lista de Posts */}
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
          {postsFiltrados.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-[#6b7280] mx-auto mb-4" />
              <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2">
                Nenhum post encontrado
              </h3>
              <p className="font-inter text-[#6b7280] mb-6">
                {busca ? 'Tente ajustar o termo de busca.' : 'Comece criando seu primeiro post.'}
              </p>
              <Link
                href="/admin/blog/novo"
                className="inline-flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-2xl hover:bg-blue-600 transition-colors duration-200 font-inter font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Novo Post</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {postsFiltrados.map((post) => (
                <div key={post.id} className="p-6 hover:bg-[#f8fafc] transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Imagem */}
                    <div className="relative w-full lg:w-48 aspect-[4/3] lg:aspect-[3/2] rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={post.imagem}
                        alt={post.titulo}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2 line-clamp-2">
                            {post.titulo}
                          </h3>
                          <p className="font-inter text-[#6b7280] text-sm mb-4 line-clamp-3">
                            {post.resumo}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-[#6b7280] font-inter">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{post.autor}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(post.data).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Link
                            href={`/admin/blog/${post.id}/editar`}
                            className="p-2 text-[#6b7280] hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleRemover(post.id, post.titulo)}
                            className="p-2 text-[#6b7280] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          )}
        </div>
      </div>
    </AdminLayout>
  );
}