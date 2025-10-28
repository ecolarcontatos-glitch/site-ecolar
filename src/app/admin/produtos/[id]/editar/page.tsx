'use client';

import AdminLayout from '@/components/AdminLayout';
import ImageUpload from '@/components/ImageUpload';
import { useData } from '@/contexts/DataContext';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditarProduto() {
  const { produtos, categorias, atualizarProduto } = useData();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    imagem: '',
    categoria: '',
    preco_fabrica: '',
    preco_pronta_entrega: '',
    unidade: 'unidade',
    destaque: false,
    disponivel: true,
    disponivel_fabrica: true,
    disponivel_pronta_entrega: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    const produtoEncontrado = produtos.find(p => p.id === id);
    if (produtoEncontrado) {
      setProduto(produtoEncontrado);
      setFormData({
        nome: produtoEncontrado.nome || '',
        descricao: produtoEncontrado.descricao || '',
        imagem: produtoEncontrado.imagem || '',
        categoria: produtoEncontrado.categoria || '',
        preco_fabrica: produtoEncontrado.preco_fabrica?.toString() || '',
        preco_pronta_entrega: produtoEncontrado.preco_pronta_entrega?.toString() || '',
        unidade: produtoEncontrado.unidade || 'unidade',
        destaque: produtoEncontrado.destaque || false,
        disponivel: produtoEncontrado.disponivel !== false,
        disponivel_fabrica: produtoEncontrado.disponivel_fabrica !== false,
        disponivel_pronta_entrega: produtoEncontrado.disponivel_pronta_entrega !== false
      });
    }
  }, [id, produtos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.descricao || !formData.imagem || !formData.categoria) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!formData.preco_fabrica || !formData.preco_pronta_entrega) {
      alert('Por favor, preencha os preços.');
      return;
    }

    setIsSubmitting(true);

    try {
      atualizarProduto(id, {
        nome: formData.nome,
        descricao: formData.descricao,
        imagem: formData.imagem,
        categoria: formData.categoria,
        preco_fabrica: parseFloat(formData.preco_fabrica),
        preco_pronta_entrega: parseFloat(formData.preco_pronta_entrega),
        unidade: formData.unidade,
        destaque: formData.destaque,
        disponivel: formData.disponivel,
        disponivel_fabrica: formData.disponivel_fabrica,
        disponivel_pronta_entrega: formData.disponivel_pronta_entrega
      });

      router.push('/admin/produtos');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar produto. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!produto) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Produto não encontrado.</p>
          <Link
            href="/admin/produtos"
            className="inline-block mt-4 text-[#7FBA3D] hover:underline"
          >
            Voltar para produtos
          </Link>
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
            href="/admin/produtos"
            className="p-2 text-[#6b7280] hover:text-[#7FBA3D] hover:bg-[#7FBA3D] hover:bg-opacity-10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="font-inter font-bold text-3xl text-[#111827] mb-2">
              Editar Produto
            </h1>
            <p className="font-inter text-[#6b7280]">
              Edite as informações do produto
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
                      Nome do Produto *
                    </label>
                    <input
                      type="text"
                      value={formData.nome ?? ''}
                      onChange={(e) => handleChange('nome', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent"
                      placeholder="Ex: Tijolo Cerâmico 6 Furos"
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
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent"
                      placeholder="Descreva as características e especificações do produto..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria *
                    </label>
                    <select
                      value={formData.categoria ?? ''}
                      onChange={(e) => handleChange('categoria', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {categorias.map(categoria => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unidade de Medida
                    </label>
                    <select
                      value={formData.unidade ?? 'unidade'}
                      onChange={(e) => handleChange('unidade', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent"
                    >
                      <option value="unidade">Unidade</option>
                      <option value="m²">Metro Quadrado (m²)</option>
                      <option value="m³">Metro Cúbico (m³)</option>
                      <option value="kg">Quilograma (kg)</option>
                      <option value="saco">Saco</option>
                      <option value="milheiro">Milheiro</option>
                      <option value="carrada">Carrada</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Preços */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                <h2 className="font-inter font-semibold text-[#111827] text-lg mb-6">
                  Preços
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço Fábrica (R$) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.preco_fabrica ?? ''}
                      onChange={(e) => handleChange('preco_fabrica', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent"
                      placeholder="0,00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço Pronta Entrega (R$) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.preco_pronta_entrega ?? ''}
                      onChange={(e) => handleChange('preco_pronta_entrega', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent"
                      placeholder="0,00"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Imagem */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                <h2 className="font-inter font-semibold text-[#111827] text-lg mb-6">
                  Imagem do Produto *
                </h2>
                
                <ImageUpload
                  value={formData.imagem ?? ''}
                  onChange={(url) => handleChange('imagem', url)}
                  placeholder="Adicione uma imagem do produto"
                />
              </div>

              {/* Configurações */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                <h2 className="font-inter font-semibold text-[#111827] text-lg mb-6">
                  Configurações
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="destaque"
                      checked={formData.destaque ?? false}
                      onChange={(e) => handleChange('destaque', e.target.checked)}
                      className="h-4 w-4 text-[#7FBA3D] focus:ring-[#7FBA3D] border-gray-300 rounded"
                    />
                    <label htmlFor="destaque" className="ml-2 block text-sm text-gray-700">
                      Produto em destaque
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="disponivel"
                      checked={formData.disponivel ?? true}
                      onChange={(e) => handleChange('disponivel', e.target.checked)}
                      className="h-4 w-4 text-[#7FBA3D] focus:ring-[#7FBA3D] border-gray-300 rounded"
                    />
                    <label htmlFor="disponivel" className="ml-2 block text-sm text-gray-700">
                      Produto disponível no site
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="disponivel_fabrica"
                      checked={formData.disponivel_fabrica ?? true}
                      onChange={(e) => handleChange('disponivel_fabrica', e.target.checked)}
                      className="h-4 w-4 text-[#7FBA3D] focus:ring-[#7FBA3D] border-gray-300 rounded"
                    />
                    <label htmlFor="disponivel_fabrica" className="ml-2 block text-sm text-gray-700">
                      Disponível direto da fábrica
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="disponivel_pronta_entrega"
                      checked={formData.disponivel_pronta_entrega ?? true}
                      onChange={(e) => handleChange('disponivel_pronta_entrega', e.target.checked)}
                      className="h-4 w-4 text-[#7FBA3D] focus:ring-[#7FBA3D] border-gray-300 rounded"
                    />
                    <label htmlFor="disponivel_pronta_entrega" className="ml-2 block text-sm text-gray-700">
                      Disponível para pronta entrega
                    </label>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center space-x-2 bg-[#7FBA3D] text-white px-6 py-3 rounded-2xl hover:bg-[#0A3D2E] transition-colors duration-200 font-inter font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    <span>{isSubmitting ? 'Salvando...' : 'Salvar Alterações'}</span>
                  </button>

                  <Link
                    href="/admin/produtos"
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