import { Award, Target, Heart, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative bg-brand-black py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1600&q=80"
            alt="Sobre nós"
            className="w-full h-full object-cover opacity-15"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-4">
            Sobre a <span className="text-brand-orange">Machado Imóveis</span>
          </h1>
          <p className="text-xl text-brand-gray">
            Conheça a nossa história, valores e compromisso com você
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">Nossa história</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-black mt-2 mb-6">
                Mais de 10 anos realizando sonhos
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  A Machado Imóveis nasceu do sonho de oferecer um serviço imobiliário diferenciado em Curitiba e região metropolitana. Com mais de uma década de experiência, construímos nossa reputação com base em transparência, dedicação e resultados concretos.
                </p>
                <p>
                  Como corretor de imóveis credenciado, atuo com ética e profissionalismo em todas as etapas da negociação — desde a avaliação do imóvel até a assinatura do contrato. Cada cliente recebe atenção personalizada, porque entendo que a compra ou venda de um imóvel é uma das decisões mais importantes da sua vida.
                </p>
                <p>
                  Nosso portfólio abrange residências, apartamentos, terrenos, chácaras e imóveis comerciais em toda a grande Curitiba. Se você busca qualidade, segurança e agilidade, a Machado Imóveis é o parceiro certo para você.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link to="/vendas" className="btn-primary">
                  Ver imóveis disponíveis
                </Link>
                <a href="https://wa.me/5541999999999" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <Phone className="w-4 h-4" />
                  Falar no WhatsApp
                </a>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?w=800&q=80"
                alt="Corretor"
                className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/5]"
              />
              <div className="absolute -bottom-6 -left-6 bg-brand-orange text-white p-6 rounded-2xl shadow-xl">
                <div className="text-3xl font-heading font-black">10+</div>
                <div className="text-white/90 text-sm">Anos de experiência</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-brand-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Nossos valores</h2>
            <p className="section-subtitle">O que nos move todos os dias</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Award,
                title: 'Excelência',
                desc: 'Comprometidos com o mais alto padrão em cada atendimento e negociação. Qualidade é inegociável.',
              },
              {
                icon: Target,
                title: 'Foco no Cliente',
                desc: 'Seu objetivo é o nosso objetivo. Ouvimos, entendemos e buscamos a melhor solução para suas necessidades.',
              },
              {
                icon: Heart,
                title: 'Paixão pelo que fazemos',
                desc: 'Amamos o que fazemos e isso se reflete em cada imóvel apresentado, em cada negócio fechado.',
              },
            ].map(value => (
              <div key={value.title} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-brand-orange rounded-xl flex items-center justify-center mb-5">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-heading font-bold text-xl text-brand-black mb-3">{value.title}</h3>
                <p className="text-gray-500 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10+', label: 'Anos no mercado' },
              { value: '200+', label: 'Imóveis negociados' },
              { value: '150+', label: 'Famílias atendidas' },
              { value: '98%', label: 'Clientes satisfeitos' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-heading font-black text-brand-orange">{stat.value}</div>
                <div className="text-brand-gray text-sm mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title mb-4">Pronto para encontrar seu imóvel?</h2>
          <p className="section-subtitle mb-8">Entre em contato e descubra como podemos ajudar você hoje mesmo.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/vendas" className="btn-primary">Ver imóveis</Link>
            <Link to="/contato" className="btn-secondary">Fale conosco</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
