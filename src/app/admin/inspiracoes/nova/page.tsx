'use client';

import AdminLayout from '@/components/AdminLayout';
import ImageUpload from '@/components/ImageUpload';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NovaInspiracao() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    imagem: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titulo || !formData.descricao || !formData.imagem) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/inspiracoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        alert(body?.error || 'Erro ao salvar inspiração.');
        return;
      }

      router.push('/admin/inspiracoes');
      router.refresh();
    } catch (error) {
      console.error('Erro ao salvar inspiração:', error);
      alert('Erro ao salvar inspiração. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informações Básicas */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                <h2 className="font-inter font-semibold text-[#111827] text-lg mb-6">
                  Informações da Inspiração
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título da Inspiração *
                    </label>
                    <input
                      type="text"
                      value={formData.titulo ?? ''}
                      onChange={(e) => handleChange('titulo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Ex: Casa Moderna com Tijolos Aparentes"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição *
                    </label>
                    <textarea
                      value={formData.descricao ?? ''}
                      onChange={(e) => handleChange('descricao', e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Descreva o projeto, materiais utilizados e características especiais..."
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Destaque os materiais da ECOLAR utilizados no projeto
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Imagem */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                <h2 className="font-inter font-semibold text-[#111827] text-lg mb-6">
                  Imagem da Inspiração *
                </h2>
                
                <ImageUpload
                  value={formData.imagem ?? ''}
                  onChange={(url) => handleChange('imagem', url)}
                  placeholder="Adicione uma imagem da inspiração"
                  aspectRatio="aspect-[4/3]"
                />
              </div>

              {/* Ações */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center space-x-2 bg-pink-500 text-white px-6 py-3 rounded-2xl hover:bg-pink-600 transition-colors duration-200 font-inter font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    <span>{isSubmitting ? 'Salvando...' : 'Salvar Inspiração'}</span>
                  </button>

                  <Link
                    href="/admin/inspiracoes"
                    className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-2xl hover:bg-gray-50 transition-colors duration-200 font-inter font-medium"
                  >
                    <span>Cancelar</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          {(formData.titulo || formData.descricao || formData.imagem) && (
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <h2 className="font-inter font-semibold text-[#111827] text-lg mb-6">
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
          )}
        </form>
      </div>
    </AdminLayout>
  );
}