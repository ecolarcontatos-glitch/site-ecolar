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
  adicionarProduto: (produto: Omit<Produto, 'id'>) => void;
  atualizarProduto: (id: string, produto: Partial<Produto>) => void;
  removerProduto: (id: string) => void;
  
  // CRUD Categorias
  adicionarCategoria: (categoria: Omit<Categoria, 'id'>) => void;
  atualizarCategoria: (id: string, categoria: Partial<Categoria>) => void;
  removerCategoria: (id: string) => void;
  
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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  produtos: 'ecolar_produtos',
  categorias: 'ecolar_categorias',
  posts: 'ecolar_posts',
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

  // Função para carregar dados do localStorage ou usar dados iniciais
  const carregarDados = () => {
    if (typeof window === 'undefined') return;

    try {
      // Carregar produtos
      const produtosStored = localStorage.getItem(STORAGE_KEYS.produtos);
      setProdutos(produtosStored ? JSON.parse(produtosStored) : produtosIniciais);

      // Carregar categorias
      const categoriasStored = localStorage.getItem(STORAGE_KEYS.categorias);
      setCategorias(categoriasStored ? JSON.parse(categoriasStored) : categoriasIniciais);

      // Carregar posts
      const postsStored = localStorage.getItem(STORAGE_KEYS.posts);
      setPosts(postsStored ? JSON.parse(postsStored) : postsIniciais);

      // Carregar depoimentos
      const depoimentosStored = localStorage.getItem(STORAGE_KEYS.depoimentos);
      setDepoimentos(depoimentosStored ? JSON.parse(depoimentosStored) : depoimentosIniciais);

      // Carregar inspirações
      const inspiracoesStored = localStorage.getItem(STORAGE_KEYS.inspiracoes);
      setInspiracoes(inspiracoesStored ? JSON.parse(inspiracoesStored) : inspiracoesIniciais);

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

  // Função para salvar no localStorage com sincronização forçada
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

  // Listener para sincronização entre abas
  useEffect(() => {
    const handleStorageChange = () => {
      carregarDados();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // CRUD Produtos
  const adicionarProduto = (produto: Omit<Produto, 'id'>) => {
    const novoProduto = { 
      ...produto, 
      id: Date.now().toString()
    };
    const novosProdutos = [...produtos, novoProduto];
    setProdutos(novosProdutos);
    salvarDados(STORAGE_KEYS.produtos, novosProdutos);
  };

  const atualizarProduto = (id: string, produtoAtualizado: Partial<Produto>) => {
    const novosProdutos = produtos.map(p => 
      p.id === id ? { ...p, ...produtoAtualizado } : p
    );
    setProdutos(novosProdutos);
    salvarDados(STORAGE_KEYS.produtos, novosProdutos);
  };

  const removerProduto = (id: string) => {
    const novosProdutos = produtos.filter(p => p.id !== id);
    setProdutos(novosProdutos);
    salvarDados(STORAGE_KEYS.produtos, novosProdutos);
  };

  // CRUD Categorias
  const adicionarCategoria = (categoria: Omit<Categoria, 'id'>) => {
    const novaCategoria = { ...categoria, id: Date.now().toString() };
    const novasCategorias = [...categorias, novaCategoria];
    setCategorias(novasCategorias);
    salvarDados(STORAGE_KEYS.categorias, novasCategorias);
  };

  const atualizarCategoria = (id: string, categoriaAtualizada: Partial<Categoria>) => {
    const novasCategorias = categorias.map(c => 
      c.id === id ? { ...c, ...categoriaAtualizada } : c
    );
    setCategorias(novasCategorias);
    salvarDados(STORAGE_KEYS.categorias, novasCategorias);
  };

  const removerCategoria = (id: string) => {
    const novasCategorias = categorias.filter(c => c.id !== id);
    setCategorias(novasCategorias);
    salvarDados(STORAGE_KEYS.categorias, novasCategorias);
  };

  // CRUD Posts
  const adicionarPost = (post: Omit<Post, 'id'>) => {
    const novoPost = { ...post, id: Date.now().toString() };
    const novosPosts = [...posts, novoPost];
    setPosts(novosPosts);
    salvarDados(STORAGE_KEYS.posts, novosPosts);
  };

  const atualizarPost = (id: string, postAtualizado: Partial<Post>) => {
    const novosPosts = posts.map(p => 
      p.id === id ? { ...p, ...postAtualizado } : p
    );
    setPosts(novosPosts);
    salvarDados(STORAGE_KEYS.posts, novosPosts);
  };

  const removerPost = (id: string) => {
    const novosPosts = posts.filter(p => p.id !== id);
    setPosts(novosPosts);
    salvarDados(STORAGE_KEYS.posts, novosPosts);
  };

  // CRUD Depoimentos
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

  // CRUD Inspirações
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