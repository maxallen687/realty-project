import { Link } from 'react-router-dom';
import { BedDouble, Car, Maximize2, MapPin, Star } from 'lucide-react';
import type { Property } from '../types';

interface Props {
  property: Property;
}

const statusColors: Record<string, string> = {
  'Pronto': 'bg-green-100 text-green-700',
  'Em construção': 'bg-yellow-100 text-yellow-700',
  'Comercial': 'bg-blue-100 text-blue-700',
};

const typeColors: Record<string, string> = {
  'Casa': 'bg-orange-100 text-orange-700',
  'Apartamento': 'bg-purple-100 text-purple-700',
  'Terreno': 'bg-amber-100 text-amber-700',
  'Chácara/Sítio/Fazenda': 'bg-emerald-100 text-emerald-700',
};

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function PropertyCard({ property }: Props) {
  const mainImage = property.images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80';

  return (
    <Link to={`/imovel/${property.id}`} className="block group">
      <div className="card group-hover:shadow-2xl transition-all duration-300">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {property.featured && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-brand-orange text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
              <Star className="w-3 h-3 fill-current" />
              Destaque
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className={`badge ${statusColors[property.status]} shadow-sm`}>
              {property.status}
            </span>
          </div>
          <div className="absolute bottom-3 left-3">
            <span className={`badge ${typeColors[property.type]} shadow-sm`}>
              {property.type}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-heading font-bold text-base text-gray-900 leading-tight line-clamp-2 group-hover:text-brand-orange transition-colors">
              {property.title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
            <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0" />
            <span className="line-clamp-1">{property.neighborhood}, {property.city}</span>
          </div>

          {/* Attributes */}
          <div className="flex items-center gap-4 text-gray-600 text-sm mb-4 border-t border-gray-100 pt-3">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1.5">
                <BedDouble className="w-4 h-4 text-gray-400" />
                <span>{property.bedrooms} dorm.</span>
              </div>
            )}
            {property.parkingSpaces > 0 && (
              <div className="flex items-center gap-1.5">
                <Car className="w-4 h-4 text-gray-400" />
                <span>{property.parkingSpaces} vaga{property.parkingSpaces !== 1 ? 's' : ''}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-gray-400" />
              <span>{property.area.toLocaleString('pt-BR')} m²</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-heading font-bold text-brand-orange">
              {formatPrice(property.price)}
            </span>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">Ver detalhes →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
