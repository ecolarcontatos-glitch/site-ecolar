'use client';

import AdminLayout from '@/components/AdminLayout';
import ImageUpload from '@/components/ImageUpload';
import { useData } from '@/contexts/DataContext';
import { ArrowLeft, Save, Star } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditarDepoimento() {
  const { depoimentos, atualizarDepoimento } = useData();
  const router = useRouter();
  const params = useParams();
  const depoimentoId = params.id as string;
  
  const [formData, setFormData] = useState({
    nome: '',
    texto: '',
    estrelas: 5,
    foto: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [depoimentoEncontrado, setDepoimentoEncontrado] = useState(false);

  useEffect(() => {
    if (depoimentoId && depoimentos.length > 0) {
      const depoimento = depoimentos.find(d => d.id === depoimentoId);
      if (depoimento) {
        setFormData({
          nome: depoimento.nome || '',
          texto: depoimento.texto || '',
          estrelas: depoimento.estrelas || 5,
          foto: depoimento.foto || ''
        });
        setDepoimentoEncontrado(true);
      } else {
        setDepoimentoEncontrado(false);
      }
    }
  }, [depoimentoId, depoimentos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.texto) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);

    try {
      const depoimentoAtualizado = {
        nome: formData.nome,
        texto: formData.texto,
        estrelas: formData.estrelas,
        foto: formData.foto
      };

      atualizarDepoimento(depoimentoId, depoimentoAtualizado);
      router.push('/admin/depoimentos');
    } catch (error) {
      console.error('Erro ao salvar depoimento:', error);
      alert('Erro ao salvar depoimento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStars = (rating: number, interactive = false) => {
    return [...Array(5)].map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={interactive ? () => handleChange('estrelas', i + 1) : undefined}
        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        disabled={!interactive}
      >
        <Star
          className={`w-6 h-6 ${i < rating ? 'text-[#7FBA3D] fill-current' : 'text-gray-300'}`}
        />
      </button>
    ));
  };

  if (!depoimentoEncontrado && depoimentos.length > 0) {
    return (
      <AdminLayout>
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/depoimentos"
              className="p-2 text-[#6b7280] hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="font-inter font-bold text-3xl text-[#111827] mb-2">
                Depoimento não encontrado
              </h1>
              <p className="font-inter text-[#6b7280]">
                O depoimento que você está tentando editar não foi encontrado.
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-center">
            <p className="text-gray-500 mb-4">
              Este depoimento pode ter sido removido ou o ID está incorreto.
            </p>
            <Link
              href="/admin/depoimentos"
              className="inline-flex items-center space-x-2 bg-purple-500 text-white px-6 py-3 rounded-2xl hover:bg-purple-600 transition-colors duration-200 font-inter font-medium"
            >
              <span>Voltar para Depoimentos</span>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/depoimentos"
            className="p-2 text-[#6b7280] hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="font-inter font-bold text-3xl text-[#111827] mb-2">
              Editar Depoimento
            </h1>
            <p className="font-inter text-[#6b7280]">
              Edite as informações do depoimento
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
                  Informações do Depoimento
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Cliente *
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => handleChange('nome', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ex: Maria Silva"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Avaliação *
                    </label>
                    <div className="flex items-center space-x-2">
                      {renderStars(formData.estrelas, true)}
                      <span className="ml-4 text-sm text-gray-600">
                        {formData.estrelas} de 5 estrelas
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Depoimento *
                    </label>
                    <textarea
                      value={formData.texto}
                      onChange={(e) => handleChange('texto', e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Escreva o depoimento do cliente..."
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Escreva um depoimento autêntico e detalhado sobre a experiência do cliente
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Foto do Cliente */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                <h2 className="font-inter font-semibold text-[#111827] text-lg mb-6">
                  Foto do Cliente (opcional)
                </h2>
                
                <ImageUpload
                  value={formData.foto}
                  onChange={(url) => handleChange('foto', url)}
                  placeholder="Adicione uma foto do cliente"
                  aspectRatio="aspect-square"
                />
              </div>

              {/* Ações */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center space-x-2 bg-purple-500 text-white px-6 py-3 rounded-2xl hover:bg-purple-600 transition-colors duration-200 font-inter font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    <span>{isSubmitting ? 'Salvando...' : 'Salvar Alterações'}</span>
                  </button>

                  <Link
                    href="/admin/depoimentos"
                    className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-2xl hover:bg-gray-50 transition-colors duration-200 font-inter font-medium"
                  >
                    <span>Cancelar</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          {(formData.nome || formData.texto) && (
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <h2 className="font-inter font-semibold text-[#111827] text-lg mb-6">
                Pré-visualização
              </h2>
              
              <div className="max-w-md">
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  {/* Header */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden">
                      {formData.foto ? (
                        <img
                          src={formData.foto}
                          alt={formData.nome}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="font-inter font-semibold text-purple-600 text-lg">
                          {formData.nome ? formData.nome.charAt(0).toUpperCase() : '?'}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-inter font-semibold text-[#111827]">
                        {formData.nome || 'Nome do Cliente'}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {renderStars(formData.estrelas)}
                      </div>
                    </div>
                  </div>

                  {/* Texto */}
                  <blockquote className="font-inter text-[#6b7280] italic leading-relaxed">
                    "{formData.texto || 'O depoimento aparecerá aqui...'}"
                  </blockquote>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </AdminLayout>
  );
}