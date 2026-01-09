import Link from 'next/link';
import { Users, Truck, Clock, Leaf, MessageCircle, ArrowRight, CheckCircle } from 'lucide-react';

export default function ParceriasPage() {
  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="max-w-[1200px] mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-inter font-bold text-3xl md:text-4xl text-[#111827] mb-4">
            Parcerias & Serviços
          </h1>
          <p className="font-inter text-lg text-[#6b7280] max-w-2xl mx-auto">
            Soluções completas para profissionais da construção e clientes que buscam praticidade e qualidade
          </p>
        </div>

        {/* Profissionais */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-8 md:p-12 text-center">
                <div className="w-16 h-16 bg-[#7FBA3D] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="font-inter font-bold text-2xl md:text-3xl text-[#111827] mb-4">
                  Parcerias com Profissionais
                </h2>
                <p className="font-inter text-lg text-[#6b7280] mb-6">
                  Condições especiais para arquitetos, engenheiros, empreiteiros e construtoras
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#7FBA3D] mt-0.5 flex-shrink-0" />
                    <span className="font-inter text-[#6b7280]">Preços diferenciados para grandes volumes</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#7FBA3D] mt-0.5 flex-shrink-0" />
                    <span className="font-inter text-[#6b7280]">Prazo de pagamento estendido</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#7FBA3D] mt-0.5 flex-shrink-0" />
                    <span className="font-inter text-[#6b7280]">Suporte técnico especializado</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#7FBA3D] mt-0.5 flex-shrink-0" />
                    <span className="font-inter text-[#6b7280]">Entrega programada conforme cronograma da obra</span>
                  </div>
                </div>

                <div className="text-center">
                  <a
                    href="https://wa.me/558321489515?text=Olá! Sou um profissional da construção e gostaria de saber sobre as parcerias da ECOLAR."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-[#7FBA3D] text-white px-6 py-3 rounded-2xl hover:bg-[#0A3D2E] transition-colors duration-200 font-inter font-medium"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Solicitar parceria</span>
                  </a>
                </div>
              </div>
              
              <div className="bg-[#f1f5f9] p-8 md:p-12 flex items-center">
                <div className="w-full">
                  <h3 className="font-inter font-semibold text-[#111827] text-xl mb-4 text-center">
                    Como funciona?
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#7FBA3D] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-inter font-medium text-[#111827]">Cadastro</h4>
                        <p className="font-inter text-sm text-[#6b7280]">Entre em contato via WhatsApp com seus dados profissionais</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#7FBA3D] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-inter font-medium text-[#111827]">Análise</h4>
                        <p className="font-inter text-sm text-[#6b7280]">Avaliamos seu perfil e definimos as melhores condições</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#7FBA3D] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-inter font-medium text-[#111827]">Aprovação</h4>
                        <p className="font-inter text-sm text-[#6b7280]">Parceria aprovada e condições especiais ativadas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Serviços */}
        <section>
          <div className="text-center mb-12">
            <h2 className="font-inter font-bold text-2xl md:text-3xl text-[#111827] mb-4">
              Nossos Serviços
            </h2>
            <p className="font-inter text-lg text-[#6b7280]">
              Facilidades que fazem a diferença na sua obra
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Entrega por Carrada */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-center">
              <div className="w-16 h-16 bg-[#C05A2B] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-inter font-semibold text-[#111827] text-xl mb-4">
                Entrega por Carrada
              </h3>
              <p className="font-inter text-[#6b7280] mb-6">
                Logística especializada para grandes volumes. Entrega direta na sua obra com equipamentos adequados.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center space-x-2 justify-center">
                  <CheckCircle className="w-4 h-4 text-[#C05A2B]" />
                  <span className="font-inter text-sm text-[#6b7280]">Caminhões especializados</span>
                </div>
                <div className="flex items-center space-x-2 justify-center">
                  <CheckCircle className="w-4 h-4 text-[#C05A2B]" />
                  <span className="font-inter text-sm text-[#6b7280]">Entrega programada</span>
                </div>
                <div className="flex items-center space-x-2 justify-center">
                  <CheckCircle className="w-4 h-4 text-[#C05A2B]" />
                  <span className="font-inter text-sm text-[#6b7280]">Cobertura João Pessoa e região</span>
                </div>
              </div>
              <a
                href="https://wa.me/5583921489515?text=Olá! Gostaria de saber sobre a entrega por carrada."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-[#C05A2B] hover:text-[#0A3D2E] font-inter font-medium"
              >
                <span>Solicitar orçamento</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Produtos Sustentáveis */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-center">
              <div className="w-16 h-16 bg-[#7FBA3D] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-inter font-semibold text-[#111827] text-xl mb-4">
                Qualidade Sustentável
              </h3>
              <p className="font-inter text-[#6b7280] mb-6">
                Produtos de qualidade real de uma empresa sustentável e ecológica.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center space-x-2 justify-center">
                  <CheckCircle className="w-4 h-4 text-[#7FBA3D]" />
                  <span className="font-inter text-sm text-[#6b7280]">Materiais certificados</span>
                </div>
                <div className="flex items-center space-x-2 justify-center">
                  <CheckCircle className="w-4 h-4 text-[#7FBA3D]" />
                  <span className="font-inter text-sm text-[#6b7280]">Processos ecológicos</span>
                </div>
                <div className="flex items-center space-x-2 justify-center">
                  <CheckCircle className="w-4 h-4 text-[#7FBA3D]" />
                  <span className="font-inter text-sm text-[#6b7280]">Responsabilidade ambiental</span>
                </div>
              </div>
              <Link
                href="/produtos"
                className="inline-flex items-center space-x-2 text-[#7FBA3D] hover:text-[#0A3D2E] font-inter font-medium"
              >
                <span>Ver produtos</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Orçamento em 1h */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-center">
              <div className="w-16 h-16 bg-[#7FBA3D] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-inter font-semibold text-[#111827] text-xl mb-4">
                Orçamento em 1h
              </h3>
              <p className="font-inter text-[#6b7280] mb-6">
                Resposta rápida para seus orçamentos via WhatsApp. Preços atualizados e condições especiais.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center space-x-2 justify-center">
                  <CheckCircle className="w-4 h-4 text-[#7FBA3D]" />
                  <span className="font-inter text-sm text-[#6b7280]">Resposta em até 1h</span>
                </div>
                <div className="flex items-center space-x-2 justify-center">
                  <CheckCircle className="w-4 h-4 text-[#7FBA3D]" />
                  <span className="font-inter text-sm text-[#6b7280]">Preços atualizados</span>
                </div>
                <div className="flex items-center space-x-2 justify-center">
                  <CheckCircle className="w-4 h-4 text-[#7FBA3D]" />
                  <span className="font-inter text-sm text-[#6b7280]">Atendimento personalizado</span>
                </div>
              </div>
              <Link
                href="/contato"
                className="inline-flex items-center space-x-2 text-[#7FBA3D] hover:text-[#0A3D2E] font-inter font-medium"
              >
                <span>Solicitar orçamento</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="mt-20">
          <div className="bg-[#7FBA3D] rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-inter font-bold text-2xl md:text-3xl text-white mb-4">
              Pronto para ser nosso parceiro?
            </h2>
            <p className="font-inter text-lg text-white opacity-90 mb-8 max-w-2xl mx-auto">
              Entre em contato e descubra como podemos ajudar sua obra ou negócio a crescer com qualidade e eficiência.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://wa.me/5583921489515?text=Olá! Gostaria de saber mais sobre as parcerias da ECOLAR."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-white text-[#7FBA3D] px-8 py-4 rounded-2xl hover:bg-gray-100 transition-colors duration-200 font-inter font-semibold text-lg"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Falar no WhatsApp</span>
              </a>
              <Link
                href="/contato"
                className="flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-2xl hover:bg-white hover:text-[#7FBA3D] transition-all duration-200 font-inter font-semibold text-lg"
              >
                <span>Ver contatos</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}