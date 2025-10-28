'use client';

import AdminLayout from '@/components/AdminLayout';
import ImageUpload from '@/components/ImageUpload';
import { useData } from '@/contexts/DataContext';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NovaCategoria() {
  const { adicionarCategoria } = useData();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    slug: '',
    imagem: '',
    cor: '#C05A2B'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateSlug = (nome: string) => {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.descricao || !formData.imagem) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);

    try {
      adicionarCategoria({
        nome: formData.nome,
        descricao: formData.descricao,
        slug: formData.slug || generateSlug(formData.nome),
        imagem: formData.imagem,
        cor: formData.cor
      });

      router.push('/admin/categorias');
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      alert('Erro ao criar categoria. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/categorias"
            className="p-2 text-[#6b7280] hover:text-[#C05A2B] hover:bg-[#C05A2B] hover:bg-opacity-10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-inter font-bold text-3xl text-[#111827] mb-2">
              Nova Categoria
            </h1>
            <p className="font-inter text-[#6b7280]">
              Adicione uma nova categoria de produtos
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informações Básicas */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                <h2 className="font-inter font-semibold text-[#111827] text-lg mb-6">
                  Informações Básicas
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Categoria *
                    </label>
                    <input
                      type="text"
                      value={formData.nome ?? ''}
                      onChange={(e) => {
                        const nome = e.target.value;
                        handleChange('nome', nome);
                        handleChange('slug', generateSlug(nome));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C05A2B] focus:border-transparent"
                      placeholder="Ex: Tijolos e Blocos"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug (URL)
                    </label>
                    <input
                      type="text"
                      value={formData.slug ?? ''}
                      onChange={(e) => handleChange('slug', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C05A2B] focus:border-transparent"
                      placeholder="tijolos-e-blocos"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Gerado automaticamente a partir do nome
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição *
                    </label>
                    <textarea
                      value={formData.descricao ?? ''}
                      onChange={(e) => handleChange('descricao', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C05A2B] focus:border-transparent"
                      placeholder="Descreva esta categoria de produtos..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor da Categoria
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={formData.cor ?? '#C05A2B'}
                        onChange={(e) => handleChange('cor', e.target.value)}
                        className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.cor ?? '#C05A2B'}
                        onChange={(e) => handleChange('cor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C05A2B] focus:border-transparent"
                        placeholder="#C05A2B"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Imagem */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                <h2 className="font-inter font-semibold text-[#111827] text-lg mb-6">
                  Imagem da Categoria *
                </h2>
                
                <ImageUpload
                  value={formData.imagem ?? ''}
                  onChange={(url) => handleChange('imagem', url)}
                  placeholder="Adicione uma imagem da categoria"
                />
              </div>

              {/* Ações */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center space-x-2 bg-[#C05A2B] text-white px-6 py-3 rounded-2xl hover:bg-[#A0481F] transition-colors duration-200 font-inter font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    <span>{isSubmitting ? 'Salvando...' : 'Salvar Categoria'}</span>
                  </button>

                  <Link
                    href="/admin/categorias"
                    className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-2xl hover:bg-gray-50 transition-colors duration-200 font-inter font-medium"
                  >
                    <span>Cancelar</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}