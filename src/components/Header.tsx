'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { OrcamentoService } from '@/lib/orcamento';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuItemRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const updateItemCount = () => {
      const itens = OrcamentoService.getItens();
      setItemCount(itens.reduce((total, item) => total + item.quantidade, 0));
    };

    updateItemCount();
    
    // Atualizar contador quando localStorage mudar
    const handleStorageChange = () => updateItemCount();
    window.addEventListener('storage', handleStorageChange);
    
    // Verificar mudanças periodicamente (para mudanças na mesma aba)
    const interval = setInterval(updateItemCount, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMenu = () => {
    setIsMenuOpen(false);
    // Retornar foco para o botão hambúrguer
    setTimeout(() => {
      menuButtonRef.current?.focus();
    }, 100);
  };

  // Controle de scroll e acessibilidade
  useEffect(() => {
    if (isMenuOpen) {
      // Bloquear scroll da página
      document.body.style.overflow = 'hidden';
      
      // Focar no primeiro item do menu
      setTimeout(() => {
        firstMenuItemRef.current?.focus();
      }, 100);
    } else {
      // Restaurar scroll da página
      document.body.style.overflow = 'unset';
    }

    // Cleanup ao desmontar
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Fechar menu com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    
    if (isMenuOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isMenuOpen]);

  const menuItems = [
    { href: '/', label: 'Home' },
    { href: '/produtos', label: 'Produtos' },
    { href: '/parcerias', label: 'Parcerias' },
    { href: '/blog', label: 'Blog' },
    { href: '/contato', label: 'Contato' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#7FBA3D] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-inter font-semibold text-[#111827] text-lg">
              ECOLAR
            </span>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[#6b7280] hover:text-[#7FBA3D] transition-colors duration-200 font-inter font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/orcamento"
              className="flex items-center space-x-2 bg-[#7FBA3D] text-white px-4 py-2 rounded-2xl hover:bg-[#0A3D2E] transition-colors duration-200 font-inter font-medium"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Ver Orçamento</span>
              {itemCount > 0 && (
                <span className="bg-white text-[#7FBA3D] text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Menu Mobile Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link
              href="/orcamento"
              className="relative p-2 text-[#7FBA3D]"
              aria-label="Ver orçamento"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C05A2B] text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              ref={menuButtonRef}
              onClick={toggleMenu}
              className="p-2 text-[#6b7280] hover:text-[#7FBA3D] transition-colors"
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Drawer */}
      {isMenuOpen && (
        <>
          {/* Overlay semitransparente */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
            onClick={closeMenu}
            aria-hidden="true"
          />
          
          {/* Drawer */}
          <div className="fixed top-0 left-0 w-full h-full bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out">
            {/* Header do drawer com botão fechar */}
            <div className="flex items-center justify-between p-6 border-b border-[#f1f5f9]">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-[#7FBA3D] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">E</span>
                </div>
                <span className="font-inter font-semibold text-[#111827]">
                  ECOLAR
                </span>
              </div>
              <button
                onClick={closeMenu}
                className="p-2 text-[#6b7280] hover:text-[#7FBA3D] transition-colors rounded-lg hover:bg-[#f8fafc]"
                aria-label="Fechar menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Conteúdo do menu */}
            <nav className="p-6">
              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <Link
                    key={item.href}
                    ref={index === 0 ? firstMenuItemRef : undefined}
                    href={item.href}
                    onClick={closeMenu}
                    className="block text-[#6b7280] hover:text-[#7FBA3D] hover:bg-[#f8fafc] transition-all duration-200 font-inter font-medium py-3 px-4 rounded-lg"
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* Botão de orçamento */}
                <div className="pt-6 border-t border-[#f1f5f9]">
                  <Link
                    href="/orcamento"
                    onClick={closeMenu}
                    className="flex items-center justify-center space-x-2 bg-[#7FBA3D] text-white px-4 py-3 rounded-2xl hover:bg-[#0A3D2E] transition-colors duration-200 font-inter font-medium w-full"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Ver Orçamento</span>
                    {itemCount > 0 && (
                      <span className="bg-white text-[#7FBA3D] text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}