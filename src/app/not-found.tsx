import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-md mx-auto text-center px-5">
        {/* Logo */}
        <div className="w-16 h-16 bg-[#7FBA3D] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-2xl">E</span>
        </div>

        {/* Título */}
        <h1 className="font-inter font-bold text-6xl text-[#111827] mb-4">
          404
        </h1>
        
        <h2 className="font-inter font-semibold text-2xl text-[#111827] mb-4">
          Página não encontrada
        </h2>
        
        <p className="font-inter text-[#6b7280] mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 bg-[#7FBA3D] text-white px-6 py-3 rounded-2xl hover:bg-[#0A3D2E] transition-colors duration-200 font-inter font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Ir para Home</span>
          </Link>
          
          <Link
            href="/produtos"
            className="inline-flex items-center justify-center space-x-2 border border-[#7FBA3D] text-[#7FBA3D] px-6 py-3 rounded-2xl hover:bg-[#7FBA3D] hover:text-white transition-colors duration-200 font-inter font-medium"
          >
            <span>Ver Produtos</span>
          </Link>
        </div>

        {/* Links úteis */}
        <div className="mt-12 pt-8 border-t border-[#f1f5f9]">
          <p className="font-inter text-sm text-[#6b7280] mb-4">
            Links úteis:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/produtos" className="text-[#7FBA3D] hover:text-[#0A3D2E] font-inter">
              Produtos
            </Link>
            <Link href="/parcerias" className="text-[#7FBA3D] hover:text-[#0A3D2E] font-inter">
              Parcerias
            </Link>
            <Link href="/blog" className="text-[#7FBA3D] hover:text-[#0A3D2E] font-inter">
              Blog
            </Link>
            <Link href="/contato" className="text-[#7FBA3D] hover:text-[#0A3D2E] font-inter">
              Contato
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}