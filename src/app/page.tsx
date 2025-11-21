'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MessageCircle, Star, Users, Truck, Clock } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';

export default function HomePage() {
  const { produtos, categorias, isLoading } = useData();
  // Tipos básicos para evitar erro do TS
  interface Depoimento {
    id: number;
    nome: string;
    texto: string;
    foto?: string;
    imagem?: string;
    estrelas?: number;
  }

  interface Inspiracao {
    id: number;
    titulo: string;
    descricao: string;
    imagem: string;
  }

  interface Post {
    id: number;
    titulo: string;
    resumo: string;
    imagem: string;
    autor: string;
    data: string;
  }

  // Agora sim, com tipagem correta
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [inspiracoes, setInspiracoes] = useState<Inspiracao[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [heroImages, setHeroImages] = useState<any[]>([]);

    useEffect(() => {
    async function fetchHero() {
      try {
        const res = await fetch('/api/configuracoes', { cache: 'no-store' });
        if (!res.ok) return;

        const data = await res.json();

        if (data.hero_images && Array.isArray(data.hero_images)) {
          setHeroImages(data.hero_images);
        }
      } catch (error) {
        console.error("Erro ao carregar hero_images:", error);
      }
    }

    fetchHero();
  }, []);

  // Buscar depoimentos, inspirações e posts do blog
  useEffect(() => {
    async function fetchContent() {
      try {
        // Depoimentos
        const resDep = await fetch('/api/depoimentos', { cache: 'no-store' });
        if (resDep.ok) {
          const dataDep = await resDep.json();
          // Normaliza para ter sempre texto, estrelas, foto/imagem
          const normalizados = (dataDep || []).map((item: any) => ({
            id: item.id,
            nome: item.nome ?? '',
            texto: item.comentario ?? item.texto ?? '',
            estrelas: item.estrelas ?? 5,
            foto: item.foto ?? '',
            imagem: item.imagem ?? '',
          }));
          setDepoimentos(normalizados.slice(0, 3)); // mostra até 3 na home
        }

        // Inspirações
        const resInsp = await fetch('/api/inspiracoes', { cache: 'no-store' });
        if (resInsp.ok) {
          const dataInsp = await resInsp.json();
          setInspiracoes((dataInsp || []).slice(0, 6));
        }

        // Posts do blog
        const resPosts = await fetch('/api/posts', { cache: 'no-store' });
        if (resPosts.ok) {
          const dataPosts = await resPosts.json();
          setPosts(dataPosts || []);
        }
      } catch (error) {
        console.error('Erro ao carregar dados da home:', error);
      }
    }

    fetchContent();
  }, []);

  // FILTRO CRÍTICO: Apenas produtos disponíveis aparecem no site
  const produtosDestaque = produtos.filter(p => p.destaque).slice(0, 6);
  const categoriasPrincipais = categorias.slice(0, 4); // Apenas 4 categorias

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Buscar posts do blog
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/posts`,
          { cache: 'no-store' }
        );

        if (!response.ok) {
          console.error('Erro ao carregar posts:', response.status);
          return;
        }

        const data = await response.json();

        // Formatar igual à página /blog
        const formatted = data
          .filter((p: any) => p.status === 'publicado')
          .map((post: any) => ({
            id: post.id,
            titulo: post.titulo,
            resumo: post.resumo,
            imagem: post.imagem,
            autor: post.autor,
            data: post.data_publicacao,
          }))
          .sort((a: any, b: any) =>
            new Date(b.data).getTime() - new Date(a.data).getTime()
          );

        setPosts(formatted);
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      }
    };

    loadPosts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 7000); // Troca a cada 7 segundos

    return () => clearInterval(interval);
  }, [heroImages.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7FBA3D] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section com Carrossel */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        {/* Carrossel de imagens */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image.url}
                alt={`Materiais de construção ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
          {/* Camada preta translúcida para contraste - MAIS ESCURA */}
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.7)]" />
        </div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-5 text-center text-white">
          <h1 className="font-inter font-bold text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Materiais de construção
            <br />
            <span className="text-[#7FBA3D]">& decoração</span>
          </h1>
          <p className="font-inter text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
            Telhas, tijolos, pisos e sob medida — orçamento rápido e entrega por carrada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/produtos"
              className="flex items-center space-x-2 bg-[#7FBA3D] text-white px-8 py-4 rounded-2xl hover:bg-white hover:text-[#7FBA3D] font-inter font-semibold text-lg shadow-lg"
            >
              <span>Ver Produtos</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://wa.me/558393661690"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-2xl hover:bg-white hover:text-[#0A3D2E] transition-all duration-200 font-inter font-semibold text-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="font-inter font-bold text-3xl md:text-4xl text-[#111827] mb-4">
              Produtos em Destaque
            </h2>
            <p className="font-inter text-lg text-[#6b7280] max-w-2xl mx-auto">
              Selecionamos os melhores materiais com dupla opção de preço: direto da fábrica ou pronta entrega.
            </p>
          </div>
          
          {produtosDestaque.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {produtosDestaque.map((produto) => (
                  <ProductCard key={produto.id} produto={produto} />
                ))}
              </div>
              
              <div className="text-center">
                <Link
                  href="/produtos"
                  className="inline-flex items-center space-x-2 bg-[#7FBA3D] text-white px-6 py-3 rounded-2xl hover:bg-[#0A3D2E] transition-colors duration-200 font-inter font-medium"
                >
                  <span>Ver todos os produtos</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="font-inter text-lg text-[#6b7280]">
                Nenhum produto em destaque no momento.
              </p>
              <Link
                href="/produtos"
                className="inline-flex items-center space-x-2 bg-[#7FBA3D] text-white px-6 py-3 rounded-2xl hover:bg-[#0A3D2E] transition-colors duration-200 font-inter font-medium mt-4"
              >
                <span>Ver catálogo completo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Categorias - Apenas 4 principais */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="font-inter font-bold text-3xl md:text-4xl text-[#111827] mb-4">
              Nossas Categorias
            </h2>
            <p className="font-inter text-lg text-[#6b7280]">
              Encontre exatamente o que precisa para sua obra
            </p>
          </div>
          
          {categoriasPrincipais.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {categoriasPrincipais.map((categoria) => (
                  <Link
                    key={categoria.id}
                    href={`/produtos?categoria=${categoria.slug}`}
                    className="group bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={categoria.imagem}
                        alt={categoria.nome}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2">
                        {categoria.nome}
                      </h3>
                      <p className="font-inter text-[#6b7280] text-sm">
                        {categoria.descricao}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Botão Ver Todas */}
              <div className="text-center">
                <Link
                  href="/produtos"
                  className="inline-flex items-center space-x-2 bg-[#7FBA3D] text-white px-6 py-3 rounded-2xl hover:bg-[#0A3D2E] transition-colors duration-200 font-inter font-medium"
                >
                  <span>Ver todas as categorias</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="font-inter text-lg text-[#6b7280]">
                Nenhuma categoria cadastrada ainda.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Parcerias */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="font-inter font-bold text-3xl md:text-4xl text-[#111827] mb-4">
              Parcerias & Serviços
            </h2>
            <p className="font-inter text-lg text-[#6b7280]">
              Soluções completas para profissionais e clientes finais
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-center">
              <div className="w-16 h-16 bg-[#7FBA3D] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-inter font-semibold text-[#111827] text-xl mb-4">
                Profissionais
              </h3>
              <p className="font-inter text-[#6b7280] mb-6">
                Parcerias especiais para arquitetos, engenheiros e empreiteiros com condições diferenciadas.
              </p>
              <Link
                href="/parcerias"
                className="inline-flex items-center space-x-2 text-[#7FBA3D] hover:text-[#0A3D2E] font-inter font-medium"
              >
                <span>Saiba mais</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-center">
              <div className="w-16 h-16 bg-[#C05A2B] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-inter font-semibold text-[#111827] text-xl mb-4">
                Entrega por Carrada
              </h3>
              <p className="font-inter text-[#6b7280] mb-6">
                Entrega direta na sua obra com logística especializada para grandes volumes.
              </p>
              <Link
                href="/parcerias"
                className="inline-flex items-center space-x-2 text-[#7FBA3D] hover:text-[#0A3D2E] font-inter font-medium"
              >
                <span>Saiba mais</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-center">
              <div className="w-16 h-16 bg-[#7FBA3D] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-inter font-semibold text-[#111827] text-xl mb-4">
                Orçamento em 1h
              </h3>
              <p className="font-inter text-[#6b7280] mb-6">
                Resposta rápida para seus orçamentos via WhatsApp com preços atualizados.
              </p>
              <Link
                href="/contato"
                className="inline-flex items-center space-x-2 text-[#7FBA3D] hover:text-[#0A3D2E] font-inter font-medium"
              >
                <span>Solicitar</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Inspiração */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="font-inter font-bold text-3xl md:text-4xl text-[#111827] mb-4">
              Inspiração
            </h2>
            <p className="font-inter text-lg text-[#6b7280]">
              Projetos que mostram a qualidade dos nossos materiais
            </p>
          </div>
          
          {inspiracoes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inspiracoes.map((inspiracao) => (
                <div
                  key={inspiracao.id}
                  className="group bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={inspiracao.imagem}
                      alt={inspiracao.titulo}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2">
                      {inspiracao.titulo}
                    </h3>
                    <p className="font-inter text-[#6b7280] text-sm">
                      {inspiracao.descricao}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="font-inter text-lg text-[#6b7280]">
                Nenhuma inspiração cadastrada ainda.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="font-inter font-bold text-3xl md:text-4xl text-[#111827] mb-4">
              O que falam da ECOLAR
            </h2>
            <p className="font-inter text-lg text-[#6b7280]">
              A confiança dos nossos clientes é nossa maior conquista
            </p>
          </div>
          
          {depoimentos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {depoimentos.map((depoimento) => (
                <div
                  key={depoimento.id}
                  className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-center"
                >
                  {/* Imagem do cliente - acima das estrelas - usando foto ou imagem */}
                  {(depoimento.foto || depoimento.imagem) && (
                    <div className="relative w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden">
                      <Image
                        src={depoimento.foto || depoimento.imagem || ''}
                        alt={depoimento.nome}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < (depoimento.estrelas ?? 5)
                            ? 'text-[#7FBA3D] fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <blockquote className="font-inter text-[#6b7280] text-lg mb-6 italic">
                    "{depoimento.texto}"
                  </blockquote>
                  <cite className="font-inter font-semibold text-[#111827]">
                    {depoimento.nome}
                  </cite>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="font-inter text-lg text-[#6b7280]">
                Nenhum depoimento cadastrado ainda.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Blog */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="font-inter font-bold text-3xl md:text-4xl text-[#111827] mb-4">
              Do nosso blog
            </h2>
            <p className="font-inter text-lg text-[#6b7280]">
              Dicas e informações para sua obra
            </p>
          </div>
          
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {posts.slice(0, 3).map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.id}`}
                    className="group bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={post.imagem}
                        alt={post.titulo}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2 line-clamp-2">
                        {post.titulo}
                      </h3>
                      <p className="font-inter text-[#6b7280] text-sm mb-4 line-clamp-3">
                        {post.resumo}
                      </p>
                      <div className="flex items-center justify-between text-xs text-[#6b7280] font-inter">
                        <span>{post.autor}</span>
                        <span>{new Date(post.data).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center space-x-2 bg-[#7FBA3D] text-white px-6 py-3 rounded-2xl hover:bg-[#0A3D2E] transition-colors duration-200 font-inter font-medium"
                >
                  <span>Ver todos os posts</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="font-inter text-lg text-[#6b7280]">
                Nenhum post publicado ainda.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 md:py-20 bg-[#7FBA3D]">
        <div className="max-w-[1200px] mx-auto px-5 text-center">
          <h2 className="font-inter font-bold text-3xl md:text-4xl text-white mb-4">
            Pronto para orçar sua obra?
          </h2>
          <p className="font-inter text-lg text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Escolha entre nossos preços de fábrica ou pronta entrega e receba seu orçamento personalizado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/produtos"
              className="flex items-center space-x-2 bg-white text-[#7FBA3D] px-8 py-4 rounded-2xl hover:bg-gray-100 transition-colors duration-200 font-inter font-semibold text-lg"
            >
              <span>Ver Produtos</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/orcamento"
              className="flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-2xl hover:bg-white hover:text-[#7FBA3D] transition-all duration-200 font-inter font-semibold text-lg"
            >
              <span>Ver Orçamento</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}