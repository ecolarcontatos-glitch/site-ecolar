import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { posts } from '@/lib/data';

export default function BlogPage() {
  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="max-w-[1200px] mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-inter font-bold text-3xl md:text-4xl text-[#111827] mb-4">
            Blog ECOLAR
          </h1>
          <p className="font-inter text-lg text-[#6b7280] max-w-2xl mx-auto">
            Dicas, informações e novidades sobre construção e decoração para sua obra
          </p>
        </div>

        {/* Grid de Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
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
                <h2 className="font-inter font-semibold text-[#111827] text-xl mb-3 line-clamp-2 group-hover:text-[#7FBA3D] transition-colors">
                  {post.titulo}
                </h2>
                <p className="font-inter text-[#6b7280] text-sm mb-4 line-clamp-3">
                  {post.resumo}
                </p>
                <div className="flex items-center justify-between text-xs text-[#6b7280] font-inter mb-4">
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{post.autor}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(post.data).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-[#7FBA3D] group-hover:text-[#0A3D2E] font-inter font-medium text-sm">
                  <span>Ler mais</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-[#f1f5f9] rounded-2xl p-8 md:p-12">
            <h2 className="font-inter font-bold text-2xl md:text-3xl text-[#111827] mb-4">
              Tem alguma dúvida sobre construção?
            </h2>
            <p className="font-inter text-lg text-[#6b7280] mb-8 max-w-2xl mx-auto">
              Nossa equipe está pronta para ajudar com informações técnicas e sugestões para sua obra.
            </p>
            <Link
              href="/contato"
              className="inline-flex items-center space-x-2 bg-[#7FBA3D] text-white px-8 py-4 rounded-2xl hover:bg-[#0A3D2E] transition-colors duration-200 font-inter font-semibold text-lg"
            >
              <span>Entre em contato</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}