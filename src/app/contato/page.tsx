import { MapPin, Phone, Mail, Clock, MessageCircle, Users, Truck, Handshake } from 'lucide-react';

export default function ContatoPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#7FBA3D] to-[#0A3D2E]">
        <div className="max-w-[1200px] mx-auto px-5 text-center">
          <h1 className="font-inter font-bold text-4xl md:text-5xl text-white mb-4">
            Entre em Contato
          </h1>
          <p className="font-inter text-lg text-white opacity-90 max-w-2xl mx-auto">
            Estamos prontos para atender você. Fale conosco e receba seu orçamento personalizado.
          </p>
        </div>
      </section>

      {/* Contato Principal */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Informações de Contato */}
            <div>
              <h2 className="font-inter font-bold text-3xl text-[#111827] mb-8">
                Fale Conosco
              </h2>
              
              <div className="space-y-6">
                {/* WhatsApp */}
                <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                  <div className="w-12 h-12 bg-[#25D366] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2">
                      WhatsApp
                    </h3>
                    <p className="font-inter text-[#6b7280] mb-3">
                      Atendimento rápido e orçamento em até 1 hora
                    </p>
                    <a
                      href="https://wa.me/5583921489515"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-[#25D366] text-white px-4 py-2 rounded-2xl hover:bg-[#128C7E] transition-colors duration-200 font-inter font-medium"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>(83)9 2148-9515</span>
                    </a>
                  </div>
                </div>

                {/* Telefone */}
                <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                  <div className="w-12 h-12 bg-[#7FBA3D] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2">
                      Telefone
                    </h3>
                    <p className="font-inter text-[#6b7280] mb-3">
                      Atendimento comercial e suporte técnico
                    </p>
                    <a
                      href="tel:+558321777553"
                      className="inline-flex items-center space-x-2 text-[#7FBA3D] hover:text-[#0A3D2E] font-inter font-medium"
                    >
                      <Phone className="w-4 h-4" />
                      <span>(83) 2177-7553</span>
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                  <div className="w-12 h-12 bg-[#C05A2B] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2">
                      E-mail
                    </h3>
                    <p className="font-inter text-[#6b7280] mb-3">
                      Para orçamentos detalhados e parcerias
                    </p>
                    <a
                      href="mailto:ecolar.contatos@gmail.com"
                      className="inline-flex items-center space-x-2 text-[#7FBA3D] hover:text-[#0A3D2E] font-inter font-medium"
                    >
                      <Mail className="w-4 h-4" />
                      <span>ecolar.contatos@gmail.com</span>
                    </a>
                  </div>
                </div>

                {/* Endereço */}
                <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                  <div className="w-12 h-12 bg-[#111827] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2">
                      Endereço
                    </h3>
                    <p className="font-inter text-[#6b7280] mb-3">
                      R. Pres. Washington Luís, 592<br />
                      Bessa, João Pessoa - PB<br />
                      CEP: 58035-340
                    </p>
                    <a
                      href="https://maps.google.com/?q=R.+Pres.+Washington+Luís,+592+-+Bessa,+João+Pessoa+-+PB,+58035-340"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-[#7FBA3D] hover:text-[#0A3D2E] font-inter font-medium"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Ver no Google Maps</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Horário de Funcionamento */}
            <div>
              <h2 className="font-inter font-bold text-3xl text-[#111827] mb-8">
                Horário de Atendimento
              </h2>
              
              <div className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.08)] mb-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-[#7FBA3D] rounded-2xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-inter font-semibold text-[#111827] text-xl">
                    Funcionamento
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-[#f1f5f9]">
                    <span className="font-inter font-medium text-[#111827]">Segunda a Sexta</span>
                    <span className="font-inter text-[#6b7280]">8:00 - 17:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#f1f5f9]">
                    <span className="font-inter font-medium text-[#111827]">Sábado</span>
                    <span className="font-inter text-[#6b7280]">8:00 - 12:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-inter font-medium text-[#111827]">Domingo</span>
                    <span className="font-inter text-[#C05A2B]">Fechado</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-[#f5f6f7] rounded-2xl">
                  <p className="font-inter text-sm text-[#6b7280]">
                    <strong className="text-[#111827]">WhatsApp:</strong> Atendimento 24h para orçamentos urgentes
                  </p>
                </div>
              </div>

              {/* CTA Rápido */}
              <div className="bg-gradient-to-br from-[#7FBA3D] to-[#0A3D2E] rounded-2xl p-8 text-center text-white">
                <h3 className="font-inter font-bold text-xl mb-4">
                  Precisa de um orçamento rápido?
                </h3>
                <p className="font-inter text-white opacity-90 mb-6">
                  Fale conosco pelo WhatsApp e receba sua cotação em até 1 hora!
                </p>
                <a
                  href="https://wa.me/5583921489515?text=Olá! Preciso de um orçamento rápido."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-white text-[#7FBA3D] px-6 py-3 rounded-2xl hover:bg-gray-100 transition-colors duration-200 font-inter font-semibold"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Solicitar Orçamento</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços Especiais */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="font-inter font-bold text-3xl md:text-4xl text-[#111827] mb-4">
              Nossos Serviços
            </h2>
            <p className="font-inter text-lg text-[#6b7280]">
              Soluções completas para sua obra
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#7FBA3D] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2">
                Orçamento em 1h
              </h3>
              <p className="font-inter text-[#6b7280] text-sm">
                Resposta rápida via WhatsApp com preços atualizados
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#C05A2B] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2">
                Entrega por Carrada
              </h3>
              <p className="font-inter text-[#6b7280] text-sm">
                Logística especializada para grandes volumes
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#111827] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-inter font-semibold text-[#111827] text-lg mb-2">
                Parcerias
              </h3>
              <p className="font-inter text-[#6b7280] text-sm">
                Soluções completas para profissionais e clientes finais
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}