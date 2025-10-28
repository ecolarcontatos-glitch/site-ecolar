'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Lock, User } from 'lucide-react';

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validação das credenciais
    if (credentials.username === 'useradmin' && credentials.password === 'adminuser') {
      // Salvar estado de autenticação no localStorage
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_user', credentials.username);
      
      // Redirecionar para o dashboard
      router.push('/admin/dashboard');
    } else {
      setError('Usuário ou senha incorretos.');
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpar erro quando usuário começar a digitar
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Logo ECOLAR */}
          <div className="mx-auto h-16 w-auto mb-6">
            <Image
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/fa155124-8442-4fa3-aede-ff541b4163a7.png"
              alt="ECOLAR"
              width={120}
              height={50}
              className="h-12 w-auto mx-auto"
              priority
            />
          </div>
          <h2 className="font-inter font-bold text-3xl text-[#111827] mb-2">
            Acesso Administrativo
          </h2>
          <p className="font-inter text-[#6b7280]">
            Entre com suas credenciais para acessar o painel
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Campo Usuário */}
            <div>
              <label htmlFor="username" className="block text-sm font-inter font-medium text-[#111827] mb-2">
                Usuário
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#6b7280]" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={credentials.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-2xl placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent font-inter"
                  placeholder="Digite seu usuário"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-inter font-medium text-[#111827] mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#6b7280]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-2xl placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#7FBA3D] focus:border-transparent font-inter"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-[#6b7280] hover:text-[#111827]" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#6b7280] hover:text-[#111827]" />
                  )}
                </button>
              </div>
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-sm text-red-600 font-inter">{error}</p>
              </div>
            )}

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-inter font-medium text-white bg-[#7FBA3D] hover:bg-white hover:text-[#7FBA3D] hover:border-[#7FBA3D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7FBA3D] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>

        {/* Link para voltar ao site */}
        <div className="text-center">
          <a
            href="/"
            className="font-inter text-sm text-[#7FBA3D] hover:text-[#0A3D2E] transition-colors duration-200"
          >
            ← Voltar ao site
          </a>
        </div>
      </div>
    </div>
  );
}