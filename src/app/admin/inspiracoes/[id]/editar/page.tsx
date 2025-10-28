'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

export default function EditarInspiracao() {
  const router = useRouter();
  const params = useParams();
  const { inspiracoes, atualizarInspiracao } = useData();
  
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    imagem: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [inspiracao, setInspiracao] = useState(null);

  useEffect(() => {
    if (params.id) {
      const inspiracaoEncontrada = inspiracoes.find(i => i.id === params.id);
      if (inspiracaoEncontrada) {
        setInspiracao(inspiracaoEncontrada);
        setFormData({
          titulo: inspiracaoEncontrada.titulo,
          descricao: inspiracaoEncontrada.descricao,
          imagem: inspiracaoEncontrada.imagem
        });
      }
    }
  }, [params.id, inspiracoes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo.trim() || !formData.descricao.trim() || !formData.imagem.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSaving(true);

    try {
      await atualizarInspiracao(params.id as string, {
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim(),
        imagem: formData.imagem.trim()
      });

      alert('Inspiração atualizada com sucesso!');
      router.push('/admin/inspiracoes');
    } catch (error) {
      console.error('Erro ao atualizar inspiração:', error);
      alert('Erro ao atualizar inspiração. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, imagem: url });
  };

  const handleImageRemove = () => {
    setFormData({ ...formData, imagem: '' });
  };

  if (!inspiracao) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando inspiração...</p>
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
            href="/admin/inspiracoes"
            className="p-2 text-gray-600 hover:text-pink-500 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="font-inter font-bold text-3xl text-[#111827] mb-2">
              Editar Inspiração
            </h1>
            <p className="font-inter text-[#6b7280]">
              Atualize as informações da inspiração
            </p>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent font-inter"
                placeholder="Ex: Casa Colonial Moderna"
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent font-inter resize-none"
                placeholder="Descreva o projeto e como os materiais ECOLAR foram utilizados..."
                required
              />
            </div>

            {/* Imagem */}
            <div>
              <ImageUpload
                label="Imagem da Inspiração *"
                currentImage={formData.imagem}
                onImageUploaded={handleImageUpload}
                onImageRemoved={handleImageRemove}
                aspectRatio="aspect-[4/3]"
              />
              
              {/* Campo de URL alternativo */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ou insira a URL da imagem
                </label>
                <input
                  type="url"
                  value={formData.imagem}
                  onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent font-inter"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Link
                href="/admin/inspiracoes"
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-inter font-medium transition-colors"
              >
                Cancelar
              </Link>
              
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center space-x-2 bg-pink-500 text-white px-8 py-3 rounded-xl hover:bg-pink-600 transition-colors duration-200 font-inter font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}