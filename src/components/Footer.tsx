import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0A3D2E] text-white">
      <div className="max-w-[1200px] mx-auto px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/fa155124-8442-4fa3-aede-ff541b4163a7.png"
                alt="ECOLAR"
                width={150}
                height={50}
                className="h-6 w-auto brightness-0 invert"
              />
            </Link>
            <p className="font-inter text-gray-300 text-sm leading-relaxed">
              Materiais de construção e decoração com qualidade e tradição. 
              Sua obra merece o melhor.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
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

          {/* Serviços */}
          <div>
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

          {/* Contato */}
          <div>
            <h3 className="font-inter font-semibold text-white text-lg mb-4">
              Contato
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#7FBA3D] mt-0.5 flex-shrink-0" />
                <span className="font-inter text-gray-300 text-sm">
                  R. Pres. Washington Luís, 592<br />
                  Bessa, João Pessoa - PB<br />
                  CEP: 58035-340
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#7FBA3D] flex-shrink-0" />
                <a
                  href="tel:+558321777553"
                  className="font-inter text-gray-300 hover:text-[#7FBA3D] transition-colors duration-200 text-sm"
                >
                  (83) 2177-7553
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#7FBA3D] flex-shrink-0" />
                <a
                  href="mailto:ecolar.contatos@gmail.com"
                  className="font-inter text-gray-300 hover:text-[#7FBA3D] transition-colors duration-200 text-sm"
                >
                  ecolar.contatos@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-[#7FBA3D] flex-shrink-0" />
                <a
                  href="https://wa.me/558393661690"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-inter text-gray-300 hover:text-[#7FBA3D] transition-colors duration-200 text-sm"
                >
                  (83) 9366-1690
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="font-inter text-gray-400 text-sm">
              © 2024 ECOLAR. Todos os direitos reservados.
            </p>
            <p className="font-inter text-gray-400 text-sm mt-2 md:mt-0">
              Materiais de construção com qualidade e sustentabilidade.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}