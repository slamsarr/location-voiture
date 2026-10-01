import React, { useEffect, useState } from 'react';
import { 
  Car, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Wrench, 
  X, 
  Sparkles,
  Shield,
  Eye,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { Vehicle, VehicleCategory } from '../../types';

export const AdminVehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: 2024,
    categoryId: '',
    transmission: 'AUTOMATIC',
    fuel: 'DIESEL',
    seats: 5,
    doors: 5,
    pricePerDay: 45000,
    deposit: 250000,
    status: 'AVAILABLE',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
    description: '',
    plateNumber: '',
  });

  const fetchVehicles = () => {
    setLoading(true);
    api.getVehicles()
      .then(res => setVehicles(res.vehicles))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVehicles();
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  const openCreateModal = () => {
    setEditingVehicle(null);
    setFormData({
      brand: '',
      model: '',
      year: 2024,
      categoryId: categories[0]?.id || '',
      transmission: 'AUTOMATIC',
      fuel: 'DIESEL',
      seats: 5,
      doors: 5,
      pricePerDay: 45000,
      deposit: 250000,
      status: 'AVAILABLE',
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
      description: 'Véhicule récent tout confort climatisé.',
      plateNumber: `DK-2024-HZ${Math.floor(10 + Math.random() * 90)}`,
    });
    setModalOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      categoryId: vehicle.categoryId,
      transmission: vehicle.transmission,
      fuel: vehicle.fuel,
      seats: vehicle.seats,
      doors: vehicle.doors,
      pricePerDay: vehicle.pricePerDay,
      deposit: vehicle.deposit,
      status: vehicle.status,
      imageUrl: vehicle.imageUrl,
      description: vehicle.description,
      plateNumber: vehicle.plateNumber,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        await api.updateVehicle(editingVehicle.id, formData as any);
      } else {
        await api.createVehicle(formData as any);
      }
      setModalOpen(false);
      fetchVehicles();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule du catalogue ?')) {
      try {
        await api.deleteVehicle(id);
        fetchVehicles();
      } catch (err: any) {
        alert(err.message || 'Impossible de supprimer ce véhicule.');
      }
    }
  };

  const handleStatusToggle = async (vehicle: Vehicle, newStatus: string) => {
    try {
      await api.updateVehicle(vehicle.id, { status: newStatus as any });
      fetchVehicles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Gestion de la Flotte</h1>
          <p className="text-xs text-slate-400">
            {vehicles.length} véhicules répertoriés dans la base opérationnelle
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Ajouter un véhicule</span>
        </button>
      </div>

      {/* Grid Vehicles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(n => (
            <div key={n} className="h-72 rounded-3xl bg-slate-900/50 animate-pulse border border-slate-800" />
          ))
        ) : (
          vehicles.map((v) => (
            <div
              key={v.id}
              className="glass-panel rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between hover:border-brand-500/30 transition shadow-xl"
            >
              <div className="relative h-44 w-full bg-slate-900">
                <img
                  src={v.imageUrl}
                  alt={v.model}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-black/70 text-amber-400 border border-amber-500/30 backdrop-blur-md">
                    {v.category?.name}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase backdrop-blur-md ${
                    v.status === 'AVAILABLE'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : v.status === 'RENTED'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {v.status}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-white text-base">{v.brand} {v.model}</h3>
                    <p className="text-xs text-slate-400">{v.plateNumber} • {v.transmission === 'AUTOMATIC' ? 'Auto' : 'Manuelle'} • {v.fuel}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-amber-400 text-sm">{v.pricePerDay.toLocaleString('fr-FR')} F</p>
                    <p className="text-[10px] text-slate-500">par jour</p>
                  </div>
                </div>

                {/* Quick Status Bar */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">Statut :</span>
                  <select
                    value={v.status}
                    onChange={(e) => handleStatusToggle(v, e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-bold text-white focus:outline-none cursor-pointer"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="RESERVED">RESERVED</option>
                    <option value="RENTED">RENTED</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800/80">
                  <button
                    onClick={() => openEditModal(v)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
                    title="Modifier"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-rose-400 border border-slate-800 transition"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-xl font-black text-white">
                {editingVehicle ? 'Modifier le véhicule' : 'Ajouter un véhicule à la flotte'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase">Marque</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Toyota"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase">Modèle</label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="RAV4 AWD"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase">Année</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase">Catégorie</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase">Immat.</label>
                  <input
                    type="text"
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                    placeholder="DK-2024-HZ01"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase">Prix / jour (FCFA)</label>
                  <input
                    type="number"
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase">Caution (FCFA)</label>
                  <input
                    type="number"
                    value={formData.deposit}
                    onChange={(e) => setFormData({ ...formData, deposit: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase">URL Image</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 uppercase">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs shadow-lg transition"
                >
                  Enregistrer
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
