'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

// Tipagem dos posts da API
interface Post {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  imagem: string;
  autor: string;
  data: string;
}

export default function BlogPost() {
  const params = useParams();
  const slug = String(params?.slug || '');

  const [post, setPost] = useState<Post | null>(null);
  const [outrosPosts, setOutrosPosts] = useState<Post[]>([]);

  // Buscar dados do post atual + relacionados
  useEffect(() => {
    if (!slug) return;

    const loadPost = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/posts`,
          { cache: 'no-store' }
        );

        if (!response.ok) return;

        const allPosts = await response.json();

        // Encontrar o post atual
        const currentPost = allPosts.find((p: any) => String(p.id) === slug);

        if (currentPost) {
          setPost({
            id: currentPost.id,
            titulo: currentPost.titulo,
            resumo: currentPost.resumo,
            conteudo: currentPost.descricao,
            imagem: currentPost.imagem,
            autor: currentPost.autor,
            data: currentPost.data_publicacao
          });
        }

        // Outros posts publicados
        const related = allPosts
          .filter(
            (p: any) => String(p.id) !== slug && p.status === 'publicado'
          )
          .sort(
            (a: any, b: any) =>
              new Date(b.data_publicacao).getTime() -
              new Date(a.data_publicacao).getTime()
          )
          .slice(0, 3)
          .map((r: any) => ({
            id: r.id,
            titulo: r.titulo,
            resumo: r.resumo,
            imagem: r.imagem,
            autor: r.autor,
            data: r.data_publicacao,
            conteudo: r.descricao
          }));

        setOutrosPosts(related);
      } catch (error) {
        console.error('Erro ao carregar post:', error);
      }
    };

    loadPost();
  }, [slug]);

  // Se o post não existir
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Post não encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            O post que você está procurando não existe.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 bg-[#7FBA3D] text-white px-6 py-3 rounded-xl hover:bg-[#0A3D2E] transition-colors font-inter font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Blog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-5 py-6">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-[#7FBA3D] hover:text-[#0A3D2E] transition-colors font-inter font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Blog</span>
          </Link>

          <div className="space-y-4">
            <h1 className="font-inter font-bold text-3xl md:text-4xl text-[#111827] leading-tight">
              {post.titulo}
            </h1>

            <div className="flex items-center space-x-6 text-[#6b7280] font-inter text-sm">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{post.autor}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(post.data).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-4xl mx-auto px-5 py-12">
        {post.imagem && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8">
            <Image
              src={post.imagem}
              alt={post.titulo}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {post.resumo && (
          <div className="bg-[#7FBA3D]/10 border-l-4 border-[#7FBA3D] p-6 rounded-r-xl mb-8">
            <p className="font-inter text-lg text-[#111827] font-medium italic">
              {post.resumo}
            </p>
          </div>
        )}

        <article className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-8">
          <div className="prose prose-lg max-w-none">
            <div className="font-inter text-[#374151] leading-relaxed whitespace-pre-line">
              {post.conteudo}
            </div>
          </div>
        </article>

        {/* Outros posts */}
        {outrosPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="font-inter font-bold text-2xl text-[#111827] mb-8">
              Outros posts que você pode gostar
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {outrosPosts.map((outro) => (
                <Link
                  key={outro.id}
                  href={`/blog/${outro.id}`}
                  className="group bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={outro.imagem}
                      alt={outro.titulo}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2 line-clamp-2">
                      {outro.titulo}
                    </h3>

                    <p className="font-inter text-[#6b7280] text-sm mb-4 line-clamp-2">
                      {outro.resumo}
                    </p>

                    <div className="flex items-center justify-between text-xs text-[#6b7280] font-inter">
                      <span>{outro.autor}</span>
                      <span>
                        {new Date(outro.data).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-16 bg-[#7FBA3D] rounded-2xl p-8 text-center text-white">
          <h3 className="font-inter font-bold text-2xl mb-4">
            Gostou do conteúdo?
          </h3>
          <p className="font-inter text-lg opacity-90 mb-6">
            Explore nossos produtos e encontre tudo para sua obra
          </p>

          <Link
            href="/produtos"
            className="inline-flex items-center space-x-2 bg-white text-[#7FBA3D] px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors font-inter font-medium"
          >
            <span>Ver Produtos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
