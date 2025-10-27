'use client';

import AdminLayout from '@/components/AdminLayout';
import { useData } from '@/contexts/DataContext';
import { ArrowLeft, Save, Package } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NovoProduto() {
  const { categorias, adicionarProduto } = useData();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    descricao: '',
    imagem: '',
    destaque: false,
    preco_fabrica: '',
    preco_pronta_entrega: '',
    disponivel_fabrica: true,
    disponivel_pronta_entrega: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const produto = {
        nome: formData.nome,
        categoria: formData.categoria,
        descricao: formData.descricao,
        imagem: formData.imagem || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        destaque: formData.destaque,
        preco_fabrica: parseFloat(formData.preco_fabrica) || 0,
        preco_pronta_entrega: parseFloat(formData.preco_pronta_entrega) || 0,
        disponivel_fabrica: formData.disponivel_fabrica,
        disponivel_pronta_entrega: formData.disponivel_pronta_entrega
      };

      adicionarProduto(produto);
      router.push('/admin/produtos');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/produtos"
            className="p-2 text-[#6b7280] hover:text-[#7FBA3D] hover:bg-[#7FBA3D] hover:bg-opacity-10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="font-inter font-bold text-3xl text-[#111827] mb-2">
              Novo Produto
            </h1>
            <p className="font-inter text-[#6b7280]">
              Adicione um novo produto ao catálogo da ECOLAR
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex items-center space-x-3 mb-6">
              <Package className="w-6 h-6 text-[#7FBA3D]" />
              <h2 className="font-inter font-semibold text-xl text-[#111827]">
                Informações Básicas
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block font-inter font-medium text-[#111827] mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent font-inter"
                  placeholder="Ex: Tijolo Cerâmico 6 Furos"
                />
              </div>

              <div>
                <label className="block font-inter font-medium text-[#111827] mb-2">
                  Categoria *
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent font-inter bg-white"
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </option>
                  ))}
                </select>
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent font-inter resize-none"
                  placeholder="Descreva as características e especificações do produto..."
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent font-inter"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                <p className="text-sm text-[#6b7280] font-inter mt-1">
                  Deixe em branco para usar uma imagem padrão
                </p>
              </div>
            </div>
          </div>

          {/* Preços e Disponibilidade */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <h2 className="font-inter font-semibold text-xl text-[#111827] mb-6">
              Preços e Disponibilidade
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Fábrica */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="disponivel_fabrica"
                    checked={formData.disponivel_fabrica}
                    onChange={handleChange}
                    className="w-5 h-5 text-[#7FBA3D] border-gray-300 rounded focus:ring-[#7FBA3D]"
                  />
                  <label className="font-inter font-medium text-[#111827]">
                    Disponível para Fábrica
                  </label>
                </div>
                {formData.disponivel_fabrica && (
                  <div>
                    <label className="block font-inter font-medium text-[#111827] mb-2">
                      Preço de Fábrica (R$)
                    </label>
                    <input
                      type="number"
                      name="preco_fabrica"
                      value={formData.preco_fabrica}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent font-inter"
                      placeholder="0,00"
                    />
                  </div>
                )}
              </div>

              {/* Pronta Entrega */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="disponivel_pronta_entrega"
                    checked={formData.disponivel_pronta_entrega}
                    onChange={handleChange}
                    className="w-5 h-5 text-[#7FBA3D] border-gray-300 rounded focus:ring-[#7FBA3D]"
                  />
                  <label className="font-inter font-medium text-[#111827]">
                    Disponível para Pronta Entrega
                  </label>
                </div>
                {formData.disponivel_pronta_entrega && (
                  <div>
                    <label className="block font-inter font-medium text-[#111827] mb-2">
                      Preço Pronta Entrega (R$)
                    </label>
                    <input
                      type="number"
                      name="preco_pronta_entrega"
                      value={formData.preco_pronta_entrega}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent font-inter"
                      placeholder="0,00"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Configurações */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <h2 className="font-inter font-semibold text-xl text-[#111827] mb-6">
              Configurações
            </h2>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="destaque"
                checked={formData.destaque}
                onChange={handleChange}
                className="w-5 h-5 text-[#7FBA3D] border-gray-300 rounded focus:ring-[#7FBA3D]"
              />
              <label className="font-inter font-medium text-[#111827]">
                Produto em Destaque
              </label>
            </div>
            <p className="text-sm text-[#6b7280] font-inter mt-2">
              Produtos em destaque aparecem na página inicial e na seção de produtos em destaque
            </p>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
            <Link
              href="/admin/produtos"
              className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-200 text-[#6b7280] rounded-2xl hover:bg-gray-50 transition-colors duration-200 font-inter font-medium"
            >
              <span>Cancelar</span>
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center space-x-2 bg-[#7FBA3D] text-white px-6 py-3 rounded-2xl hover:bg-[#0A3D2E] transition-colors duration-200 font-inter font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? 'Salvando...' : 'Salvar Produto'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}