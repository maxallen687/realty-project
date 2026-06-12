import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { useProperties } from '../hooks/useProperties';
import type { PropertyFilters, PropertyType, PropertyStatus } from '../types';
import { CITIES, NEIGHBORHOODS } from '../data/mockProperties';

const DEFAULT_FILTERS: PropertyFilters = {
  search: '',
  city: '',
  neighborhood: '',
  type: '',
  status: '',
  bedrooms: '',
  parkingSpaces: '',
  priceMin: '',
  priceMax: '',
};

const PROPERTY_TYPES: PropertyType[] = ['Casa', 'Apartamento', 'Terreno', 'Chácara/Sítio/Fazenda'];
const PROPERTY_STATUSES: PropertyStatus[] = ['Pronto', 'Em construção', 'Comercial'];

export default function Sales() {
  const [searchParams] = useSearchParams();
  const { properties } = useProperties();
  const [filters, setFilters] = useState<PropertyFilters>(() => ({
    ...DEFAULT_FILTERS,
    type: (searchParams.get('type') as PropertyType) || '',
  }));
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const type = searchParams.get('type') as PropertyType;
    if (type) setFilters(f => ({ ...f, type }));
  }, [searchParams]);

  const neighborhoods = useMemo(
    () => (filters.city ? NEIGHBORHOODS[filters.city] || [] : []),
    [filters.city]
  );

  const filtered = useMemo(() => {
    return properties.filter(p => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.neighborhood.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q) && !p.address.toLowerCase().includes(q)) return false;
      }
      if (filters.city && p.city !== filters.city) return false;
      if (filters.neighborhood && p.neighborhood !== filters.neighborhood) return false;
      if (filters.type && p.type !== filters.type) return false;
      if (filters.status && p.status !== filters.status) return false;
      if (filters.bedrooms && p.bedrooms < parseInt(filters.bedrooms)) return false;
      if (filters.parkingSpaces && p.parkingSpaces < parseInt(filters.parkingSpaces)) return false;
      if (filters.priceMin && p.price < parseInt(filters.priceMin.replace(/\D/g, ''))) return false;
      if (filters.priceMax && p.price > parseInt(filters.priceMax.replace(/\D/g, ''))) return false;
      return true;
    });
  }, [properties, filters]);

  const set = (key: keyof PropertyFilters, value: string) => {
    setFilters(f => {
      const next = { ...f, [key]: value };
      if (key === 'city') next.neighborhood = '';
      return next;
    });
  };

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  const activeCount = Object.entries(filters).filter(([, v]) => v !== '').length;

  return (
    <main className="pt-20">
      {/* Header */}
      <section className="bg-brand-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-heading font-black text-white mb-2">
            <span className="text-brand-orange">Imóveis</span>
          </h1>
          <p className="text-brand-gray">
            {filtered.length} imóve{filtered.length !== 1 ? 'is' : 'l'} encontrado{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título, bairro ou cidade..."
              value={filters.search}
              onChange={e => set('search', e.target.value)}
              className="input-field pl-11"
            />
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm border-2 transition-all ${
              filtersOpen || activeCount > 0
                ? 'bg-brand-orange border-brand-orange text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
            {activeCount > 0 && (
              <span className="bg-white text-brand-orange text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
          {activeCount > 0 && (
            <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-3 rounded-lg text-sm text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-200 transition-all">
              <X className="w-4 h-4" />
              Limpar
            </button>
          )}
        </div>

        {/* Filters panel */}
        {filtersOpen && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* City */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Cidade</label>
                <div className="relative">
                  <select value={filters.city} onChange={e => set('city', e.target.value)} className="select-field pr-10">
                    <option value="">Todas as cidades</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Neighborhood */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Bairro</label>
                <div className="relative">
                  <select value={filters.neighborhood} onChange={e => set('neighborhood', e.target.value)} className="select-field pr-10" disabled={!filters.city}>
                    <option value="">Todos os bairros</option>
                    {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tipo</label>
                <div className="relative">
                  <select value={filters.type} onChange={e => set('type', e.target.value)} className="select-field pr-10">
                    <option value="">Todos os tipos</option>
                    {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                <div className="relative">
                  <select value={filters.status} onChange={e => set('status', e.target.value)} className="select-field pr-10">
                    <option value="">Todos os status</option>
                    {PROPERTY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Dormitórios (mín.)</label>
                <div className="flex gap-2">
                  {['', '1', '2', '3', '4+'].map(v => (
                    <button
                      key={v}
                      onClick={() => set('bedrooms', v === '4+' ? '4' : v)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                        (v === '' && filters.bedrooms === '') || (v === '4+' ? filters.bedrooms === '4' : filters.bedrooms === v)
                          ? 'bg-brand-orange border-brand-orange text-white'
                          : 'border-gray-200 text-gray-600 hover:border-brand-orange'
                      }`}
                    >
                      {v || 'Todos'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parking */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Vagas (mín.)</label>
                <div className="flex gap-2">
                  {['', '1', '2', '3+'].map(v => (
                    <button
                      key={v}
                      onClick={() => set('parkingSpaces', v === '3+' ? '3' : v)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                        (v === '' && filters.parkingSpaces === '') || (v === '3+' ? filters.parkingSpaces === '3' : filters.parkingSpaces === v)
                          ? 'bg-brand-orange border-brand-orange text-white'
                          : 'border-gray-200 text-gray-600 hover:border-brand-orange'
                      }`}
                    >
                      {v || 'Todos'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Preço mínimo</label>
                <input
                  type="number"
                  placeholder="R$ 0"
                  value={filters.priceMin}
                  onChange={e => set('priceMin', e.target.value)}
                  className="input-field"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Preço máximo</label>
                <input
                  type="number"
                  placeholder="Sem limite"
                  value={filters.priceMax}
                  onChange={e => set('priceMax', e.target.value)}
                  className="input-field"
                  min="0"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-gray-500 mb-2">Nenhum imóvel encontrado</h3>
            <p className="text-gray-400 mb-6">Tente ajustar os filtros para encontrar mais resultados.</p>
            <button onClick={clearFilters} className="btn-primary">Limpar filtros</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </section>
    </main>
  );
}
