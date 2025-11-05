'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/fa155124-8442-4fa3-aede-ff541b4163a7.png');
  const [cartCount, setCartCount] = useState(0);

  // Carregar logo do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedConfig = localStorage.getItem('ecolar_config');
      if (storedConfig) {
        try {
          const parsedConfig = JSON.parse(storedConfig);
          if (parsedConfig.logoHeader) {
            setLogoUrl(parsedConfig.logoHeader);
          }
        } catch (error) {
          console.error('Erro ao carregar configurações do header:', error);
        }
      }
    }
  }, []);

  // Carregar e monitorar contador do carrinho
  useEffect(() => {
    const updateCartCount = () => {
      if (typeof window !== 'undefined') {
        const storedItems = localStorage.getItem('ecolar_orcamento');
        if (storedItems) {
          try {
            const items = JSON.parse(storedItems);
            // Contar total de itens (soma das quantidades)
            const totalItems = Array.isArray(items) 
              ? items.reduce((total, item) => total + (item.quantidade || 1), 0)
              : 0;
            setCartCount(totalItems);
          } catch (error) {
            console.error('Erro ao carregar itens do orçamento:', error);
            setCartCount(0);
          }
        } else {
          setCartCount(0);
        }
      }
    };

    // Carregar contador inicial
    updateCartCount();

    // Monitorar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ecolar_orcamento') {
        updateCartCount();
      }
    };

    // Monitorar evento customizado disparado pelo ProductCard
    const handleOrcamentoUpdated = () => {
      updateCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('orcamentoUpdated', handleOrcamentoUpdated);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('orcamentoUpdated', handleOrcamentoUpdated);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={logoUrl}
              alt="ECOLAR"
              width={60}
              height={20}
              className="h-5 w-auto md:h-5 sm:h-4"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="font-inter text-[#111827] hover:text-[#7FBA3D] transition-colors duration-200"
            >
              Início
            </Link>
            <Link
              href="/produtos"
              className="font-inter text-[#111827] hover:text-[#7FBA3D] transition-colors duration-200"
            >
              Produtos
            </Link>
            <Link
              href="/parcerias"
              className="font-inter text-[#111827] hover:text-[#7FBA3D] transition-colors duration-200"
            >
              Parcerias
            </Link>
            <Link
              href="/blog"
              className="font-inter text-[#111827] hover:text-[#7FBA3D] transition-colors duration-200"
            >
              Blog
            </Link>
            <Link
              href="/contato"
              className="font-inter text-[#111827] hover:text-[#7FBA3D] transition-colors duration-200"
            >
              Contato
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center">
            <Link
              href="/orcamento"
              className="relative flex items-center space-x-2 bg-[#7FBA3D] text-white px-4 py-2 rounded-xl hover:bg-[#0A3D2E] transition-colors duration-200 font-inter font-medium"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Orçamento</span>
              {cartCount > 0 && (
                <div className="absolute -top-2 -right-2 min-w-[20px] h-5 px-[5px] bg-white text-[#7FBA3D] rounded-full flex items-center justify-center text-[11px] font-bold shadow-lg">
                  {cartCount}
                </div>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[#111827] hover:text-[#7FBA3D] transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="font-inter text-[#111827] hover:text-[#7FBA3D] transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <Link
                href="/produtos"
                className="font-inter text-[#111827] hover:text-[#7FBA3D] transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Produtos
              </Link>
              <Link
                href="/parcerias"
                className="font-inter text-[#111827] hover:text-[#7FBA3D] transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Parcerias
              </Link>
              <Link
                href="/blog"
                className="font-inter text-[#111827] hover:text-[#7FBA3D] transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/contato"
                className="font-inter text-[#111827] hover:text-[#7FBA3D] transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <Link
                  href="/orcamento"
                  className="relative flex items-center justify-center space-x-2 bg-[#7FBA3D] text-white px-4 py-2 rounded-xl hover:bg-[#0A3D2E] transition-colors duration-200 font-inter font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Orçamento</span>
                  {cartCount > 0 && (
                    <div className="absolute -top-2 -right-2 min-w-[20px] h-5 px-[5px] bg-white text-[#7FBA3D] rounded-full flex items-center justify-center text-[11px] font-bold shadow-lg">
                      {cartCount}
                    </div>
                  )}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}