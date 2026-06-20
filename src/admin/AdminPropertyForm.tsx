import { useState, useRef } from 'react';
import { X, Upload, Plus, Star, StarOff, ChevronDown } from 'lucide-react';
import type { Property, PropertyType, PropertyStatus } from '../types';
import { supabase, isSupabaseConfigured, PROPERTY_IMAGES_BUCKET } from '../lib/supabase';

const PROPERTY_TYPES: PropertyType[] = ['Casa', 'Apartamento', 'Terreno', 'Chácara/Sítio/Fazenda'];
const PROPERTY_STATUSES: PropertyStatus[] = ['Pronto', 'Em construção', 'Comercial'];

interface Props {
  property?: Property;
  onSave: (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => void | Promise<void>;
  onCancel: () => void;
}

type FormData = Omit<Property, 'id' | 'createdAt' | 'updatedAt'>;

const EMPTY: FormData = {
  title: '',
  description: '',
  type: 'Casa',
  status: 'Pronto',
  price: 0,
  city: '',
  neighborhood: '',
  address: '',
  bedrooms: 0,
  bathrooms: 0,
  parkingSpaces: 0,
  area: 0,
  images: [],
  featured: false,
  lat: undefined,
  lng: undefined,
  whatsappContact: '',
};

export default function AdminPropertyForm({ property, onSave, onCancel }: Props) {
  const [form, setForm] = useState<FormData>(property ? {
    title: property.title,
    description: property.description,
    type: property.type,
    status: property.status,
    price: property.price,
    city: property.city,
    neighborhood: property.neighborhood,
    address: property.address,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    parkingSpaces: property.parkingSpaces,
    area: property.area,
    images: [...property.images],
    featured: property.featured,
    lat: property.lat,
    lng: property.lng,
    whatsappContact: property.whatsappContact || '',
  } : EMPTY);

  const [newImageUrl, setNewImageUrl] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  const appendImages = (urls: string[]) => {
    if (urls.length) setForm(f => ({ ...f, images: [...f.images, ...urls] }));
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.title.trim()) newErrors.title = 'Título obrigatório';
    if (!form.city.trim()) newErrors.city = 'Cidade obrigatória';
    if (!form.neighborhood.trim()) newErrors.neighborhood = 'Bairro obrigatório';
    if (!form.address.trim()) newErrors.address = 'Endereço obrigatório';
    if (form.price <= 0) newErrors.price = 'Preço inválido';
    if (form.area <= 0) newErrors.area = 'Área inválida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      appendImages([newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    set('images', form.images.filter((_, i) => i !== index));
  };

