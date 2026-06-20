import { useState, useEffect, useCallback } from 'react';
import type { Property } from '../types';
import { mockProperties } from '../data/mockProperties';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY = 'machado_imoveis_properties';

type PropertyInput = Omit<Property, 'id' | 'createdAt' | 'updatedAt'>;

// ---- mapping between the database row (snake_case) and Property (camelCase) ----
type Row = Record<string, unknown>;

function rowToProperty(r: Row): Property {
  return {
    id: String(r.id),
    title: (r.title as string) ?? '',
    description: (r.description as string) ?? '',
    type: r.type as Property['type'],
    status: r.status as Property['status'],
    price: Number(r.price) || 0,
    city: (r.city as string) ?? '',
    neighborhood: (r.neighborhood as string) ?? '',
    address: (r.address as string) ?? '',
    bedrooms: Number(r.bedrooms) || 0,
    bathrooms: Number(r.bathrooms) || 0,
    parkingSpaces: Number(r.parking_spaces) || 0,
    area: Number(r.area) || 0,
    images: Array.isArray(r.images) ? (r.images as string[]) : [],
    featured: Boolean(r.featured),
    lat: r.lat == null ? undefined : Number(r.lat),
    lng: r.lng == null ? undefined : Number(r.lng),
    whatsappContact: (r.whatsapp_contact as string) ?? undefined,
    createdAt: (r.created_at as string) ?? '',
    updatedAt: (r.updated_at as string) ?? '',
  };
}

function inputToRow(data: Partial<PropertyInput>): Row {
  const row: Row = {};
  if (data.title !== undefined) row.title = data.title;
  if (data.description !== undefined) row.description = data.description;
  if (data.type !== undefined) row.type = data.type;
  if (data.status !== undefined) row.status = data.status;
  if (data.price !== undefined) row.price = data.price;
  if (data.city !== undefined) row.city = data.city;
  if (data.neighborhood !== undefined) row.neighborhood = data.neighborhood;
  if (data.address !== undefined) row.address = data.address;
  if (data.bedrooms !== undefined) row.bedrooms = data.bedrooms;
  if (data.bathrooms !== undefined) row.bathrooms = data.bathrooms;
  if (data.parkingSpaces !== undefined) row.parking_spaces = data.parkingSpaces;
  if (data.area !== undefined) row.area = data.area;
  if (data.images !== undefined) row.images = data.images;
  if (data.featured !== undefined) row.featured = data.featured;
  if (data.lat !== undefined) row.lat = data.lat ?? null;
  if (data.lng !== undefined) row.lng = data.lng ?? null;
  if (data.whatsappContact !== undefined) row.whatsapp_contact = data.whatsappContact || null;
  return row;
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // ---- initial load ----
  useEffect(() => {
    let active = true;

    if (isSupabaseConfigured && supabase) {
      supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!active) return;
          if (error) {
            console.error('Erro ao carregar imóveis:', error.message);
            setProperties([]);
          } else {
            setProperties((data ?? []).map(rowToProperty));
          }
          setLoading(false);
        });
    } else {
      // Demo mode: local browser storage (até as chaves do Supabase existirem)
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setProperties(stored ? JSON.parse(stored) : mockProperties);
      } catch {
        setProperties(mockProperties);
      }
      setLoading(false);
    }

    return () => { active = false; };
  }, []);

  // Persist to localStorage only in demo mode
  useEffect(() => {
    if (!isSupabaseConfigured && !loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
    }
  }, [properties, loading]);

  const addProperty = useCallback(async (data: PropertyInput): Promise<Property | null> => {
    if (isSupabaseConfigured && supabase) {
      const { data: row, error } = await supabase
        .from('properties')
        .insert(inputToRow(data))
        .select()
        .single();
      if (error || !row) {
        console.error('Erro ao cadastrar imóvel:', error?.message);
        return null;
      }
      const created = rowToProperty(row);
      setProperties(prev => [created, ...prev]);
      return created;
    }

    const now = new Date().toISOString();
    const created: Property = { ...data, id: now + Math.round(performance.now()), createdAt: now, updatedAt: now };
    setProperties(prev => [created, ...prev]);
    return created;
  }, []);

  const updateProperty = useCallback(async (id: string, updates: Partial<PropertyInput>): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      const { data: row, error } = await supabase
        .from('properties')
        .update(inputToRow(updates))
        .eq('id', id)
        .select()
        .single();
      if (error || !row) {
        console.error('Erro ao atualizar imóvel:', error?.message);
        return;
      }
      const updated = rowToProperty(row);
      setProperties(prev => prev.map(p => (p.id === id ? updated : p)));
      return;
    }

    setProperties(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
  }, []);

  const deleteProperty = useCallback(async (id: string): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) {
        console.error('Erro ao excluir imóvel:', error.message);
        return;
      }
    }
    setProperties(prev => prev.filter(p => p.id !== id));
  }, []);

  const toggleFeatured = useCallback(async (id: string): Promise<void> => {
    const current = properties.find(p => p.id === id);
    if (!current) return;
    await updateProperty(id, { featured: !current.featured });
  }, [properties, updateProperty]);

  const getProperty = useCallback((id: string) => properties.find(p => p.id === id), [properties]);

  return { properties, loading, addProperty, updateProperty, deleteProperty, getProperty, toggleFeatured };
}
