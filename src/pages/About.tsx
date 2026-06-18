import { Link } from 'react-router-dom';
import { Phone, Target, Eye, Heart, Award, Lightbulb, Handshake, TrendingUp } from 'lucide-react';

const values = [
  {
    icon: Award,
    title: 'Exclusividade',
    desc: 'Cada cliente é único e tratado de forma personalizada.',
  },
  {
    icon: Handshake,
    title: 'Confiança',
    desc: 'Negócios transparentes e seguros em cada etapa.',
  },
  {
    icon: Heart,
    title: 'Excelência',
    desc: 'Atendimento de alto nível, superando expectativas.',
  },
  {
    icon: Lightbulb,
    title: 'Inovação',
    desc: 'Processos modernos e estratégias inteligentes de vendas.',
  },
  {
    icon: Target,
    title: 'Comprometimento',
    desc: 'Transformar sonhos em patrimônio com total dedicação.',
  },
  {
    icon: TrendingUp,
    title: 'Resultados',
    desc: 'Foco em grandes negócios que geram satisfação e crescimento para todos.',
  },
];

export default function About() {
  return (
    <main className="pt-28 md:pt-36">
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
          <div className="inline-block bg-brand-orange/20 border border-brand-orange/30 text-brand-orange text-sm font-medium px-4 py-2 rounded-full mb-5">
            O nome certo para grandes negócios!
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-4">
            Sobre a <span className="text-brand-orange">Machado Imóveis</span>
          </h1>
          <p className="text-xl text-brand-gray">
            A união da técnica com o propósito
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
                A União da Técnica com o Propósito
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  A Machado Imóveis nasceu da união entre a solidez da engenharia e a sensibilidade do design. Com mais de 10 anos de experiência na Engenharia Civil, <strong className="text-brand-black">Bruno Machado</strong> fundou a imobiliária para transformar o mercado local, oferecendo segurança técnica, regularização impecável e soluções reais para quem busca patrimônio.
                </p>
                <p>
                  Complementando essa visão, a <strong className="text-brand-black">Designer de Interiores Romina Alonso</strong> traz um olhar refinado sobre cada espaço, revelando o verdadeiro potencial de valorização de cada imóvel.
                </p>
                <p>
                  Como uma empresa familiar, guiada pela presença da nossa pequena Alfonsina, compreendemos que por trás de cada negociação existe um projeto de vida. Nosso compromisso é proporcionar experiências únicas, unindo técnica, ética e um atendimento VIP que transforma clientes em protagonistas de grandes conquistas.
                </p>
                <p className="font-semibold text-brand-black">
                  Machado Imóveis: O nome certo para grandes negócios.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link to="/vendas" className="btn-primary">
                  Ver imóveis disponíveis
                </Link>
                <a href="https://wa.me/55992038731" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <Phone className="w-4 h-4" />
                  Falar no WhatsApp
                </a>
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="relative inline-block">
                <img
                  src="/familia.png"
                  alt="Bruno Machado, Romina Alonso e Alfonsina"
                  className="rounded-2xl shadow-2xl w-full object-cover aspect-[2/3]"
                />
                <div className="absolute -bottom-6 -left-6 bg-brand-orange text-white p-6 rounded-2xl shadow-xl">
                  <div className="text-3xl font-heading font-black">10+</div>
                  <div className="text-white/90 text-sm">Anos de experiência</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-brand-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Missão &amp; Visão</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-brand-black rounded-2xl p-8 text-white">
              <div className="w-14 h-14 bg-brand-orange rounded-xl flex items-center justify-center mb-5">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading font-bold text-2xl mb-4">Missão</h3>
              <p className="text-brand-gray leading-relaxed">
                Proporcionar experiências imobiliárias únicas, com confiança e atendimento que transforma clientes em protagonistas de grandes conquistas.
              </p>
            </div>
            <div className="bg-brand-orange rounded-2xl p-8 text-white">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-5">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading font-bold text-2xl mb-4">Visão</h3>
              <p className="text-white/90 leading-relaxed">
                Ser a imobiliária mais lembrada e desejada da região, referência em negócios exclusivos e atendimento VIP, onde pensar em imóveis significa pensar na Machado Imóveis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Nossos Valores</h2>
            <p className="section-subtitle">Os princípios que guiam cada negócio</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(v => (
              <div key={v.title} className="bg-brand-gray rounded-2xl p-6 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-brand-orange rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <v.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-bold text-lg text-brand-black mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
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
