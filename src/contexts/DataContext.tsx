'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Produto, Categoria, Post, Depoimento, Inspiracao } from '@/lib/types';
import { produtos as produtosIniciais, categorias as categoriasIniciais, posts as postsIniciais, depoimentos as depoimentosIniciais, inspiracoes as inspiracoesIniciais } from '@/lib/data';

interface DataContextType {
  produtos: Produto[];
  categorias: Categoria[];
  posts: Post[];
  depoimentos: Depoimento[];
  inspiracoes: Inspiracao[];
  isLoading: boolean;
  
  // CRUD Produtos
  adicionarProduto: (produto: Omit<Produto, 'id'>) => Promise<void>;
  atualizarProduto: (id: string, produto: Partial<Produto>) => Promise<void>;
  removerProduto: (id: string) => Promise<void>;
  
  // CRUD Categorias
  adicionarCategoria: (categoria: Omit<Categoria, 'id'>) => Promise<void>;
  atualizarCategoria: (id: string, categoria: Partial<Categoria>) => Promise<void>;
  removerCategoria: (id: string) => Promise<void>;
  
  // CRUD Posts
  adicionarPost: (post: Omit<Post, 'id'>) => Promise<void>;
  atualizarPost: (id: string, post: Partial<Post>) => Promise<void>;
  removerPost: (id: string) => Promise<void>;
  
  // CRUD Depoimentos (ainda usando localStorage)
  adicionarDepoimento: (depoimento: Omit<Depoimento, 'id'>) => void;
  atualizarDepoimento: (id: string, depoimento: Partial<Depoimento>) => void;
  removerDepoimento: (id: string) => void;
  
