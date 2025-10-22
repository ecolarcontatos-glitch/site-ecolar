import Link from 'next/link';
import { Facebook, Instagram, Mail, MapPin, Clock, Phone } from 'lucide-react';
import { categorias } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-white">
      <div className="max-w-[1200px] mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[#7FBA3D] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-inter font-semibold text-white text-lg">
                ECOLAR
              </span>
            </div>
            <p className="text-[#6b7280] font-inter mb-6 leading-relaxed">
              Materiais de construção e decoração com qualidade e tradição. 
              Telhas, tijolos, pisos e elementos decorativos para sua obra.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-[#7FBA3D] rounded-lg flex items-center justify-center hover:bg-[#0A3D2E] transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#7FBA3D] rounded-lg flex items-center justify-center hover:bg-[#0A3D2E] transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="font-inter font-semibold text-white text-lg mb-4">
              Categorias
            </h3>
            <ul className="space-y-3">
              {categorias.map((categoria) => (
                <li key={categoria.id}>
                  <Link
                    href={`/produtos?categoria=${categoria.slug}`}
                    className="text-[#6b7280] hover:text-[#7FBA3D] transition-colors duration-200 font-inter"
                  >
                    {categoria.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="font-inter font-semibold text-white text-lg mb-4">
              Serviços
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/parcerias"
                  className="text-[#6b7280] hover:text-[#7FBA3D] transition-colors duration-200 font-inter"
                >
                  Entrega por carrada
                </Link>
              </li>
              <li>
                <Link
                  href="/parcerias"
                  className="text-[#6b7280] hover:text-[#7FBA3D] transition-colors duration-200 font-inter"
                >
                  Clique & Retire
                </Link>
              </li>
              <li>
                <Link
                  href="/parcerias"
                  className="text-[#6b7280] hover:text-[#7FBA3D] transition-colors duration-200 font-inter"
                >
                  Parcerias B2B
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-[#6b7280] hover:text-[#7FBA3D] transition-colors duration-200 font-inter"
                >
                  Orçamento em 1h
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-inter font-semibold text-white text-lg mb-4">
              Contato
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://wa.me/5511999999999"
                  className="flex items-center space-x-2 text-[#6b7280] hover:text-[#7FBA3D] transition-colors duration-200 font-inter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="w-4 h-4" />
                  <span>(11) 99999-9999</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@ecolar.com.br"
                  className="flex items-center space-x-2 text-[#6b7280] hover:text-[#7FBA3D] transition-colors duration-200 font-inter"
                >
                  <Mail className="w-4 h-4" />
                  <span>contato@ecolar.com.br</span>
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com"
                  className="flex items-start space-x-2 text-[#6b7280] hover:text-[#7FBA3D] transition-colors duration-200 font-inter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Rua das Construções, 123<br />Centro, São Paulo - SP</span>
                </a>
              </li>
              <li>
                <div className="flex items-start space-x-2 text-[#6b7280] font-inter">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Segunda a Sexta: 8h às 18h<br />Sábado: 8h às 12h</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha Legal */}
        <div className="border-t border-[#374151] mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-[#6b7280] font-inter text-sm">
              © 2024 ECOLAR — Construção & Decoração. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/privacidade"
                className="text-[#6b7280] hover:text-[#7FBA3D] transition-colors duration-200 font-inter text-sm"
              >
                Política de Privacidade
              </Link>
              <Link
                href="/termos"
                className="text-[#6b7280] hover:text-[#7FBA3D] transition-colors duration-200 font-inter text-sm"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}