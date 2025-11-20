'use client';

import AdminLayout from '@/components/AdminLayout';
import ImageUpload from '@/components/ImageUpload';
import { ArrowLeft, Save, Star } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditarDepoimento() {
  const router = useRouter();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nome: '',
    comentario: '',
    estrelas: 5,
    foto: ''
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Buscar depoimento ao carregar
  useEffect(() => {
    const fetchDepoimento = async () => {
      try {
        const response = await fetch(`/api/depoimentos/${id}`, { cache: 'no-store' });

        if (response.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const data = await response.json();

        setFormData({
          nome: data.nome ?? '',
          comentario: data.comentario ?? '',
          estrelas: data.estrelas ?? 5,
          foto: data.foto ?? ''
        });
      } catch (error) {
        console.error('Erro ao buscar depoimento:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepoimento();
  }, [id]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.comentario) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/depoimentos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          comentario: formData.comentario,
          estrelas: formData.estrelas,
          foto: formData.foto
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar depoimento');
      }

      router.push('/admin/depoimentos');
    } catch (error) {
      console.error('Erro ao salvar depoimento:', error);
      alert('Erro ao salvar depoimento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return [...Array(5)].map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={interactive ? () => handleChange('estrelas', i + 1) : undefined}
        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
      >
        <Star
          className={`w-6 h-6 ${
            i < rating ? 'text-[#7FBA3D] fill-current' : 'text-gray-300'
          }`}
        />
      </button>
    ));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-10 text-center text-gray-500">Carregando...</div>
      </AdminLayout>
    );
  }

  if (notFound) {
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
            </div>
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
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Coluna Principal */}
            <div className="lg:col-span-2 space-y-6">

              <div className="bg-white rounded-2xl p-6 shadow">
                <h2 className="font-inter font-semibold text-lg mb-6">
                  Informações do Depoimento
                </h2>

                <div className="space-y-4">

                  {/* Nome */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => handleChange('nome', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>

                  {/* Estrelas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Avaliação *
                    </label>

                    <div className="flex items-center space-x-2">
                      {renderStars(formData.estrelas, true)}
                      <span className="ml-4 text-sm text-gray-600">
                        {formData.estrelas} de 5
                      </span>
                    </div>
                  </div>

                  {/* Depoimento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Depoimento *
                    </label>
                    <textarea
                      value={formData.comentario}
                      onChange={(e) => handleChange('comentario', e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>

                </div>
              </div>

            </div>

            {/* Sidebar */}
            <div className="space-y-6">

              {/* Foto */}
              <div className="bg-white rounded-2xl p-6 shadow">
                <h2 className="font-inter font-semibold text-lg mb-6">
                  Foto do Cliente
                </h2>

                <ImageUpload
                  value={formData.foto}
                  onChange={(url) => handleChange('foto', url)}
                  aspectRatio="aspect-square"
                />
              </div>

              {/* Botão Salvar */}
              <div className="bg-white rounded-2xl p-6 shadow">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 bg-purple-500 text-white px-6 py-3 rounded-2xl hover:bg-purple-600 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  <span>{isSubmitting ? 'Salvando...' : 'Salvar Alterações'}</span>
                </button>
              </div>

            </div>

          </div>
        </form>

      </div>
    </AdminLayout>
  );
}
