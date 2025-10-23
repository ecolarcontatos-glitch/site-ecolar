'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-md mx-auto text-center px-5">
        {/* Ícone */}
        <div className="w-16 h-16 bg-[#C05A2B] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>

        {/* Título */}
        <h1 className="font-inter font-bold text-2xl text-[#111827] mb-4">
          Algo deu errado!
        </h1>
        
        <p className="font-inter text-[#6b7280] mb-8">
          Ocorreu um erro inesperado. Tente novamente ou volte para a página inicial.
        </p>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center space-x-2 bg-[#7FBA3D] text-white px-6 py-3 rounded-2xl hover:bg-[#0A3D2E] transition-colors duration-200 font-inter font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Tentar novamente</span>
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 border border-[#7FBA3D] text-[#7FBA3D] px-6 py-3 rounded-2xl hover:bg-[#7FBA3D] hover:text-white transition-colors duration-200 font-inter font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Ir para Home</span>
          </Link>
        </div>

        {/* Detalhes do erro (apenas em desenvolvimento) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-[#6b7280] font-inter">
              Detalhes do erro (desenvolvimento)
            </summary>
            <pre className="mt-2 p-4 bg-[#f1f5f9] rounded-lg text-xs text-[#111827] overflow-auto">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}