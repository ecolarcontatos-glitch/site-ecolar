'use client';

import AdminLayout from '@/components/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NovaInspiracao() {
  const { adicionarInspiracao } = useData();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    imagem: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const inspiracao = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        imagem: formData.imagem || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
      };

      adicionarInspiracao(inspiracao);
      router.push('/admin/inspiracoes');
    } catch (error) {
      console.error('Erro ao salvar inspiração:', error);
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
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/inspiracoes"
            className="p-2 text-[#6b7280] hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="font-inter font-bold text-3xl text-[#111827] mb-2">
              Nova Inspiração
            </h1>
            <p className="font-inter text-[#6b7280]">
              Adicione uma nova inspiração ao portfólio
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center space-x-3 mb-6">
              <ImageIcon className="w-6 h-6 text-pink-500" />
              <h2 className="font-inter font-semibold text-xl text-[#111827]">
                Informações da Inspiração
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block font-inter font-medium text-[#111827] mb-2">
                  Título da Inspiração *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent font-inter"
                  placeholder="Ex: Casa Moderna com Tijolos Aparentes"
                />
              </div>

              <div>
                <label className="block font-inter font-medium text-[#111827] mb-2">
                  URL da Imagem *
                </label>
                <input
                  type="url"
                  name="imagem"
                  value={formData.imagem}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent font-inter"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                <p className="text-sm text-[#6b7280] font-inter mt-1">
                  Use uma imagem de alta qualidade que represente bem o projeto
                </p>
              </div>

              <div>
                <label className="block font-inter font-medium text-[#111827] mb-2">
                  Descrição *
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent font-inter resize-none"
                  placeholder="Descreva o projeto, materiais utilizados e características especiais..."
                />
                <p className="text-sm text-[#6b7280] font-inter mt-1">
                  Destaque os materiais da ECOLAR utilizados no projeto
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
                      alt={formData.titulo || 'Inspiração'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-[#6b7280]" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2">
                    {formData.titulo || 'Título da Inspiração'}
                  </h3>
                  <p className="font-inter text-[#6b7280] text-sm">
                    {formData.descricao || 'Descrição da inspiração...'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
            <Link
              href="/admin/inspiracoes"
              className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-200 text-[#6b7280] rounded-2xl hover:bg-gray-50 transition-colors duration-200 font-inter font-medium"
            >
              <span>Cancelar</span>
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center space-x-2 bg-pink-500 text-white px-6 py-3 rounded-2xl hover:bg-pink-600 transition-colors duration-200 font-inter font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? 'Salvando...' : 'Salvar Inspiração'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}