  // CRUD Inspirações (ainda usando localStorage)
  adicionarInspiracao: (inspiracao: Omit<Inspiracao, 'id'>) => void;
  atualizarInspiracao: (id: string, inspiracao: Partial<Inspiracao>) => void;
  removerInspiracao: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  depoimentos: 'ecolar_depoimentos',
  inspiracoes: 'ecolar_inspiracoes'
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [inspiracoes, setInspiracoes] = useState<Inspiracao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para carregar dados do servidor e localStorage
  const carregarDados = async () => {
    try {
      setIsLoading(true);

      // Carregar produtos do servidor
      try {
        const produtosRes = await fetch('/api/produtos');
        const produtosData = await produtosRes.json();
        setProdutos(produtosData.length > 0 ? produtosData : produtosIniciais);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        setProdutos(produtosIniciais);
      }

      // Carregar categorias do servidor
      try {
        const categoriasRes = await fetch('/api/categorias');
        const categoriasData = await categoriasRes.json();
        setCategorias(categoriasData.length > 0 ? categoriasData : categoriasIniciais);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        setCategorias(categoriasIniciais);
      }

      // Carregar posts do servidor
      try {
        const postsRes = await fetch('/api/posts');
        const postsData = await postsRes.json();
        setPosts(postsData.length > 0 ? postsData : postsIniciais);
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
        setPosts(postsIniciais);
      }

      // Carregar depoimentos do localStorage (ainda não migrado)
      if (typeof window !== 'undefined') {
        try {
          const depoimentosStored = localStorage.getItem(STORAGE_KEYS.depoimentos);
          setDepoimentos(depoimentosStored ? JSON.parse(depoimentosStored) : depoimentosIniciais);
        } catch (error) {
          console.error('Erro ao carregar depoimentos:', error);
          setDepoimentos(depoimentosIniciais);
        }

        // Carregar inspirações do localStorage (ainda não migrado)
        try {
          const inspiracoesStored = localStorage.getItem(STORAGE_KEYS.inspiracoes);
          setInspiracoes(inspiracoesStored ? JSON.parse(inspiracoesStored) : inspiracoesIniciais);
        } catch (error) {
          console.error('Erro ao carregar inspirações:', error);
          setInspiracoes(inspiracoesIniciais);
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Em caso de erro, usar dados iniciais
      setProdutos(produtosIniciais);
      setCategorias(categoriasIniciais);
      setPosts(postsIniciais);
      setDepoimentos(depoimentosIniciais);
      setInspiracoes(inspiracoesIniciais);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Função para salvar no localStorage (ainda usado para depoimentos e inspirações)
  const salvarDados = (key: string, data: any) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(data));
      // Força sincronização imediata
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  };

  // Listener para sincronização entre abas (ainda necessário para localStorage)
  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window !== 'undefined') {
        try {
          const depoimentosStored = localStorage.getItem(STORAGE_KEYS.depoimentos);
          if (depoimentosStored) {
            setDepoimentos(JSON.parse(depoimentosStored));
          }

          const inspiracoesStored = localStorage.getItem(STORAGE_KEYS.inspiracoes);
          if (inspiracoesStored) {
            setInspiracoes(JSON.parse(inspiracoesStored));
          }
        } catch (error) {
          console.error('Erro ao sincronizar dados:', error);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  // CRUD Produtos (usando API)
  const adicionarProduto = async (produto: Omit<Produto, 'id'>) => {
    try {
      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setProdutos(prev => [...prev, result.data]);
        }
      }
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  };

  const atualizarProduto = async (id: string, produtoAtualizado: Partial<Produto>) => {
    try {
      const response = await fetch('/api/produtos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...produtoAtualizado }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setProdutos(prev => prev.map(p => p.id === id ? result.data : p));
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  };

  const removerProduto = async (id: string) => {
    try {
      const response = await fetch(`/api/produtos?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setProdutos(prev => prev.filter(p => p.id !== id));
        }
      }
    } catch (error) {
      console.error('Erro ao remover produto:', error);
    }
  };

  // CRUD Categorias (usando API)
  const adicionarCategoria = async (categoria: Omit<Categoria, 'id'>) => {
    try {
      const response = await fetch('/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoria),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setCategorias(prev => [...prev, result.data]);
        }
      }
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
    }
  };

  const atualizarCategoria = async (id: string, categoriaAtualizada: Partial<Categoria>) => {
    try {
      const response = await fetch('/api/categorias', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...categoriaAtualizada }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setCategorias(prev => prev.map(c => c.id === id ? result.data : c));
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
    }
  };

  const removerCategoria = async (id: string) => {
    try {
      const response = await fetch(`/api/categorias?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setCategorias(prev => prev.filter(c => c.id !== id));
        }
      }
    } catch (error) {
      console.error('Erro ao remover categoria:', error);
    }
  };

  // CRUD Posts (usando API)
  const adicionarPost = async (post: Omit<Post, 'id'>) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setPosts(prev => [...prev, result.data]);
        }
      }
    } catch (error) {
      console.error('Erro ao adicionar post:', error);
    }
  };

  const atualizarPost = async (id: string, postAtualizado: Partial<Post>) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...postAtualizado }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setPosts(prev => prev.map(p => p.id === id ? result.data : p));
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
    }
  };

  const removerPost = async (id: string) => {
    try {
      const response = await fetch(`/api/posts?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setPosts(prev => prev.filter(p => p.id !== id));
        }
      }
    } catch (error) {
      console.error('Erro ao remover post:', error);
    }
  };

  // CRUD Depoimentos (ainda usando localStorage)
  const adicionarDepoimento = (depoimento: Omit<Depoimento, 'id'>) => {
    const novoDepoimento = { ...depoimento, id: Date.now().toString() };
    const novosDepoimentos = [...depoimentos, novoDepoimento];
    setDepoimentos(novosDepoimentos);
    salvarDados(STORAGE_KEYS.depoimentos, novosDepoimentos);
  };

  const atualizarDepoimento = (id: string, depoimentoAtualizado: Partial<Depoimento>) => {
    const novosDepoimentos = depoimentos.map(d => 
      d.id === id ? { ...d, ...depoimentoAtualizado } : d
    );
    setDepoimentos(novosDepoimentos);
    salvarDados(STORAGE_KEYS.depoimentos, novosDepoimentos);
  };

  const removerDepoimento = (id: string) => {
    const novosDepoimentos = depoimentos.filter(d => d.id !== id);
    setDepoimentos(novosDepoimentos);
    salvarDados(STORAGE_KEYS.depoimentos, novosDepoimentos);
  };

  // CRUD Inspirações (ainda usando localStorage)
  const adicionarInspiracao = (inspiracao: Omit<Inspiracao, 'id'>) => {
    const novaInspiracao = { ...inspiracao, id: Date.now().toString() };
    const novasInspiracoes = [...inspiracoes, novaInspiracao];
    setInspiracoes(novasInspiracoes);
    salvarDados(STORAGE_KEYS.inspiracoes, novasInspiracoes);
  };

  const atualizarInspiracao = (id: string, inspiracaoAtualizada: Partial<Inspiracao>) => {
    const novasInspiracoes = inspiracoes.map(i => 
      i.id === id ? { ...i, ...inspiracaoAtualizada } : i
    );
    setInspiracoes(novasInspiracoes);
    salvarDados(STORAGE_KEYS.inspiracoes, novasInspiracoes);
  };

  const removerInspiracao = (id: string) => {
    const novasInspiracoes = inspiracoes.filter(i => i.id !== id);
    setInspiracoes(novasInspiracoes);
    salvarDados(STORAGE_KEYS.inspiracoes, novasInspiracoes);
  };

  const value: DataContextType = {
    produtos,
    categorias,
    posts,
    depoimentos,
    inspiracoes,
    isLoading,
    
    // CRUD Produtos
    adicionarProduto,
    atualizarProduto,
    removerProduto,
    
    // CRUD Categorias
    adicionarCategoria,
    atualizarCategoria,
    removerCategoria,
    
    // CRUD Posts
    adicionarPost,
    atualizarPost,
    removerPost,
    
    // CRUD Depoimentos
    adicionarDepoimento,
    atualizarDepoimento,
    removerDepoimento,
    
    // CRUD Inspirações
    adicionarInspiracao,
    atualizarInspiracao,
    removerInspiracao
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
}