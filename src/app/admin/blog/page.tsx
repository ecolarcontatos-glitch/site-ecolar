'use client';

import AdminLayout from '@/components/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { Plus, Edit, Trash2, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogPage() {
  const { posts, removerPost } = useData();

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

        {/* Lista de Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            >
              <div className="flex space-x-6">
                {/* Imagem */}
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={post.imagem}
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
                      <div className="flex items-center space-x-4 text-sm text-[#6b7280]">
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
                    <div className="flex space-x-2 ml-4">
                      <Link
                        href={`/admin/blog/${post.id}/editar`}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-lg hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Editar</span>
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir este post?')) {
                            removerPost(post.id);
                          }
                        }}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Excluir</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              Nenhum post cadastrado
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
    </AdminLayout>
  );
}