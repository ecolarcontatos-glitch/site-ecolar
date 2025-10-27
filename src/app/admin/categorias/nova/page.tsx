'use client';

import AdminLayout from '@/components/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { ArrowLeft, Save, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NovaCategoria() {
  const { adicionarCategoria } = useData();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    imagem: '',
    cor: '#7FBA3D'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const categoria = {
        nome: formData.nome,
        slug: formData.nome.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        descricao: formData.descricao,
        imagem: formData.imagem || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        cor: formData.cor
      };

      adicionarCategoria(categoria);
      router.push('/admin/categorias');
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const coresPredefinidas = [
    '#7FBA3D', '#C05A2B', '#3B82F6', '#8B5CF6', '#EF4444', 
    '#F59E0B', '#10B981', '#F97316', '#6366F1', '#EC4899'
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/categorias"
            className="p-2 text-[#6b7280] hover:text-[#C05A2B] hover:bg-[#C05A2B] hover:bg-opacity-10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="font-inter font-bold text-3xl text-[#111827] mb-2">
              Nova Categoria
            </h1>
            <p className="font-inter text-[#6b7280]">
              Crie uma nova categoria para organizar os produtos
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center space-x-3 mb-6">
              <FolderOpen className="w-6 h-6 text-[#C05A2B]" />
              <h2 className="font-inter font-semibold text-xl text-[#111827]">
                Informações da Categoria
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block font-inter font-medium text-[#111827] mb-2">
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C05A2B] focus:border-transparent font-inter"
                  placeholder="Ex: Tijolos e Blocos"
                />
              </div>

              <div>
                <label className="block font-inter font-medium text-[#111827] mb-2">
                  Cor da Categoria
                </label>
                <div className="space-y-3">
                  <input
                    type="color"
                    name="cor"
                    value={formData.cor}
                    onChange={handleChange}
                    className="w-full h-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C05A2B] focus:border-transparent"
                  />
                  <div className="flex flex-wrap gap-2">
                    {coresPredefinidas.map(cor => (
                      <button
                        key={cor}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, cor }))}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          formData.cor === cor ? 'border-gray-400 scale-110' : 'border-gray-200 hover:scale-105'
                        }`}
                        style={{ backgroundColor: cor }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <label className="block font-inter font-medium text-[#111827] mb-2">
                  Descrição
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C05A2B] focus:border-transparent font-inter resize-none"
                  placeholder="Descreva os tipos de produtos desta categoria..."
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block font-inter font-medium text-[#111827] mb-2">
                  URL da Imagem
                </label>
                <input
                  type="url"
                  name="imagem"
                  value={formData.imagem}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C05A2B] focus:border-transparent font-inter"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                <p className="text-sm text-[#6b7280] font-inter mt-1">
                  Deixe em branco para usar uma imagem padrão
                </p>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <h2 className="font-inter font-semibold text-xl text-[#111827] mb-6">
              Pré-visualização
            </h2>
            
            <div className="max-w-sm">
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="relative aspect-[4/3] bg-gray-100">
                  {formData.imagem ? (
                    <img
                      src={formData.imagem}
                      alt={formData.nome || 'Categoria'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderOpen className="w-12 h-12 text-[#6b7280]" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2">
                    {formData.nome || 'Nome da Categoria'}
                  </h3>
                  <p className="font-inter text-[#6b7280] text-sm mb-4">
                    {formData.descricao || 'Descrição da categoria...'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-inter font-medium bg-gray-100 text-gray-600">
                      0 produtos
                    </span>
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: formData.cor }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
            <Link
              href="/admin/categorias"
              className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-200 text-[#6b7280] rounded-2xl hover:bg-gray-50 transition-colors duration-200 font-inter font-medium"
            >
              <span>Cancelar</span>
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center space-x-2 bg-[#C05A2B] text-white px-6 py-3 rounded-2xl hover:bg-[#A0481F] transition-colors duration-200 font-inter font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? 'Salvando...' : 'Salvar Categoria'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}