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
    preco: '',
    desconto: '',
    unidade: 'unidade',
    destaque: false
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
        preco: produtoEncontrado.preco?.toString() || '',
        desconto: produtoEncontrado.desconto?.toString() || '',
        unidade: produtoEncontrado.unidade || 'unidade',
        destaque: produtoEncontrado.destaque || false
      });
    }
  }, [id, produtos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.descricao || !formData.imagem || !formData.categoria) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!formData.preco) {
      alert('Por favor, preencha o preço.');
      return;
    }

    // Validar desconto se preenchido
    if (formData.desconto && (parseFloat(formData.desconto) < 0 || parseFloat(formData.desconto) > 100)) {
      alert('O desconto deve estar entre 0 e 100%.');
      return;
    }

    setIsSubmitting(true);

    try {
      atualizarProduto(id, {
        nome: formData.nome,
        descricao: formData.descricao,
        imagem: formData.imagem,
        categoria: formData.categoria,
        preco: parseFloat(formData.preco),
        desconto: formData.desconto ? parseFloat(formData.desconto) : 0,
        unidade: formData.unidade,
        destaque: formData.destaque
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

  // Calcular preço final com desconto
  const precoFinal = formData.preco && formData.desconto 
    ? parseFloat(formData.preco) * (1 - parseFloat(formData.desconto) / 100)
    : parseFloat(formData.preco) || 0;

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
                  Preço
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço (R$) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.preco ?? ''}
                      onChange={(e) => handleChange('preco', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent"
                      placeholder="0,00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Desconto (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.desconto ?? ''}
                      onChange={(e) => handleChange('desconto', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Preview do preço final */}
                {formData.preco && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                      <span>Preço base: R$ {parseFloat(formData.preco || '0').toFixed(2)}</span>
                      {formData.desconto && parseFloat(formData.desconto) > 0 && (
                        <>
                          <span className="mx-2">•</span>
                          <span>Desconto: {formData.desconto}%</span>
                          <span className="mx-2">•</span>
                          <span className="font-semibold text-[#7FBA3D]">
                            Preço final: R$ {precoFinal.toFixed(2)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
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