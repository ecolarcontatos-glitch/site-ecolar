'use client';

import AdminLayout from '@/components/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { ArrowLeft, Save, MessageSquare, Star } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NovoDepoimento() {
  const { adicionarDepoimento } = useData();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    nome: '',
    texto: '',
    estrelas: 5,
    foto: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const depoimento = {
        nome: formData.nome,
        texto: formData.texto,
        estrelas: formData.estrelas,
        foto: formData.foto || ''
      };

      adicionarDepoimento(depoimento);
      router.push('/admin/depoimentos');
    } catch (error) {
      console.error('Erro ao salvar depoimento:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return [...Array(5)].map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={interactive ? () => setFormData(prev => ({ ...prev, estrelas: i + 1 })) : undefined}
        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        disabled={!interactive}
      >
        <Star
          className={`w-6 h-6 ${i < rating ? 'text-[#7FBA3D] fill-current' : 'text-gray-300'}`}
        />
      </button>
    ));
  };

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
              Novo Depoimento
            </h1>
            <p className="font-inter text-[#6b7280]">
              Adicione um novo depoimento de cliente
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center space-x-3 mb-6">
              <MessageSquare className="w-6 h-6 text-purple-500" />
              <h2 className="font-inter font-semibold text-xl text-[#111827]">
                Informações do Depoimento
              </h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block font-inter font-medium text-[#111827] mb-2">
                    Nome do Cliente *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-inter"
                    placeholder="Ex: Maria Silva"
                  />
                </div>

                <div>
                  <label className="block font-inter font-medium text-[#111827] mb-2">
                    URL da Foto (opcional)
                  </label>
                  <input
                    type="url"
                    name="foto"
                    value={formData.foto}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-inter"
                    placeholder="https://exemplo.com/foto.jpg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-inter font-medium text-[#111827] mb-3">
                  Avaliação *
                </label>
                <div className="flex items-center space-x-2">
                  {renderStars(formData.estrelas, true)}
                  <span className="ml-4 font-inter text-[#6b7280]">
                    {formData.estrelas} de 5 estrelas
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-inter font-medium text-[#111827] mb-2">
                  Depoimento *
                </label>
                <textarea
                  name="texto"
                  value={formData.texto}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-inter resize-none"
                  placeholder="Escreva o depoimento do cliente..."
                />
                <p className="text-sm text-[#6b7280] font-inter mt-1">
                  Escreva um depoimento autêntico e detalhado sobre a experiência do cliente
                </p>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <h2 className="font-inter font-semibold text-xl text-[#111827] mb-6">
              Pré-visualização
            </h2>
            
            <div className="max-w-md">
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                {/* Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    {formData.foto ? (
                      <img
                        src={formData.foto}
                        alt={formData.nome}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
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

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
            <Link
              href="/admin/depoimentos"
              className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-200 text-[#6b7280] rounded-2xl hover:bg-gray-50 transition-colors duration-200 font-inter font-medium"
            >
              <span>Cancelar</span>
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center space-x-2 bg-purple-500 text-white px-6 py-3 rounded-2xl hover:bg-purple-600 transition-colors duration-200 font-inter font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? 'Salvando...' : 'Salvar Depoimento'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}