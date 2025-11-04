'use client';

import AdminLayout from '@/components/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/hooks/useAuth';
import { Package, FolderOpen, FileText, MessageSquare, Image as ImageIcon, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const { produtos, categorias, posts, depoimentos, inspiracoes } = useData();

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7FBA3D] mx-auto mb-4"></div>
          <p className="font-inter text-[#6b7280]">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // Se não autenticado, não renderizar nada (redirecionamento já foi feito)
  if (!isAuthenticated) {
    return null;
  }

  const stats = [
    {
      title: 'Produtos',
      value: produtos.length,
      icon: Package,
      color: 'bg-[#7FBA3D]',
      href: '/admin/produtos'
    },
    {
      title: 'Categorias',
      value: categorias.length,
      icon: FolderOpen,
      color: 'bg-[#C05A2B]',
      href: '/admin/categorias'
    },
    {
      title: 'Posts do Blog',
      value: posts.length,
      icon: FileText,
      color: 'bg-blue-500',
      href: '/admin/blog'
    },
    {
      title: 'Depoimentos',
      value: depoimentos.length,
      icon: MessageSquare,
      color: 'bg-purple-500',
      href: '/admin/depoimentos'
    },
    {
      title: 'Inspirações',
      value: inspiracoes.length,
      icon: ImageIcon,
      color: 'bg-pink-500',
      href: '/admin/inspiracoes'
    }
  ];

  const produtosDestaque = produtos.filter(p => p.destaque);
  const postsRecentes = posts.slice(0, 3);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-inter font-bold text-3xl text-[#111827] mb-2">
            Dashboard
          </h1>
          <p className="font-inter text-[#6b7280]">
            Gerencie todo o conteúdo do site ECOLAR
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.title}
                href={stat.href}
                className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-[#6b7280]" />
                </div>
                <div className="text-2xl font-inter font-bold text-[#111827] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-inter text-[#6b7280]">
                  {stat.title}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Produtos em Destaque */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-inter font-bold text-xl text-[#111827]">
                Produtos em Destaque
              </h2>
              <Link
                href="/admin/produtos"
                className="text-[#7FBA3D] hover:text-[#0A3D2E] font-inter font-medium text-sm"
              >
                Ver todos
              </Link>
            </div>
            
            <div className="space-y-4">
              {produtosDestaque.slice(0, 3).map((produto) => (
                <div key={produto.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-[#f1f5f9] transition-colors">
                  <div className="w-12 h-12 bg-[#7FBA3D] rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-inter font-semibold text-[#111827] text-sm">
                      {produto.nome}
                    </h3>
                    <p className="font-inter text-[#6b7280] text-xs">
                      R$ {typeof produto.preco === 'number' && !isNaN(produto.preco) ? produto.preco.toFixed(2) : '0,00'}
                    </p>
                  </div>
                </div>
              ))}
              
              {produtosDestaque.length === 0 && (
                <p className="text-[#6b7280] font-inter text-sm text-center py-4">
                  Nenhum produto em destaque
                </p>
              )}
            </div>
          </div>

          {/* Posts Recentes */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-inter font-bold text-xl text-[#111827]">
                Posts Recentes
              </h2>
              <Link
                href="/admin/blog"
                className="text-[#7FBA3D] hover:text-[#0A3D2E] font-inter font-medium text-sm"
              >
                Ver todos
              </Link>
            </div>
            
            <div className="space-y-4">
              {postsRecentes.map((post) => (
                <div key={post.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-[#f1f5f9] transition-colors">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-inter font-semibold text-[#111827] text-sm line-clamp-1">
                      {post.titulo}
                    </h3>
                    <p className="font-inter text-[#6b7280] text-xs">
                      {new Date(post.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
              
              {posts.length === 0 && (
                <p className="text-[#6b7280] font-inter text-sm text-center py-4">
                  Nenhum post publicado
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/produtos/novo"
            className="bg-[#7FBA3D] text-white p-4 rounded-2xl hover:bg-[#0A3D2E] transition-colors duration-200 text-center"
          >
            <Package className="w-8 h-8 mx-auto mb-2" />
            <span className="font-inter font-semibold">Novo Produto</span>
          </Link>
          
          <Link
            href="/admin/categorias/nova"
            className="bg-[#C05A2B] text-white p-4 rounded-2xl hover:bg-[#A0481F] transition-colors duration-200 text-center"
          >
            <FolderOpen className="w-8 h-8 mx-auto mb-2" />
            <span className="font-inter font-semibold">Nova Categoria</span>
          </Link>
          
          <Link
            href="/admin/blog/novo"
            className="bg-blue-500 text-white p-4 rounded-2xl hover:bg-blue-600 transition-colors duration-200 text-center"
          >
            <FileText className="w-8 h-8 mx-auto mb-2" />
            <span className="font-inter font-semibold">Novo Post</span>
          </Link>
          
          <Link
            href="/admin/depoimentos/novo"
            className="bg-purple-500 text-white p-4 rounded-2xl hover:bg-purple-600 transition-colors duration-200 text-center"
          >
            <MessageSquare className="w-8 h-8 mx-auto mb-2" />
            <span className="font-inter font-semibold">Novo Depoimento</span>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}