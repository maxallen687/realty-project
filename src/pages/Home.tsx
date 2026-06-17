import { Link } from 'react-router-dom';
import { Home as HomeIcon, Building2, Trees, MapPin, ArrowRight, Star, ShieldCheck, Clock, Users } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { useProperties } from '../hooks/useProperties';

export default function Home() {
  const { properties } = useProperties();
  const featured = properties.filter(p => p.featured).slice(0, 3);

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center bg-brand-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80"
            alt="hero"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black/80 via-brand-black/60 to-brand-black" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-32 text-center">

          {/* Brand identity block */}
          <div className="flex flex-col items-center mb-8">
            <img
              src="/logo.png"
              alt="Machado Imóveis"
              className="h-28 md:h-36 w-auto drop-shadow-2xl mb-4"
            />
            <div className="flex flex-col items-center">
              <span className="font-heading font-black text-white text-3xl md:text-4xl tracking-widest leading-none">MACHADO</span>
              <span className="font-heading font-black text-brand-orange text-2xl md:text-3xl tracking-[0.3em] leading-none">IMÓVEIS</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-brand-orange/20 border border-brand-orange/30 text-brand-orange text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Star className="w-4 h-4 fill-current" />
            O nome certo para grandes negócios!
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black text-white leading-tight mb-6">
            Encontre o imóvel<br />
            <span className="text-brand-orange">dos seus sonhos</span>
          </h1>

          <p className="text-xl text-brand-gray max-w-2xl mx-auto mb-10 leading-relaxed">
            Casas, apartamentos, terrenos e chácaras em Santana do Livramento e região.
            Experiências imobiliárias únicas, com confiança e atendimento VIP.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-2 mb-14">
            {[
              { value: `${properties.length}+`, label: 'Imóveis disponíveis' },
              { value: '200+', label: 'Clientes satisfeitos' },
              { value: '10+', label: 'Anos de experiência' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-heading font-black text-brand-orange">{stat.value}</div>
                <div className="text-brand-gray text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Explore por categoria</h2>
            <p className="section-subtitle">Encontre o tipo de imóvel ideal para você</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: HomeIcon,   label: 'Casas',       type: 'Casa',                  bg: 'bg-brand-orange',                   text: 'text-white',        hover: 'group-hover:bg-brand-orange-dark' },
              { icon: Building2, label: 'Apartamentos', type: 'Apartamento',            bg: 'bg-brand-black',                    text: 'text-white',        hover: 'group-hover:bg-gray-800' },
              { icon: MapPin,    label: 'Terrenos',     type: 'Terreno',               bg: 'bg-brand-gray',                     text: 'text-brand-black',  hover: 'group-hover:bg-brand-gray-dark' },
              { icon: Trees,     label: 'Chácaras',     type: 'Chácara/Sítio/Fazenda', bg: 'bg-[#3a3a3a]',                      text: 'text-white',        hover: 'group-hover:bg-brand-black' },
            ].map(cat => {
              const count = properties.filter(p => p.type === cat.type).length;
              return (
                <Link
                  key={cat.type}
                  to={`/vendas?type=${encodeURIComponent(cat.type)}`}
                  className={`group relative rounded-2xl overflow-hidden aspect-square flex flex-col items-center justify-center gap-3 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 ${cat.bg} ${cat.hover}`}
                >
                  <cat.icon className={`w-10 h-10 ${cat.text} transition-transform duration-300 group-hover:scale-110`} />
                  <span className={`font-heading font-bold text-lg ${cat.text}`}>{cat.label}</span>
                  <span className={`text-sm ${cat.text} opacity-70`}>{count} imóve{count !== 1 ? 'is' : 'l'}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured properties */}
      {featured.length > 0 && (
        <section className="py-16 bg-brand-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="section-title">Imóveis em destaque</h2>
                <p className="section-subtitle">Oportunidades selecionadas para você</p>
              </div>
              <Link to="/vendas" className="hidden md:flex items-center gap-2 text-brand-orange font-semibold hover:gap-3 transition-all">
                Ver todos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {featured.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
            <div className="text-center mt-8 md:hidden">
              <Link to="/vendas" className="btn-primary">
                Ver todos os imóveis <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why choose us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Por que escolher a Machado Imóveis?</h2>
            <p className="section-subtitle">Comprometidos com a sua satisfação em cada detalhe</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: 'Segurança Técnica', desc: 'Com formação em Engenharia Civil, garantimos regularização impecável e segurança técnica em cada negócio.' },
              { icon: Clock, title: 'Atendimento VIP', desc: 'Respondemos rapidamente via WhatsApp. Cada cliente é único e tratado de forma personalizada.' },
              { icon: Users, title: 'Experiência Comprovada', desc: 'Mais de 10 anos no mercado imobiliário, transformando clientes em protagonistas de grandes conquistas.' },
            ].map(item => (
              <div key={item.title} className="text-center p-8 rounded-2xl bg-brand-gray hover:shadow-lg transition-shadow group">
                <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-orange group-hover:scale-110 transition-all duration-300">
                  <item.icon className="w-8 h-8 text-brand-orange group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-heading font-bold text-xl text-brand-black mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-brand-orange">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-black text-white mb-4">
            Tem um imóvel para vender?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Anuncie conosco e alcance milhares de compradores. Avaliação gratuita e atendimento especializado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/anuncie" className="bg-white text-brand-orange hover:bg-brand-gray font-bold px-8 py-4 rounded-xl transition-colors inline-flex items-center justify-center gap-2">
              Anunciar meu imóvel
            </Link>
            <a href="https://wa.me/55992038731" target="_blank" rel="noopener noreferrer" className="bg-white/20 hover:bg-white/30 text-white font-bold px-8 py-4 rounded-xl transition-colors inline-flex items-center justify-center gap-2 border border-white/30">
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
