'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const authenticated = localStorage.getItem('admin_authenticated');
    
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    } else {
      // Redirecionar para página de login
      router.push('/admin');
      return;
    }
    
    setIsLoading(false);
  }, [router]);

  return { isAuthenticated, isLoading };
}