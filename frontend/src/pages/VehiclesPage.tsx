import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  SlidersHorizontal,
  Car
} from 'lucide-react';
import { VehicleCard } from '../components/booking/VehicleCard';
import { SearchBar } from '../components/booking/SearchBar';
import { api } from '../services/api';
import { Vehicle, VehicleCategory } from '../types';

export const VehiclesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryParam = searchParams.get('category') || 'all';
  const transmissionParam = searchParams.get('transmission') || 'all';
  const fuelParam = searchParams.get('fuel') || 'all';
  const sortParam = searchParams.get('sort') || 'price_asc';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const minSeatsParam = searchParams.get('minSeats') || '';

  const locationParam = searchParams.get('location') || 'AIBD_DAKAR';
  const returnLocationParam = searchParams.get('returnLocation') || locationParam;
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, any> = {
      category: categoryParam !== 'all' ? categoryParam : undefined,
      transmission: transmissionParam !== 'all' ? transmissionParam : undefined,
      fuel: fuelParam !== 'all' ? fuelParam : undefined,
      sort: sortParam,
      maxPrice: maxPriceParam ? Number(maxPriceParam) : undefined,
      minSeats: minSeatsParam ? Number(minSeatsParam) : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };

    api.getVehicles(params)
      .then(res => {
        setVehicles(res.vehicles);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categoryParam, transmissionParam, fuelParam, sortParam, maxPriceParam, minSeatsParam, startDate, endDate]);

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    const next = new URLSearchParams();
    if (startDate) next.set('startDate', startDate);
    if (endDate) next.set('endDate', endDate);
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="space-y-4">
        <div>
          <p className="text-[10px] text-[#D8C59A] font-bold uppercase tracking-widest mb-1">Catalogue Officiel</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            La Flotte Automobile Hertz Digital
          </h1>
        </div>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Sélectionnez un véhicule récent, climatisé et révisé. Nos tarifs s'entendent toutes taxes comprises en FCFA avec caution bloquée restituée à terme.
        </p>

        {/* Compact SearchBar */}
        <div className="pt-2">
          <SearchBar 
            compact 
            initialValues={{ 
              location: locationParam, 
              returnLocation: returnLocationParam, 
              startDate, 
              endDate 
            }} 
          />
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">
        
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-3xl p-6 bg-[#0C1019]/90 border border-white/[0.06] space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 font-bold text-white text-xs uppercase tracking-wider">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#D8C59A]" />
                <span>Filtres de sélection</span>
              </div>
              {(categoryParam !== 'all' || transmissionParam !== 'all' || fuelParam !== 'all' || maxPriceParam) && (
                <button
                  onClick={clearAllFilters}
                  className="text-[10px] font-bold text-[#D8C59A] hover:underline uppercase"
                >
                  Effacer
                </button>
              )}
            </div>

            {/* Catégories */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2.5">
                Catégorie de véhicule
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => updateFilter('category', 'all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                    categoryParam === 'all'
                      ? 'bg-[#B89B5F] text-black font-extrabold shadow-sm'
                      : 'text-slate-300 hover:bg-white/[0.04]'
                  }`}
                >
                  <span>Tous les modèles</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateFilter('category', cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                      categoryParam === cat.slug
                        ? 'bg-[#B89B5F] text-black font-extrabold shadow-sm'
                        : 'text-slate-300 hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat._count?.vehicles !== undefined && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        categoryParam === cat.slug ? 'bg-black/20 text-black font-bold' : 'bg-white/[0.05] text-slate-400'
                      }`}>
                        {cat._count.vehicles}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2.5">
                Transmission
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateFilter('transmission', transmissionParam === 'AUTOMATIC' ? 'all' : 'AUTOMATIC')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                    transmissionParam === 'AUTOMATIC'
                      ? 'bg-[#B89B5F] text-black border-[#B89B5F]'
                      : 'bg-white/[0.03] text-slate-300 border-white/[0.06] hover:border-white/[0.12]'
                  }`}
                >
                  Automatique
                </button>
                <button
                  onClick={() => updateFilter('transmission', transmissionParam === 'MANUAL' ? 'all' : 'MANUAL')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                    transmissionParam === 'MANUAL'
                      ? 'bg-[#B89B5F] text-black border-[#B89B5F]'
                      : 'bg-white/[0.03] text-slate-300 border-white/[0.06] hover:border-white/[0.12]'
                  }`}
                >
                  Manuelle
                </button>
              </div>
            </div>

            {/* Motorisation */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2.5">
                Motorisation
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['DIESEL', 'GASOLINE', 'HYBRID'].map((f) => (
                  <button
                    key={f}
                    onClick={() => updateFilter('fuel', fuelParam === f ? 'all' : f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      fuelParam === f
                        ? 'bg-[#B89B5F] text-black border-[#B89B5F] font-bold'
                        : 'bg-white/[0.03] text-slate-300 border-white/[0.06] hover:border-white/[0.12]'
                    }`}
                  >
                    {f === 'GASOLINE' ? 'Essence' : f === 'HYBRID' ? 'Hybride' : 'Diesel'}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Max */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Budget max / jour
                </label>
                <span className="text-xs font-extrabold text-[#D8C59A]">
                  {maxPriceParam ? `${Number(maxPriceParam).toLocaleString('fr-FR')} F` : 'Tous tarifs'}
                </span>
              </div>
              <input
                type="range"
                min="20000"
                max="150000"
                step="5000"
                value={maxPriceParam || '150000'}
                onChange={(e) => updateFilter('maxPrice', e.target.value)}
                className="w-full accent-[#B89B5F] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>20 000 F</span>
                <span>150 000 F</span>
              </div>
            </div>

          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Results Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0C1019]/90 border border-white/[0.06]">
            <div>
              <p className="text-xs font-extrabold text-white tracking-wide">
                <span className="text-[#D8C59A] font-black">{vehicles.length}</span> véhicule{vehicles.length > 1 ? 's' : ''} disponible{vehicles.length > 1 ? 's' : ''}
              </p>
              <p className="text-[10px] text-slate-400">
                Réservation immédiate et confirmation en temps réel
              </p>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Trier par :</span>
              <select
                value={sortParam}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="bg-[#07090E] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-[#B89B5F] cursor-pointer"
              >
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="popularity">Popularité & Récents</option>
              </select>
            </div>
          </div>

          {/* Grid Vehicles */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-96 rounded-3xl bg-slate-900/40 animate-pulse border border-white/[0.05]" />
              ))}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="rounded-3xl p-12 text-center bg-[#0C1019]/90 border border-white/[0.06] space-y-4">
              <Car className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">Aucun véhicule ne correspond à ces critères</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Veuillez élargir votre recherche en réinitialisant vos filtres de motorisation ou de budget.
              </p>
              <button
                onClick={clearAllFilters}
                className="btn-luxe-primary px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-extrabold"
              >
                Voir toute la flotte
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  searchDates={{
                    startDate: startDate || '',
                    endDate: endDate || '',
                    location: locationParam,
                    returnLocation: returnLocationParam,
                  }}
                />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
