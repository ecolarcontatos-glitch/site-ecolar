'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  onImageRemoved?: () => void;
  label?: string;
  aspectRatio?: string;
  className?: string;
}

export default function ImageUpload({ 
  onImageUploaded, 
  currentImage, 
  onImageRemoved, 
  label = "Imagem",
  aspectRatio = "aspect-video",
  className = ""
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      setError('O arquivo deve ter no máximo 10MB.');
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
      onImageUploaded(data.url);
    } catch (error) {
      console.error('Erro no upload:', error);
      setError(error instanceof Error ? error.message : 'Erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
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
    if (onImageRemoved) {
      onImageRemoved();
    }
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
      
      {currentImage ? (
        <div className="relative">
          <div className={`relative ${aspectRatio} bg-gray-100 rounded-2xl overflow-hidden`}>
            <Image
              src={currentImage}
              alt={label}
              fill
              className="object-cover"
            />
          </div>
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
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
                <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Clique para selecionar ou arraste uma imagem
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WEBP até 10MB
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
      )}
    </div>
  );
}