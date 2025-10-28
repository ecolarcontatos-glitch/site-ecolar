'use client';

import { useState } from 'react';
import { Save, Upload, X, Plus } from 'lucide-react';
import Image from 'next/image';
import ImageUpload from '@/components/ImageUpload';

interface SiteConfig {
  logoHeader: string;
  logoFooter: string;
  heroImages: { url: string; order: number }[];
  telefone: string;
  email: string;
  endereco: string;
  whatsapp: string;
  textoRodape: string;
}

export default function ConfiguracoesPage() {
  const [config, setConfig] = useState<SiteConfig>({
    logoHeader: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/fa155124-8442-4fa3-aede-ff541b4163a7.png',
    logoFooter: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/fa155124-8442-4fa3-aede-ff541b4163a7.png',
    heroImages: [
      { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop', order: 1 },
      { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&h=1080&fit=crop', order: 2 },
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop', order: 3 },
      { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&h=1080&fit=crop', order: 4 }
    ],
    telefone: '(83) 2177-7553',
    email: 'ecolar.contatos@gmail.com',
    endereco: 'R. Pres. Washington Luís, 592 - Bessa, João Pessoa - PB, 58035-340',
    whatsapp: '558393661690',
    textoRodape: 'Materiais de construção com qualidade e sustentabilidade.'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [newHeroImage, setNewHeroImage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simular salvamento no arquivo de configuração
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        alert('Configurações salvas com sucesso!');
        // Recarregar a página para aplicar as mudanças
        window.location.reload();
      } else {
        throw new Error('Erro ao salvar');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoHeaderUpload = (url: string) => {
    setConfig({ ...config, logoHeader: url });
  };

  const handleLogoFooterUpload = (url: string) => {
    setConfig({ ...config, logoFooter: url });
  };

  const handleLogoHeaderRemove = () => {
    setConfig({ ...config, logoHeader: '' });
  };

  const handleLogoFooterRemove = () => {
    setConfig({ ...config, logoFooter: '' });
  };

  const addHeroImage = () => {
    if (newHeroImage.trim()) {
      const newOrder = Math.max(...config.heroImages.map(img => img.order), 0) + 1;
      setConfig({
        ...config,
        heroImages: [...config.heroImages, { url: newHeroImage.trim(), order: newOrder }]
      });
      setNewHeroImage('');
    }
  };

  const addHeroImageUpload = (url: string) => {
    const newOrder = Math.max(...config.heroImages.map(img => img.order), 0) + 1;
    setConfig({
      ...config,
      heroImages: [...config.heroImages, { url, order: newOrder }]
    });
  };

  const removeHeroImage = (index: number) => {
    setConfig({
      ...config,
      heroImages: config.heroImages.filter((_, i) => i !== index)
    });
  };

  const moveHeroImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...config.heroImages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newImages.length) {
      [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
      // Atualizar ordem
      newImages.forEach((img, i) => {
        img.order = i + 1;
      });
      setConfig({ ...config, heroImages: newImages });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Configurações do Site</h1>
        <p className="text-gray-600">Gerencie as informações e imagens do site ECOLAR</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Logos */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Logomarcas</h2>
          
          <div className="space-y-6">
            <ImageUpload
              label="Logo do Header"
              currentImage={config.logoHeader}
              onImageUploaded={handleLogoHeaderUpload}
              onImageRemoved={handleLogoHeaderRemove}
              aspectRatio="aspect-[3/1]"
            />

            <ImageUpload
              label="Logo do Footer"
              currentImage={config.logoFooter}
              onImageUploaded={handleLogoFooterUpload}
              onImageRemoved={handleLogoFooterRemove}
              aspectRatio="aspect-[3/1]"
            />
          </div>
        </div>

        {/* Informações de Contato */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações de Contato</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone Principal
              </label>
              <input
                type="text"
                value={config.telefone}
                onChange={(e) => setConfig({ ...config, telefone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7FBA3D]"
                placeholder="(83) 2177-7553"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail de Contato
              </label>
              <input
                type="email"
                value={config.email}
                onChange={(e) => setConfig({ ...config, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7FBA3D]"
                placeholder="ecolar.contatos@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço Completo
              </label>
              <textarea
                value={config.endereco}
                onChange={(e) => setConfig({ ...config, endereco: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7FBA3D]"
                placeholder="R. Pres. Washington Luís, 592 - Bessa, João Pessoa - PB, 58035-340"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp (com código do país)
              </label>
              <input
                type="text"
                value={config.whatsapp}
                onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7FBA3D]"
                placeholder="558393661690"
              />
              <p className="text-xs text-gray-500 mt-1">
                Formato: 55 (país) + 83 (DDD) + 93661690 (número)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto do Rodapé
              </label>
              <textarea
                value={config.textoRodape}
                onChange={(e) => setConfig({ ...config, textoRodape: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7FBA3D]"
                placeholder="Texto que aparece no rodapé do site"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Informações Atuais */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">📋 Informações Oficiais ECOLAR</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Endereço:</strong> R. Pres. Washington Luís, 592 - Bessa, João Pessoa - PB, 58035-340</p>
            <p><strong>Telefone:</strong> (83) 2177-7553</p>
          </div>
          <div>
            <p><strong>WhatsApp:</strong> (83) 9366-1690</p>
            <p><strong>E-mail:</strong> ecolar.contatos@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Imagens do Hero */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Imagens do Hero (Carrossel)</h2>
        
        {/* Upload de nova imagem */}
        <div className="mb-6">
          <ImageUpload
            label="Adicionar Nova Imagem do Hero"
            onImageUploaded={addHeroImageUpload}
            aspectRatio="aspect-video"
          />
        </div>

        {/* Adicionar por URL */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ou adicionar por URL
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newHeroImage}
              onChange={(e) => setNewHeroImage(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7FBA3D]"
              placeholder="URL da imagem (ex: https://images.unsplash.com/...)"
            />
            <button
              onClick={addHeroImage}
              className="px-4 py-2 bg-[#7FBA3D] text-white rounded-md hover:bg-[#0A3D2E] transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar</span>
            </button>
          </div>
        </div>

        {/* Lista de imagens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {config.heroImages.map((image, index) => (
            <div key={index} className="relative bg-gray-100 rounded-lg overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src={image.url}
                  alt={`Hero ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Ordem: {image.order}
                  </span>
                  <button
                    onClick={() => removeHeroImage(index)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => moveHeroImage(index, 'up')}
                    disabled={index === 0}
                    className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveHeroImage(index, 'down')}
                    disabled={index === config.heroImages.length - 1}
                    className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ↓
                  </button>
                </div>
                
                <input
                  type="text"
                  value={image.url}
                  onChange={(e) => {
                    const newImages = [...config.heroImages];
                    newImages[index].url = e.target.value;
                    setConfig({ ...config, heroImages: newImages });
                  }}
                  className="w-full mt-2 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#7FBA3D]"
                  placeholder="URL da imagem"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botão Salvar */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 bg-[#7FBA3D] text-white px-6 py-3 rounded-lg hover:bg-[#0A3D2E] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          <span>{isSaving ? 'Salvando...' : 'Salvar Configurações'}</span>
        </button>
      </div>
    </div>
  );
}