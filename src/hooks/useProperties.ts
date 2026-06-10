import { useState, useEffect } from 'react';
import type { Property } from '../types';
import { mockProperties } from '../data/mockProperties';

const STORAGE_KEY = 'machado_imoveis_properties';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return mockProperties;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
  }, [properties]);

  const addProperty = (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProperty: Property = {
      ...property,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProperties(prev => [newProperty, ...prev]);
    return newProperty;
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties(prev =>
      prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)
    );
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const getProperty = (id: string) => properties.find(p => p.id === id);

  const toggleFeatured = (id: string) => {
    setProperties(prev =>
      prev.map(p => p.id === id ? { ...p, featured: !p.featured, updatedAt: new Date().toISOString() } : p)
    );
  };

  return { properties, addProperty, updateProperty, deleteProperty, getProperty, toggleFeatured };
}
