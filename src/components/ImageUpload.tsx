'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUploaded?: (url: string) => void;
  currentImage?: string;
  onImageRemoved?: () => void;
  label?: string;
  aspectRatio?: string;
  className?: string;
  value?: string;
  onChange?: (url: string) => void;
  placeholder?: string;
}

export default function ImageUpload({ 
  onImageUploaded, 
  currentImage, 
  onImageRemoved, 
  label = "Imagem",
  aspectRatio = "aspect-video",
  className = "",
  value,
  onChange,
  placeholder
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Usar value/onChange se fornecidos, senão usar currentImage/onImageUploaded
  const currentImageUrl = value ?? imageUrl;
  const handleImageChange = onChange ?? onImageUploaded;

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError('O arquivo deve ter no máximo 5MB.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro no upload');
      }

      const data = await response.json();
      
      // Validar se a função existe antes de chamar
      if (handleImageChange && typeof handleImageChange === 'function') {
        handleImageChange(data.url);
      }
      
      // Limpar o campo de URL quando upload for feito
      setImageUrl('');
    } catch (error) {
      console.error('Erro no upload:', error);
      setError(error instanceof Error ? error.message : 'Erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    
    // Se URL válida for inserida, usar ela
    if (url.trim() && isValidImageUrl(url)) {
      if (handleImageChange && typeof handleImageChange === 'function') {
        handleImageChange(url.trim());
      }
      setError('');
    }
  };

  const isValidImageUrl = (url: string) => {
    try {
      // Se for uma URL válida, retorna true
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };


  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemove = () => {
    if (onImageRemoved && typeof onImageRemoved === 'function') {
      onImageRemoved();
    } else if (onChange && typeof onChange === 'function') {
      onChange('');
    }
    setImageUrl('');
    setError('');
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {/* Mensagem de erro */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      {currentImageUrl ? (
        <div className="relative">
          <div className={`relative ${aspectRatio} bg-gray-100 rounded-2xl overflow-hidden`}>
            <Image
              src={currentImageUrl}
              alt={label}
              fill
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Upload Area */}
          <div
            className={`relative ${aspectRatio} border-2 border-dashed rounded-2xl transition-colors ${
              dragActive 
                ? 'border-[#7FBA3D] bg-green-50' 
                : 'border-gray-300 hover:border-[#7FBA3D]'
            } ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7FBA3D] mb-4"></div>
                  <p className="text-sm text-gray-600">Fazendo upload...</p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    {placeholder || 'Clique para selecionar ou arraste uma imagem'}
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WEBP até 5MB
                  </p>
                </>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isUploading}
            />
          </div>

          {/* Separador */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {/* Campo de URL */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent"
                placeholder="Cole aqui a URL da imagem (ex: https://i.imgur.com/abcd1234.jpg)"
                disabled={isUploading}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Suporta links do Imgur, Unsplash, Pexels, Pixabay e outros serviços de imagem
            </p>
          </div>
        </div>
      )}
    </div>
  );
}