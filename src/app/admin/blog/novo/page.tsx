'use client';

import AdminLayout from '@/components/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { ArrowLeft, Save, FileText, Eye } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NovoPost() {
  const { adicionarPost } = useData();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    titulo: '',
    resumo: '',
    conteudo: '',
    imagem: '',
    autor: 'ECOLAR'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const post = {
        titulo: formData.titulo,
        resumo: formData.resumo,
        conteudo: formData.conteudo,
        imagem: formData.imagem || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
        autor: formData.autor,
        data: new Date().toISOString()
      };

      adicionarPost(post);
      router.push('/admin/blog');
    } catch (error) {
      console.error('Erro ao salvar post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
                Novo Post
              </h1>
              <p className="font-inter text-[#6b7280]">
                Crie um novo post para o blog da ECOLAR
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
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter text-lg"
                    placeholder="Ex: Como escolher os melhores tijolos para sua obra"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-inter font-medium text-[#111827] mb-2">
                      Autor
                    </label>
                    <input
                      type="text"
                      name="autor"
                      value={formData.autor}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
                      placeholder="Nome do autor"
                    />
                  </div>

                  <div>
                    <label className="block font-inter font-medium text-[#111827] mb-2">
                      URL da Imagem de Capa
                    </label>
                    <input
                      type="url"
                      name="imagem"
                      value={formData.imagem}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-inter font-medium text-[#111827] mb-2">
                    Resumo *
                  </label>
                  <textarea
                    name="resumo"
                    value={formData.resumo}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter resize-none"
                    placeholder="Escreva um resumo atrativo do post..."
                  />
                  <p className="text-sm text-[#6b7280] font-inter mt-1">
                    Este resumo aparecerá na listagem de posts e na página inicial
                  </p>
                </div>

                <div>
                  <label className="block font-inter font-medium text-[#111827] mb-2">
                    Conteúdo *
                  </label>
                  <textarea
                    name="conteudo"
                    value={formData.conteudo}
                    onChange={handleChange}
                    required
                    rows={15}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter resize-none"
                    placeholder="Escreva o conteúdo completo do post..."
                  />
                  <p className="text-sm text-[#6b7280] font-inter mt-1">
                    Use quebras de linha para separar parágrafos
                  </p>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
              <Link
                href="/admin/blog"
                className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-200 text-[#6b7280] rounded-2xl hover:bg-gray-50 transition-colors duration-200 font-inter font-medium"
              >
                <span>Cancelar</span>
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-2xl hover:bg-blue-600 transition-colors duration-200 font-inter font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{isSubmitting ? 'Salvando...' : 'Publicar Post'}</span>
              </button>
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
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop';
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
                <span>Por {formData.autor}</span>
                <span>•</span>
                <span>{new Date().toLocaleDateString('pt-BR')}</span>
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
                {formData.conteudo ? (
                  formData.conteudo.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="font-inter text-[#111827] text-lg leading-relaxed mb-6">
                        {paragraph}
                      </p>
                    )
                  ))
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