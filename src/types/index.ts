export type PropertyType = 'Casa' | 'Apartamento' | 'Terreno' | 'Chácara/Sítio/Fazenda';
export type PropertyStatus = 'Pronto' | 'Em construção' | 'Comercial';

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  city: string;
  neighborhood: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  area: number; // m²
  images: string[];
  featured: boolean;
  lat?: number;
  lng?: number;
  createdAt: string;
  updatedAt: string;
  whatsappContact?: string;
}

export interface PropertyFilters {
  search: string;
  city: string;
  neighborhood: string;
  type: PropertyType | '';
  status: PropertyStatus | '';
  bedrooms: string;
  parkingSpaces: string;
  priceMin: string;
  priceMax: string;
}

export interface LeadForm {
  name: string;
  whatsapp: string;
  propertyType: PropertyType | '';
  message: string;
}

export interface AdminUser {
  username: string;
  password: string;
}