  const readAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = ev => resolve(ev.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = ''; // allow re-selecting the same file later
    if (!files.length) return;

    setUploading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        // Upload each file to Supabase Storage and keep the public URL.
        const urls: string[] = [];
        for (const file of files) {
          const ext = file.name.split('.').pop() || 'jpg';
          const path = `${Date.now()}-${Math.round(performance.now())}-${urls.length}.${ext}`;
          const { error } = await supabase.storage
            .from(PROPERTY_IMAGES_BUCKET)
            .upload(path, file, { cacheControl: '3600', upsert: false });
          if (error) {
            console.error('Erro no upload da imagem:', error.message);
            continue;
          }
          const { data } = supabase.storage.from(PROPERTY_IMAGES_BUCKET).getPublicUrl(path);
          urls.push(data.publicUrl);
        }
        appendImages(urls);
      } else {
        // Demo mode: embed the image as a base64 data URL.
        const urls = await Promise.all(files.map(readAsDataUrl));
        appendImages(urls.filter(Boolean));
      }
    } finally {
      setUploading(false);
    }
  };

  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl my-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-heading font-bold text-brand-black">
            {property ? 'Editar Imóvel' : 'Novo Imóvel'}
          </h2>
          <button onClick={onCancel} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <Field label="Título *" error={errors.title}>
                <input type="text" value={form.title} onChange={e => set('title', e.target.value)} className="input-field" placeholder="Ex: Casa com Piscina em Condomínio" />
              </Field>
            </div>

            <Field label="Tipo *">
              <div className="relative">
                <select value={form.type} onChange={e => set('type', e.target.value as PropertyType)} className="select-field pr-10">
                  {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </Field>

            <Field label="Status *">
              <div className="relative">
                <select value={form.status} onChange={e => set('status', e.target.value as PropertyStatus)} className="select-field pr-10">
                  {PROPERTY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </Field>

            <Field label="Preço (R$) *" error={errors.price}>
              <input type="number" min="0" value={form.price || ''} onChange={e => set('price', parseFloat(e.target.value) || 0)} className="input-field" placeholder="0" />
            </Field>

            <Field label="Área (m²) *" error={errors.area}>
              <input type="number" min="0" value={form.area || ''} onChange={e => set('area', parseFloat(e.target.value) || 0)} className="input-field" placeholder="0" />
            </Field>

            <Field label="Cidade *" error={errors.city}>
              <input type="text" value={form.city} onChange={e => set('city', e.target.value)} className="input-field" placeholder="Ex: Curitiba" />
            </Field>

            <Field label="Bairro *" error={errors.neighborhood}>
              <input type="text" value={form.neighborhood} onChange={e => set('neighborhood', e.target.value)} className="input-field" placeholder="Ex: Batel" />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Endereço completo *" error={errors.address}>
                <input type="text" value={form.address} onChange={e => set('address', e.target.value)} className="input-field" placeholder="Ex: Rua das Flores, 123 – Apto 45" />
              </Field>
            </div>

            <Field label="Dormitórios">
              <input type="number" min="0" max="20" value={form.bedrooms} onChange={e => set('bedrooms', parseInt(e.target.value) || 0)} className="input-field" />
            </Field>

            <Field label="Banheiros">
              <input type="number" min="0" max="20" value={form.bathrooms} onChange={e => set('bathrooms', parseInt(e.target.value) || 0)} className="input-field" />
            </Field>

            <Field label="Vagas de garagem">
              <input type="number" min="0" max="20" value={form.parkingSpaces} onChange={e => set('parkingSpaces', parseInt(e.target.value) || 0)} className="input-field" />
            </Field>

            <Field label="WhatsApp para contato">
              <input type="text" value={form.whatsappContact || ''} onChange={e => set('whatsappContact', e.target.value)} className="input-field" placeholder="55992038731" />
            </Field>
          </div>

          {/* Description */}
          <Field label="Descrição">
            <textarea
              rows={5}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              className="input-field resize-none"
              placeholder="Descreva o imóvel com detalhes: localização, características, diferenciais..."
            />
          </Field>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Fotos do imóvel</label>

            {/* Thumbnails */}
            {form.images.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {form.images.map((img, i) => (
                  <div key={i} className="relative w-24 h-20 group">
                    <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-lg transition-colors" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-brand-orange text-white text-[9px] font-bold px-1.5 py-0.5 rounded">CAPA</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add by URL */}
            <div className="flex gap-2 mb-3">
              <input
                type="url"
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                className="input-field flex-1"
                placeholder="Cole URL da imagem e pressione Adicionar"
              />
              <button type="button" onClick={addImageUrl} className="btn-primary px-4 py-2 text-sm">
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>

            {/* Upload local */}
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full border-2 border-dashed border-gray-300 hover:border-brand-orange rounded-xl py-6 flex flex-col items-center gap-2 text-gray-500 hover:text-brand-orange transition-colors disabled:opacity-60"
            >
              <Upload className="w-6 h-6" />
              <span className="text-sm font-medium">{uploading ? 'Enviando imagens...' : 'Fazer upload do computador'}</span>
              <span className="text-xs text-gray-400">PNG, JPG ou WebP</span>
            </button>
          </div>

          {/* Featured toggle */}
          <div className="flex items-center justify-between bg-brand-gray rounded-xl p-4">
            <div>
              <p className="font-semibold text-gray-800">Imóvel em destaque</p>
              <p className="text-gray-500 text-sm">Aparece na seção de destaques da página inicial</p>
            </div>
            <button
              type="button"
              onClick={() => set('featured', !form.featured)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                form.featured
                  ? 'bg-brand-orange text-white shadow-md'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-brand-orange'
              }`}
            >
              {form.featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
              {form.featured ? 'Destaque ativo' : 'Ativar destaque'}
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-100">
            <button type="submit" disabled={saving || uploading} className="btn-primary flex-1 justify-center py-3.5 disabled:opacity-60">
              {saving ? 'Salvando...' : property ? 'Salvar alterações' : 'Cadastrar imóvel'}
            </button>
            <button type="button" onClick={onCancel} className="flex-1 py-3.5 border-2 border-gray-200 text-gray-600 rounded-lg font-semibold hover:border-gray-300 transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
