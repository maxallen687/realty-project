import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Edit2, Trash2, Star, StarOff, LogOut, Home,
  Search, Eye, LayoutDashboard, Building2,
} from 'lucide-react';
import { useProperties } from '../hooks/useProperties';
import { useAdmin } from '../hooks/useAdmin';
import type { Property } from '../types';
import AdminPropertyForm from './AdminPropertyForm';
import { formatPrice } from '../components/PropertyCard';

const statusColors: Record<string, string> = {
  'Pronto': 'bg-green-100 text-green-700',
  'Em construção': 'bg-yellow-100 text-yellow-700',
  'Comercial': 'bg-blue-100 text-blue-700',
};

export default function AdminDashboard() {
  const { properties, addProperty, updateProperty, deleteProperty, toggleFeatured } = useProperties();
  const { logout } = useAdmin();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>();
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = properties.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.city.toLowerCase().includes(search.toLowerCase()) ||
    p.neighborhood.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProperty) {
      updateProperty(editingProperty.id, data);
    } else {
      addProperty(data);
    }
    setFormOpen(false);
    setEditingProperty(undefined);
  };

  const handleEdit = (p: Property) => {
    setEditingProperty(p);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteProperty(id);
    setDeleteConfirm(null);
  };

  const featured = properties.filter(p => p.featured).length;
  const total = properties.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-brand-black text-white px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="" className="h-8 w-auto" />
          <div>
            <div className="font-heading font-bold text-sm text-white">MACHADO IMÓVEIS</div>
            <div className="text-brand-orange text-xs">Painel Administrativo</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" target="_blank" className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Ver site</span>
          </Link>
          <button onClick={logout} className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 text-sm px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Building2, label: 'Total de imóveis', value: total, color: 'text-brand-orange' },
            { icon: Star, label: 'Em destaque', value: featured, color: 'text-yellow-500' },
            { icon: Home, label: 'Prontos', value: properties.filter(p => p.status === 'Pronto').length, color: 'text-green-500' },
            { icon: LayoutDashboard, label: 'Em construção', value: properties.filter(p => p.status === 'Em construção').length, color: 'text-blue-500' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={`text-3xl font-heading font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar imóvel..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button
            onClick={() => { setEditingProperty(undefined); setFormOpen(true); }}
            className="btn-primary shrink-0"
          >
            <Plus className="w-4 h-4" />
            Novo imóvel
          </button>
        </div>

        {/* Properties list */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Nenhum imóvel encontrado</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Imóvel</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Tipo / Status</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Preço</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Destaque</th>
                      <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {p.images[0] ? (
                              <img src={p.images[0]} alt="" className="w-14 h-10 object-cover rounded-lg shrink-0" />
                            ) : (
                              <div className="w-14 h-10 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center">
                                <Home className="w-5 h-5 text-gray-300" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-800 text-sm line-clamp-1">{p.title}</p>
                              <p className="text-gray-400 text-xs">{p.neighborhood}, {p.city}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-600 font-medium">{p.type}</span>
                            <span className={`badge text-xs w-fit ${statusColors[p.status]}`}>{p.status}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-bold text-brand-orange text-sm">{formatPrice(p.price)}</span>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => toggleFeatured(p.id)}
                            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                              p.featured
                                ? 'bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                          >
                            {p.featured ? <Star className="w-3.5 h-3.5 fill-current" /> : <StarOff className="w-3.5 h-3.5" />}
                            {p.featured ? 'Destaque' : 'Normal'}
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/imovel/${p.id}`}
                              target="_blank"
                              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-blue-100 hover:text-blue-600 flex items-center justify-center transition-colors"
                              title="Visualizar"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleEdit(p)}
                              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-brand-orange/10 hover:text-brand-orange flex items-center justify-center transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(p.id)}
                              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {filtered.map(p => (
                  <div key={p.id} className="p-4 flex gap-4">
                    {p.images[0] ? (
                      <img src={p.images[0]} alt="" className="w-16 h-16 object-cover rounded-xl shrink-0" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-xl shrink-0 flex items-center justify-center">
                        <Home className="w-7 h-7 text-gray-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm line-clamp-1">{p.title}</p>
                      <p className="text-gray-400 text-xs mb-1">{p.neighborhood}, {p.city}</p>
                      <p className="font-bold text-brand-orange text-sm">{formatPrice(p.price)}</p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleEdit(p)} className="text-xs bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-lg font-medium flex items-center gap-1">
                          <Edit2 className="w-3 h-3" />
                          Editar
                        </button>
                        <button onClick={() => toggleFeatured(p.id)} className={`text-xs px-3 py-1 rounded-lg font-medium flex items-center gap-1 ${p.featured ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                          <Star className="w-3 h-3" />
                          {p.featured ? 'Destaque' : 'Normal'}
                        </button>
                        <button onClick={() => setDeleteConfirm(p.id)} className="text-xs bg-red-50 text-red-500 px-3 py-1 rounded-lg font-medium flex items-center gap-1">
                          <Trash2 className="w-3 h-3" />
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Property form modal */}
      {formOpen && (
        <AdminPropertyForm
          property={editingProperty}
          onSave={handleSave}
          onCancel={() => { setFormOpen(false); setEditingProperty(undefined); }}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-heading font-bold text-gray-800 mb-2">Confirmar exclusão</h3>
            <p className="text-gray-500 mb-6">Esta ação não pode ser desfeita. Deseja realmente excluir este imóvel?</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors">
                Excluir
              </button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
