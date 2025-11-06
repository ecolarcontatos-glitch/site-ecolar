'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';

interface SiteConfig {
  logoFooter: string;
  telefone: string;
  email: string;
  endereco: string;
  whatsapp: string;
  textoRodape: string;
}

export default function Footer() {
  const [config, setConfig] = useState<SiteConfig>({
    logoFooter: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/fa155124-8442-4fa3-aede-ff541b4163a7.png',
    telefone: '(83) 2177-7553',
    email: 'ecolar.contatos@gmail.com',
    endereco: 'R. Pres. Washington Luís, 592 - Bessa, João Pessoa - PB, 58035-340',
    whatsapp: '558393661690',
    textoRodape: 'Materiais de construção com qualidade e sustentabilidade.'
  });

  // Carregar configurações do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedConfig = localStorage.getItem('ecolar_config');
      if (storedConfig) {
        try {
          const parsedConfig = JSON.parse(storedConfig);
          setConfig({
            logoFooter: parsedConfig.logoFooter || config.logoFooter,
            telefone: parsedConfig.telefone || config.telefone,
            email: parsedConfig.email || config.email,
            endereco: parsedConfig.endereco || config.endereco,
            whatsapp: parsedConfig.whatsapp || config.whatsapp,
            textoRodape: parsedConfig.textoRodape || config.textoRodape
          });
        } catch (error) {
          console.error('Erro ao carregar configurações do footer:', error);
        }
      }
    }
  }, []);

  // Formatar WhatsApp para link
  const whatsappLink = `https://wa.me/${config.whatsapp}`;
  const whatsappDisplay = config.whatsapp.replace(/(\d{2})(\d{2})(\d{4,5})(\d{4})/, '($1) $2$3-$4');

  return (
    <footer className="bg-[#0A3D2E] text-white">
      <div className="max-w-[1200px] mx-auto px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição - CENTRALIZADO NO MOBILE */}
          <div className="md:col-span-1 text-center md:text-left">
            <Link href="/" className="inline-block mb-4">
              <Image
                src={config.logoFooter}
                alt="ECOLAR"
                width={150}
                height={50}
                className="h-6 w-auto brightness-0 invert"
              />
            </Link>
            <p className="font-inter text-gray-300 text-sm leading-relaxed">
              {config.textoRodape}
            </p>
          </div>

          {/* Links Rápidos - CENTRALIZADO NO MOBILE */}
          <div className="text-center md:text-left">
            <h3 className="font-inter font-semibold text-white text-lg mb-4">
              Links Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/produtos"
                  className="font-inter text-gray-300 hover:text-[#7FBA3D] transition-colors duration-200"
                >
                  Produtos
                </Link>
              </li>
              <li>
                <Link
                  href="/parcerias"
                  className="font-inter text-gray-300 hover:text-[#7FBA3D] transition-colors duration-200"
                >
                  Parcerias
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="font-inter text-gray-300 hover:text-[#7FBA3D] transition-colors duration-200"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="font-inter text-gray-300 hover:text-[#7FBA3D] transition-colors duration-200"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Serviços - CENTRALIZADO NO MOBILE */}
          <div className="text-center md:text-left">
            <h3 className="font-inter font-semibold text-white text-lg mb-4">
              Serviços
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/orcamento"
                  className="font-inter text-gray-300 hover:text-[#7FBA3D] transition-colors duration-200"
                >
                  Orçamento Online
                </Link>
              </li>
              <li>
                <Link
                  href="/parcerias"
                  className="font-inter text-gray-300 hover:text-[#7FBA3D] transition-colors duration-200"
                >
                  Entrega por Carrada
                </Link>
              </li>
              <li>
                <Link
                  href="/parcerias"
                  className="font-inter text-gray-300 hover:text-[#7FBA3D] transition-colors duration-200"
                >
                  Consultoria Técnica
                </Link>
              </li>
              <li>
                <Link
                  href="/parcerias"
                  className="font-inter text-gray-300 hover:text-[#7FBA3D] transition-colors duration-200"
                >
                  Produtos Sob Medida
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato - CENTRALIZADO NO MOBILE */}
          <div className="text-center md:text-left">
            <h3 className="font-inter font-semibold text-white text-lg mb-4">
              Contato
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 justify-center md:justify-start">
                <MapPin className="w-5 h-5 text-[#7FBA3D] mt-0.5 flex-shrink-0" />
                <span className="font-inter text-gray-300 text-sm">
                  R. Pres. Washington Luís<br />
                  592 - João Pessoa
                </span>
              </div>
              <div className="flex items-center space-x-3 justify-center md:justify-start">
                <Phone className="w-5 h-5 text-[#7FBA3D] flex-shrink-0" />
                <a
                  href={`tel:+55${config.telefone.replace(/\D/g, '')}`}
                  className="font-inter text-gray-300 hover:text-[#7FBA3D] transition-colors duration-200 text-sm"
                >
                  {config.telefone}
                </a>
              </div>
              <div className="flex items-center space-x-3 justify-center md:justify-start">
                <Mail className="w-5 h-5 text-[#7FBA3D] flex-shrink-0" />
                <a
                  href={`mailto:${config.email}`}
                  className="font-inter text-gray-300 hover:text-[#7FBA3D] transition-colors duration-200 text-sm"
                >
                  {config.email}
                </a>
              </div>
              <div className="flex items-center space-x-3 justify-center md:justify-start">
                <MessageCircle className="w-5 h-5 text-[#7FBA3D] flex-shrink-0" />
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-inter text-gray-300 hover:text-[#7FBA3D] transition-colors duration-200 text-sm"
                >
                  {whatsappDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <p className="font-inter text-gray-400 text-sm">
              © 2024 ECOLAR. Todos os direitos reservados.
            </p>
            <p className="font-inter text-gray-400 text-sm mt-2 md:mt-0">
              {config.textoRodape}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}