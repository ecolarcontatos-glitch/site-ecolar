// src/app/admin/blog/editar/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, FileText, Eye } from 'lucide-react';

import AdminLayout from '@/components/AdminLayout';
import ImageUpload from '@/components/ImageUpload';
import { useData } from '@/contexts/DataContext';

interface PostData {
  id: string | number;
  titulo: string;
  resumo: string;
  descricao: string;
  imagem: string;
  autor: string;
  data_publicacao?: string;
  status?: string;
}

export const dynamic = 'force-dynamic';

export default function EditarPost() {
  const router = useRouter();
  const params = useParams();
  const { posts, isLoading, atualizarPost } = useData();

  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    titulo: '',
    resumo: '',
    descricao: '',
    imagem: '',
    autor: 'ECOLAR',
    data_publicacao: '',
    status: 'publicado'
  });

  // Buscar o post pelo ID a partir dos posts carregados no DataContext
  useEffect(() => {
    if (!params?.id) return;

    // Espera o DataContext terminar de carregar
    if (isLoading) return;

    const idParam = Array.isArray(params.id)
      ? params.id[0]
      : (params.id as string);

    const encontrado = posts.find((p: any) => String(p.id) === String(idParam));

    if (encontrado) {
      const dataPublicacao =
        (encontrado.data_publicacao as string | undefined) || '';

      setPost(encontrado as PostData);
      setFormData({
        titulo: encontrado.titulo ?? '',
        resumo: encontrado.resumo ?? '',
        descricao: encontrado.descricao ?? '',
        imagem: encontrado.imagem ?? '',
        autor: encontrado.autor ?? 'ECOLAR',
        data_publicacao: dataPublicacao,
        status: encontrado.status ?? 'publicado'
      });
    }

    setLoading(false);
  }, [params, posts, isLoading]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    setIsSubmitting(true);

    try {
      const idParam = Array.isArray(params.id)
        ? params.id[0]
        : (params.id as string);

      await atualizarPost(idParam, {
        titulo: formData.titulo,
        resumo: formData.resumo,
        descricao: formData.descricao,
        imagem: formData.imagem,
        autor: formData.autor,
        data_publicacao: formData.data_publicacao,
        status: formData.status
      });

      router.push('/admin/blog');
    } catch (error) {
      console.error('❌ Erro ao atualizar post:', error);
      alert('Erro ao atualizar post. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // LOADING
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando post...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // NOT FOUND
  if (!post) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Post não encontrado
          </h1>
          <Link
            href="/admin/blog"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Voltar para o blog
          </Link>
        </div>
      </AdminLayout>
    );
  }

  // FORMULÁRIO + PREVIEW (mesmo estilo da página "novo")
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/blog"
              className="p-2 text-[#6b7280] hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="font-inter font-bold text-3xl text-[#111827] mb-2">
                Editar Post
              </h1>
              <p className="font-inter text-[#6b7280]">
                Atualize as informações do post &quot;{post.titulo}&quot;
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-200 text-[#6b7280] rounded-xl hover:bg-gray-50 transition-colors duration-200 font-inter font-medium"
          >
            <Eye className="w-4 h-4" />
            <span>{showPreview ? 'Editar' : 'Visualizar'}</span>
          </button>
        </div>

        {!showPreview ? (
          /* Formulário */
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Coluna Principal */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                  <div className="flex items-center space-x-3 mb-6">
                    <FileText className="w-6 h-6 text-blue-500" />
                    <h2 className="font-inter font-semibold text-xl text-[#111827]">
                      Informações do Post
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block font-inter font-medium text-[#111827] mb-2">
                        Título do Post *
                      </label>
                      <input
                        type="text"
                        value={formData.titulo}
                        onChange={(e) =>
                          handleChange('titulo', e.target.value)
                        }
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter text-lg"
                        placeholder="Título do post"
                      />
                    </div>

                    <div>
                      <label className="block font-inter font-medium text-[#111827] mb-2">
                        Autor
                      </label>
                      <input
                        type="text"
                        value={formData.autor}
                        onChange={(e) =>
                          handleChange('autor', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
                        placeholder="Nome do autor"
                      />
                    </div>

                    <div>
                      <label className="block font-inter font-medium text-[#111827] mb-2">
                        Resumo *
                      </label>
                      <textarea
                        value={formData.resumo}
                        onChange={(e) =>
                          handleChange('resumo', e.target.value)
                        }
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter resize-none"
                        placeholder="Resumo do post..."
                      />
                      <p className="text-sm text-[#6b7280] font-inter mt-1">
                        Este resumo aparece na listagem de posts e na página
                        inicial.
                      </p>
                    </div>

                    <div>
                      <label className="block font-inter font-medium text-[#111827] mb-2">
                        Conteúdo *
                      </label>
                      <textarea
                        value={formData.descricao}
                        onChange={(e) =>
                          handleChange('descricao', e.target.value)
                        }
                        required
                        rows={15}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter resize-none"
                        placeholder="Conteúdo completo do post..."
                      />
                      <p className="text-sm text-[#6b7280] font-inter mt-1">
                        Use quebras de linha para separar parágrafos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Imagem de Capa */}
                <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                  <h2 className="font-inter font-semibold text-[#111827] text-lg mb-6">
                    Imagem de Capa
                  </h2>

                  <ImageUpload
                    value={formData.imagem}
                    onChange={(url) => handleChange('imagem', url)}
                    placeholder="Atualize a imagem de capa do post"
                    aspectRatio="aspect-[16/9]"
                  />
                </div>

                {/* Ações */}
                <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-2xl hover:bg-blue-600 transition-colors duration-200 font-inter font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-5 h-5" />
                      <span>
                        {isSubmitting
                          ? 'Salvando...'
                          : 'Salvar Alterações'}
                      </span>
                    </button>

                    <Link
                      href="/admin/blog"
                      className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-2xl hover:bg-gray-50 transition-colors duration-200 font-inter font-medium"
                    >
                      <span>Cancelar</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </form>
        ) : (
          /* Preview */
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="max-w-4xl mx-auto">
              {/* Imagem de capa */}
              {formData.imagem && (
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8">
                  <img
                    src={formData.imagem}
                    alt={formData.titulo}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop';
                    }}
                  />
                </div>
              )}

              {/* Título */}
              <h1 className="font-inter font-bold text-4xl text-[#111827] mb-4">
                {formData.titulo || 'Título do Post'}
              </h1>

              {/* Meta informações */}
              <div className="flex items-center space-x-4 text-[#6b7280] font-inter mb-8 pb-8 border-b border-gray-200">
                <span>Por {formData.autor || 'ECOLAR'}</span>
                <span>•</span>
                <span>
                  {formData.data_publicacao
                    ? new Date(formData.data_publicacao).toLocaleDateString(
                        'pt-BR'
                      )
                    : new Date().toLocaleDateString('pt-BR')}
                </span>
              </div>

              {/* Resumo */}
              {formData.resumo && (
                <div className="bg-[#f8fafc] rounded-2xl p-6 mb-8">
                  <p className="font-inter text-[#6b7280] text-lg italic">
                    {formData.resumo}
                  </p>
                </div>
              )}

              {/* Conteúdo */}
              <div className="prose prose-lg max-w-none">
                {formData.descricao ? (
                  formData.descricao
                    .split('\n')
                    .map((paragraph, index) =>
                      paragraph.trim() ? (
                        <p
                          key={index}
                          className="font-inter text-[#111827] text-lg leading-relaxed mb-6"
                        >
                          {paragraph}
                        </p>
                      ) : null
                    )
                ) : (
                  <p className="font-inter text-[#6b7280] text-lg">
                    O conteúdo do post aparecerá aqui...
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
