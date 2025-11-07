'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Produto, Categoria, Post, Depoimento, Inspiracao } from '@/lib/types';

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
  adicionarPost: (post: Omit<Post, 'id'>) => void;
  atualizarPost: (id: string, post: Partial<Post>) => void;
  removerPost: (id: string) => void;
  
  // CRUD Depoimentos
  adicionarDepoimento: (depoimento: Omit<Depoimento, 'id'>) => void;
  atualizarDepoimento: (id: string, depoimento: Partial<Depoimento>) => void;
  removerDepoimento: (id: string) => void;
  
  // CRUD Inspirações
  adicionarInspiracao: (inspiracao: Omit<Inspiracao, 'id'>) => void;
  atualizarInspiracao: (id: string, inspiracao: Partial<Inspiracao>) => void;
  removerInspiracao: (id: string) => void;
  
  // Função para recarregar dados
  recarregarDados: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [inspiracoes, setInspiracoes] = useState<Inspiracao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para carregar dados da API
  const carregarDados = async () => {
    try {
      setIsLoading(true);

      // Carregar produtos da API
      try {
        const produtosResponse = await fetch('/api/produtos');
        if (produtosResponse.ok) {
          const produtosData = await produtosResponse.json();
          setProdutos(produtosData || []);
        } else {
          console.error('Erro ao carregar produtos:', produtosResponse.status);
          setProdutos([]);
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        setProdutos([]);
      }

      // Carregar categorias da API
      try {
        const categoriasResponse = await fetch('/api/categorias');
        if (categoriasResponse.ok) {
          const categoriasData = await categoriasResponse.json();
          setCategorias(categoriasData || []);
        } else {
          console.error('Erro ao carregar categorias:', categoriasResponse.status);
          setCategorias([]);
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        setCategorias([]);
      }

      // Para posts, depoimentos e inspirações, manter dados locais por enquanto
      // (podem ser implementados com API posteriormente)
      setPosts([]);
      setDepoimentos([]);
      setInspiracoes([]);

      setIsLoading(false);
    } catch (error) {
      console.error('Erro geral ao carregar dados:', error);
      setProdutos([]);
      setCategorias([]);
      setPosts([]);
      setDepoimentos([]);
      setInspiracoes([]);
      setIsLoading(false);
    }
  };

  // Função para recarregar dados (útil após operações CRUD)
  const recarregarDados = async () => {
    await carregarDados();
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // CRUD Produtos - integrado com API
  const adicionarProduto = async (produto: Omit<Produto, 'id'>) => {
    try {
      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produto),
      });

      if (response.ok) {
        // Recarregar dados após adicionar
        await recarregarDados();
      } else {
        console.error('Erro ao adicionar produto:', response.status);
        throw new Error('Erro ao adicionar produto');
      }
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      throw error;
    }
  };

  const atualizarProduto = async (id: string, produtoAtualizado: Partial<Produto>) => {
    try {
      const response = await fetch(`/api/produtos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produtoAtualizado),
      });

      if (response.ok) {
        // Recarregar dados após atualizar
        await recarregarDados();
      } else {
        console.error('Erro ao atualizar produto:', response.status);
        throw new Error('Erro ao atualizar produto');
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  };

  const removerProduto = async (id: string) => {
    try {
      const response = await fetch(`/api/produtos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Recarregar dados após remover
        await recarregarDados();
      } else {
        console.error('Erro ao remover produto:', response.status);
        throw new Error('Erro ao remover produto');
      }
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      throw error;
    }
  };

  // CRUD Categorias - integrado com API
  const adicionarCategoria = async (categoria: Omit<Categoria, 'id'>) => {
    try {
      const response = await fetch('/api/categorias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoria),
      });

      if (response.ok) {
        // Recarregar dados após adicionar
        await recarregarDados();
      } else {
        console.error('Erro ao adicionar categoria:', response.status);
        throw new Error('Erro ao adicionar categoria');
      }
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      throw error;
    }
  };

  const atualizarCategoria = async (id: string, categoriaAtualizada: Partial<Categoria>) => {
    try {
      const response = await fetch(`/api/categorias/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoriaAtualizada),
      });

      if (response.ok) {
        // Recarregar dados após atualizar
        await recarregarDados();
      } else {
        console.error('Erro ao atualizar categoria:', response.status);
        throw new Error('Erro ao atualizar categoria');
      }
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw error;
    }
  };

  const removerCategoria = async (id: string) => {
    try {
      const response = await fetch(`/api/categorias/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Recarregar dados após remover
        await recarregarDados();
      } else {
        console.error('Erro ao remover categoria:', response.status);
        throw new Error('Erro ao remover categoria');
      }
    } catch (error) {
      console.error('Erro ao remover categoria:', error);
      throw error;
    }
  };

  // CRUD Posts - mantido local por enquanto
  const adicionarPost = (post: Omit<Post, 'id'>) => {
    const novoPost = { ...post, id: Date.now().toString() };
    const novosPosts = [...posts, novoPost];
    setPosts(novosPosts);
  };

  const atualizarPost = (id: string, postAtualizado: Partial<Post>) => {
    const novosPosts = posts.map(p => 
      p.id === id ? { ...p, ...postAtualizado } : p
    );
    setPosts(novosPosts);
  };

  const removerPost = (id: string) => {
    const novosPosts = posts.filter(p => p.id !== id);
    setPosts(novosPosts);
  };

  // CRUD Depoimentos - mantido local por enquanto
  const adicionarDepoimento = (depoimento: Omit<Depoimento, 'id'>) => {
    const novoDepoimento = { ...depoimento, id: Date.now().toString() };
    const novosDepoimentos = [...depoimentos, novoDepoimento];
    setDepoimentos(novosDepoimentos);
  };

  const atualizarDepoimento = (id: string, depoimentoAtualizado: Partial<Depoimento>) => {
    const novosDepoimentos = depoimentos.map(d => 
      d.id === id ? { ...d, ...depoimentoAtualizado } : d
    );
    setDepoimentos(novosDepoimentos);
  };

  const removerDepoimento = (id: string) => {
    const novosDepoimentos = depoimentos.filter(d => d.id !== id);
    setDepoimentos(novosDepoimentos);
  };

  // CRUD Inspirações - mantido local por enquanto
  const adicionarInspiracao = (inspiracao: Omit<Inspiracao, 'id'>) => {
    const novaInspiracao = { ...inspiracao, id: Date.now().toString() };
    const novasInspiracoes = [...inspiracoes, novaInspiracao];
    setInspiracoes(novasInspiracoes);
  };

  const atualizarInspiracao = (id: string, inspiracaoAtualizada: Partial<Inspiracao>) => {
    const novasInspiracoes = inspiracoes.map(i => 
      i.id === id ? { ...i, ...inspiracaoAtualizada } : i
    );
    setInspiracoes(novasInspiracoes);
  };

  const removerInspiracao = (id: string) => {
    const novasInspiracoes = inspiracoes.filter(i => i.id !== id);
    setInspiracoes(novasInspiracoes);
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
    removerInspiracao,
    
    // Função para recarregar
    recarregarDados
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