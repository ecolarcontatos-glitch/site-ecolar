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
  adicionarPost: (post: Omit<Post, 'id'>) => Promise<void>;
  atualizarPost: (id: string, post: Partial<Post>) => Promise<void>;
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

// Função para obter configurações da API de forma segura
const getApiConfig = () => {
  // No cliente, usar a API interna do Next.js
  const baseURL = '/api';
  // CORREÇÃO CRÍTICA: Usar a chave correta que o middleware espera
  const apiKey = 'ecolar-API-2025@secure'; // Esta é a chave que o middleware está esperando

  console.log('🔧 Configuração da API:', { 
    baseURL, 
    apiKey: apiKey.substring(0, 8) + '...'
  });

  return {
    baseURL,
    apiKey,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-api-key': apiKey
    }
  };
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [inspiracoes, setInspiracoes] = useState<Inspiracao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para carregar dados da API INTERNA
  const carregarDados = async () => {
    try {
      setIsLoading(true);
      const API_CONFIG = getApiConfig();
      
      console.log('🔄 Carregando dados da API interna:', API_CONFIG.baseURL);

      // Carregar produtos da API INTERNA
      try {
        const produtosURL = `${API_CONFIG.baseURL}/produtos`;
        console.log('📦 Carregando produtos de:', produtosURL);
        console.log('📦 Headers:', API_CONFIG.headers);
        
        const produtosResponse = await fetch(produtosURL, {
          method: 'GET',
          headers: API_CONFIG.headers,
          cache: "no-store"
        });
        
        if (produtosResponse.ok) {
          const produtosData = await produtosResponse.json();
          console.log('✅ Produtos carregados da API interna:', produtosData.length);
          
          // Mapear dados para garantir compatibilidade
          const produtosMapeados = produtosData.map((produto: any) => ({
            id: produto.id.toString(),
            nome: produto.nome,
            descricao: produto.descricao,
            categoria: produto.categoria_id ? produto.categoria_id.toString() : '',
            categoria_id: produto.categoria_id,
            preco: Number(produto.preco) || 0,
            desconto: Number(produto.desconto) || 0,
            unidade: produto.unidade || 'unidade',
            imagem: produto.imagem,
            destaque: Boolean(produto.destaque),
            disponivel: produto.disponivel !== false
          }));
          
          setProdutos(produtosMapeados);
        } else {
          console.error('❌ Erro ao carregar produtos da API interna:', produtosResponse.status);
          const errorText = await produtosResponse.text();
          console.error('❌ Detalhes do erro:', errorText);
          setProdutos([]);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar produtos:', error);
        setProdutos([]);
      }

      // Carregar categorias da API INTERNA
      try {
        const categoriasURL = `${API_CONFIG.baseURL}/categorias`;
        console.log('📂 Carregando categorias de:', categoriasURL);
        console.log('📂 Headers:', API_CONFIG.headers);
        
        const categoriasResponse = await fetch(categoriasURL, {
          method: 'GET',
          headers: API_CONFIG.headers,
          cache: "no-store"
        });
        
        if (categoriasResponse.ok) {
          const categoriasData = await categoriasResponse.json();
          console.log('✅ Categorias carregadas da API interna:', categoriasData.length);
          setCategorias(categoriasData || []);
        } else {
          console.error('❌ Erro ao carregar categorias da API interna:', categoriasResponse.status);
          const errorText = await categoriasResponse.text();
          console.error('❌ Detalhes do erro:', errorText);
          setCategorias([]);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar categorias:', error);
        setCategorias([]);
      }

    // Carregar POSTS da API interna
    try {
      const postsURL = `${API_CONFIG.baseURL}/posts`;
      console.log('📝 Carregando posts de:', postsURL);

      const postsResponse = await fetch(postsURL, {
        method: 'GET',
        headers: API_CONFIG.headers,
        cache: 'no-store'
      });

      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        console.log('✅ Posts carregados:', postsData.length);

        // Se os campos do banco são os mesmos, não precisa mapear
        setPosts(postsData);
      } else {
        console.error('❌ Erro ao carregar posts:', postsResponse.status);
        const err = await postsResponse.text();
        console.error('❌ Detalhes:', err);
        setPosts([]);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar posts:', error);
      setPosts([]);
    }

    // OBS: depoimentos e inspirações continuam desligados por enquanto
    setDepoimentos([]);
    setInspiracoes([]);


      setIsLoading(false);
      console.log('✅ Carregamento de dados concluído');
    } catch (error) {
      console.error('❌ Erro geral ao carregar dados:', error);
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

  // CRUD Produtos - integrado com API INTERNA
  const adicionarProduto = async (produto: Omit<Produto, 'id'>) => {
    try {
      const API_CONFIG = getApiConfig();
      const response = await fetch(`${API_CONFIG.baseURL}/produtos`, {
        method: 'POST',
        headers: API_CONFIG.headers,
        body: JSON.stringify(produto),
      });

      if (response.ok) {
        console.log('✅ Produto adicionado com sucesso');
        // await recarregarDados();
      } else {
        console.error('❌ Erro ao adicionar produto:', response.status);
        const errorText = await response.text();
        console.error('❌ Detalhes do erro:', errorText);
        throw new Error('Erro ao adicionar produto');
      }
    } catch (error) {
      console.error('❌ Erro ao adicionar produto:', error);
      throw error;
    }
  };

  const atualizarProduto = async (id: string, produtoAtualizado: Partial<Produto>) => {
    try {
      const API_CONFIG = getApiConfig();
      const response = await fetch(`${API_CONFIG.baseURL}/produtos/${id}`, {
        method: 'PUT',
        headers: API_CONFIG.headers,
        body: JSON.stringify(produtoAtualizado),
      });

      if (response.ok) {
        console.log('✅ Produto atualizado com sucesso');
        // await recarregarDados();
      } else {
        console.error('❌ Erro ao atualizar produto:', response.status);
        const errorText = await response.text();
        console.error('❌ Detalhes do erro:', errorText);
        throw new Error('Erro ao atualizar produto');
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar produto:', error);
      throw error;
    }
  };

  const removerProduto = async (id: string) => {
    try {
      const API_CONFIG = getApiConfig();
      const response = await fetch(`${API_CONFIG.baseURL}/produtos/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-api-key': API_CONFIG.apiKey
        }
      });

      if (response.ok) {
        console.log('✅ Produto removido com sucesso');
        // await recarregarDados();
      } else {
        console.error('❌ Erro ao remover produto:', response.status);
        const errorText = await response.text();
        console.error('❌ Detalhes do erro:', errorText);
        throw new Error('Erro ao remover produto');
      }
    } catch (error) {
      console.error('❌ Erro ao remover produto:', error);
      throw error;
    }
  };

  // CRUD Categorias - integrado com API INTERNA
  const adicionarCategoria = async (categoria: Omit<Categoria, 'id'>) => {
    try {
      const API_CONFIG = getApiConfig();
      const response = await fetch(`${API_CONFIG.baseURL}/categorias`, {
        method: 'POST',
        headers: API_CONFIG.headers,
        body: JSON.stringify(categoria),
      });

      if (response.ok) {
        console.log('✅ Categoria adicionada com sucesso');
        // await recarregarDados();
      } else {
        console.error('❌ Erro ao adicionar categoria:', response.status);
        const errorText = await response.text();
        console.error('❌ Detalhes do erro:', errorText);
        throw new Error('Erro ao adicionar categoria');
      }
    } catch (error) {
      console.error('❌ Erro ao adicionar categoria:', error);
      throw error;
    }
  };

  const atualizarCategoria = async (id: string, categoriaAtualizada: Partial<Categoria>) => {
    try {
      const API_CONFIG = getApiConfig();
      const response = await fetch(`${API_CONFIG.baseURL}/categorias/${id}`, {
        method: 'PUT',
        headers: API_CONFIG.headers,
        body: JSON.stringify(categoriaAtualizada),
      });

      if (response.ok) {
        console.log('✅ Categoria atualizada com sucesso');
        // await recarregarDados();
      } else {
        console.error('❌ Erro ao atualizar categoria:', response.status);
        const errorText = await response.text();
        console.error('❌ Detalhes do erro:', errorText);
        throw new Error('Erro ao atualizar categoria');
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar categoria:', error);
      throw error;
    }
  };

  const removerCategoria = async (id: string) => {
    try {
      const API_CONFIG = getApiConfig();
      const response = await fetch(`${API_CONFIG.baseURL}/categorias/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-api-key': API_CONFIG.apiKey
        }
      });

      if (response.ok) {
        console.log('✅ Categoria removida com sucesso');
        // await recarregarDados();
      } else {
        console.error('❌ Erro ao remover categoria:', response.status);
        const errorText = await response.text();
        console.error('❌ Detalhes do erro:', errorText);
        throw new Error('Erro ao remover categoria');
      }
    } catch (error) {
      console.error('❌ Erro ao remover categoria:', error);
      throw error;
    }
  };

  // CRUD Posts - AGORA INTEGRADO COM A API
  const adicionarPost = async (post: Omit<Post, 'id'>) => {
    const API_CONFIG = getApiConfig();

    const dataMySQL = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const response = await fetch(`${API_CONFIG.baseURL}/posts`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify({
        titulo: post.titulo,
        descricao: post.descricao,
        resumo: post.resumo,
        imagem: post.imagem,
        autor: post.autor,
        data_publicacao: dataMySQL,
        status: 'publicado'
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("❌ Erro ao criar post:", err);
      throw new Error("Erro ao criar post.");
    }

   // await recarregarDados();
  };

  const atualizarPost = async (id: string, postAtualizado: Partial<Post>) => {
    const API_CONFIG = getApiConfig();

    const response = await fetch(`${API_CONFIG.baseURL}/posts`, {
      method: 'PUT',
      headers: API_CONFIG.headers,
      body: JSON.stringify({
        id, // 🔥 IMPORTANTE
        titulo: postAtualizado.titulo,
        descricao: postAtualizado.descricao,
        resumo: postAtualizado.resumo,
        imagem: postAtualizado.imagem,
        autor: postAtualizado.autor,
        data_publicacao: postAtualizado.data_publicacao?.slice(0, 19).replace('T', ' '),
        status: postAtualizado.status
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("❌ Erro ao atualizar post:", err);
      throw new Error("Erro ao atualizar post.");
    }

    //await recarregarDados();
  };



  const removerPost = async (id: string) => {
    const API_CONFIG = getApiConfig();

    const response = await fetch(`${API_CONFIG.baseURL}/posts?id=${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-api-key': API_CONFIG.apiKey
      }
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("❌ Erro ao remover post:", err);
      throw new Error("Erro ao remover post.");
    }

    // await recarregarDados();
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