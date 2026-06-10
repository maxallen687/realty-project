import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  BedDouble, Car, Maximize2, MapPin, MessageCircle,
  ChevronLeft, ChevronRight, X, Star, Bath, ArrowLeft,
  Share2, Heart,
} from 'lucide-react';
import { useProperties } from '../hooks/useProperties';
import { formatPrice } from '../components/PropertyCard';
import PropertyCard from '../components/PropertyCard';

const statusColors: Record<string, string> = {
  'Pronto': 'bg-green-100 text-green-700',
  'Em construção': 'bg-yellow-100 text-yellow-700',
  'Comercial': 'bg-blue-100 text-blue-700',
};

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, getProperty } = useProperties();
  const property = getProperty(id!);

  const [currentImg, setCurrentImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!property) {
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold text-gray-500 mb-4">Imóvel não encontrado</h2>
          <Link to="/vendas" className="btn-primary">Ver todos os imóveis</Link>
        </div>
      </main>
    );
  }

  const images = property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'];

  const similar = properties
    .filter(p => p.id !== property.id && (p.type === property.type || p.city === property.city))
    .slice(0, 3);

  const prev = () => setCurrentImg(i => (i - 1 + images.length) % images.length);
  const next = () => setCurrentImg(i => (i + 1) % images.length);

  const whatsappMsg = encodeURIComponent(
    `Olá! Tenho interesse no imóvel *${property.title}* (${property.neighborhood}, ${property.city}) — ${formatPrice(property.price)}. Podemos conversar?`
  );

  return (
    <main className="pt-20">
      {/* Breadcrumb */}
      <div className="bg-brand-gray border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-brand-orange transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <span>/</span>
          <Link to="/vendas" className="hover:text-brand-orange transition-colors">Vendas</Link>
          <span>/</span>
          <span className="text-gray-700 truncate max-w-xs">{property.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video group shadow-xl">
              <img
                src={images[currentImg]}
                alt={`${property.title} - foto ${currentImg + 1}`}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                onClick={() => setLightbox(true)}
              />
              {property.featured && (
                <div className="absolute top-4 left-4 flex items-center gap-1 bg-brand-orange text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                  <Star className="w-3 h-3 fill-current" />
                  Destaque
                </div>
              )}
              <span className={`absolute top-4 right-4 badge ${statusColors[property.status]} shadow`}>
                {property.status}
              </span>
              {images.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImg(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === currentImg ? 'bg-white w-4' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
              <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {currentImg + 1}/{images.length}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImg(i)}
                    className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      i === currentImg ? 'border-brand-orange scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Title & location */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-brand-black">{property.title}</h1>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setSaved(!saved)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${saved ? 'bg-red-50 border-red-300 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400'}`}
                    title="Salvar"
                  >
                    <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => navigator.share?.({ title: property.title, url: window.location.href })}
                    className="w-10 h-10 rounded-full border-2 border-gray-200 text-gray-400 hover:border-brand-orange hover:text-brand-orange flex items-center justify-center transition-all"
                    title="Compartilhar"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-500 mt-2">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0" />
                <span>{property.address} — {property.neighborhood}, {property.city} – PR</span>
              </div>
            </div>

            {/* Attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Maximize2, label: 'Área', value: `${property.area.toLocaleString('pt-BR')} m²` },
                ...(property.bedrooms > 0 ? [{ icon: BedDouble, label: 'Dormitórios', value: property.bedrooms.toString() }] : []),
                ...(property.bathrooms > 0 ? [{ icon: Bath, label: 'Banheiros', value: property.bathrooms.toString() }] : []),
                ...(property.parkingSpaces > 0 ? [{ icon: Car, label: 'Vagas', value: property.parkingSpaces.toString() }] : []),
              ].map(attr => (
                <div key={attr.label} className="bg-brand-gray rounded-xl p-4 text-center">
                  <attr.icon className="w-5 h-5 text-brand-orange mx-auto mb-1.5" />
                  <div className="font-heading font-bold text-brand-black text-lg">{attr.value}</div>
                  <div className="text-gray-500 text-xs">{attr.label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-heading font-bold text-xl text-brand-black mb-4">Descrição</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-heading font-bold text-xl text-brand-black mb-4">Detalhes do imóvel</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Tipo', value: property.type },
                  { label: 'Status', value: property.status },
                  { label: 'Cidade', value: property.city },
                  { label: 'Bairro', value: property.neighborhood },
                  { label: 'Área total', value: `${property.area.toLocaleString('pt-BR')} m²` },
                  ...(property.bedrooms > 0 ? [{ label: 'Dormitórios', value: property.bedrooms.toString() }] : []),
                  ...(property.bathrooms > 0 ? [{ label: 'Banheiros', value: property.bathrooms.toString() }] : []),
                  ...(property.parkingSpaces > 0 ? [{ label: 'Vagas de garagem', value: property.parkingSpaces.toString() }] : []),
                ].map(detail => (
                  <div key={detail.label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500 text-sm">{detail.label}</span>
                    <span className="text-gray-800 text-sm font-medium">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-24">
              <div className="text-3xl font-heading font-black text-brand-orange mb-1">
                {formatPrice(property.price)}
              </div>
              <p className="text-gray-500 text-sm mb-5">{property.type} em {property.neighborhood}</p>

              <a
                href={`https://wa.me/5541999999999?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-colors shadow-md hover:shadow-lg mb-3"
              >
                <MessageCircle className="w-5 h-5" />
                Falar no WhatsApp
              </a>

              <Link to="/anuncie" className="w-full flex items-center justify-center gap-2 btn-secondary mb-4">
                Quero anunciar meu imóvel
              </Link>

              <div className="border-t border-gray-100 pt-4 space-y-2.5">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 text-brand-orange shrink-0" />
                  {property.city} – PR
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className={`badge text-xs ${statusColors[property.status]}`}>{property.status}</span>
                  <span className="text-brand-orange font-medium">{property.type}</span>
                </div>
              </div>
            </div>

            {/* Safety notice */}
            <div className="bg-brand-gray rounded-xl p-4 text-sm text-gray-600 border border-gray-200">
              <p className="font-semibold text-gray-700 mb-1">Negociação segura</p>
              <p>Não realize pagamentos antecipados. Toda negociação é feita de forma presencial ou por canais oficiais.</p>
            </div>
          </div>
        </div>

        {/* Similar properties */}
        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="section-title mb-8">Imóveis similares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {similar.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button className="absolute top-4 right-4 w-10 h-10 text-white bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center" onClick={() => setLightbox(false)}>
            <X className="w-5 h-5" />
          </button>
          <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 text-white bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <img
            src={images[currentImg]}
            alt={property.title}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={e => e.stopPropagation()}
          />
          <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 text-white bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </main>
  );
}
