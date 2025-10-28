'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Package, 
  FolderOpen, 
  FileText, 
  MessageSquare, 
  Image as ImageIcon,
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { href: '/admin', icon: Home, label: 'Dashboard', exact: true },
  { href: '/admin/produtos', icon: Package, label: 'Produtos' },
  { href: '/admin/categorias', icon: FolderOpen, label: 'Categorias' },
  { href: '/admin/blog', icon: FileText, label: 'Blog' },
  { href: '/admin/depoimentos', icon: MessageSquare, label: 'Depoimentos' },
  { href: '/admin/inspiracoes', icon: ImageIcon, label: 'Inspirações' },
  { href: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    // Remover dados de autenticação
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_user');
    
    // Redirecionar para página de login
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#f5f6f7]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#7FBA3D] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <h1 className="font-inter font-bold text-xl text-[#111827]">
                Painel ECOLAR
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-[#7FBA3D] hover:text-[#0A3D2E] font-inter font-medium"
            >
              Ver Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-[#6b7280] hover:text-red-600 font-inter font-medium transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          pt-16 lg:pt-0
        `}>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl font-inter font-medium transition-all duration-200
                    ${active 
                      ? 'bg-[#7FBA3D] text-white shadow-md' 
                      : 'text-[#6b7280] hover:bg-[#f1f5f9] hover:text-[#111827]'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}