import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Fuel, 
  Gauge, 
  Wind, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Vehicle } from '../../types';

interface VehicleCardProps {
  vehicle: Vehicle;
  searchDates?: { 
    startDate: string; 
    endDate: string;
    location?: string;
    returnLocation?: string;
  };
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, searchDates }) => {
  const isAvailable = vehicle.status === 'AVAILABLE';

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR');
  };

  const detailUrl = searchDates 
    ? `/vehicules/${vehicle.id}?${new URLSearchParams({
        startDate: searchDates.startDate || '',
        endDate: searchDates.endDate || '',
        ...(searchDates.location ? { location: searchDates.location } : {}),
        ...(searchDates.returnLocation ? { returnLocation: searchDates.returnLocation } : {}),
      }).toString()}`
    : `/vehicules/${vehicle.id}`;

  return (
    <div className="group rounded-3xl overflow-hidden bg-[#0C1019]/90 border border-white/[0.06] hover:border-[#B89B5F]/40 transition-all duration-500 flex flex-col justify-between hover:shadow-2xl hover:shadow-gold-500/5">
      
      {/* Photo & Overlays */}
      <div className="relative h-60 w-full overflow-hidden bg-[#07090E]">
        <img
          src={vehicle.imageUrl}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1019] via-transparent to-black/30 opacity-90" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-black/60 backdrop-blur-md text-[#D8C59A] border border-white/[0.08]">
            {vehicle.category.name}
          </span>
          {vehicle.year >= 2024 && (
            <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/[0.1] text-slate-200 border border-white/[0.15] backdrop-blur-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#D8C59A]" /> {vehicle.year}
            </span>
          )}
        </div>

        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 backdrop-blur-md ${
              isAvailable
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            {isAvailable ? 'Disponible' : vehicle.status === 'RENTED' ? 'En location' : 'Indisponible'}
          </span>
        </div>

        {/* Brand & Model Overlay */}
        <div className="absolute bottom-4 left-5 right-5">
          <p className="text-[10px] text-[#D8C59A] font-bold uppercase tracking-widest">{vehicle.brand}</p>
          <h3 className="text-xl font-black text-white group-hover:text-[#D8C59A] transition-colors tracking-tight">
            {vehicle.model}
          </h3>
        </div>
      </div>

      {/* Body Specs */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-white/[0.05] text-[11px] text-slate-300">
          <div className="flex items-center gap-2">
            <Gauge className="w-3.5 h-3.5 text-[#D8C59A]" />
            <span>{vehicle.transmission === 'AUTOMATIC' ? 'Automatique' : 'Manuelle'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="w-3.5 h-3.5 text-[#D8C59A]" />
            <span>{vehicle.fuel === 'GASOLINE' ? 'Essence' : vehicle.fuel === 'HYBRID' ? 'Hybride' : 'Diesel'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-[#D8C59A]" />
            <span>{vehicle.seats} Places</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-3.5 h-3.5 text-[#D8C59A]" />
            <span>Climatisation</span>
          </div>
        </div>

        {/* Caution & Kilométrage */}
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/80" />
            {vehicle.mileagePolicy}
          </span>
          <span>Caution : <strong className="text-slate-200 font-medium">{formatPrice(vehicle.deposit)} FCFA</strong></span>
        </div>

        {/* Price & Action */}
        <div className="pt-2 flex items-center justify-between gap-4 border-t border-white/[0.05]">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Tarif Journalier</p>
            <p className="text-xl font-black text-white">
              {formatPrice(vehicle.pricePerDay)}{' '}
              <span className="text-xs font-bold text-[#D8C59A]">FCFA</span>
            </p>
          </div>

          <Link
            to={detailUrl}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition duration-200 ${
              isAvailable
                ? 'btn-luxe-primary'
                : 'btn-luxe-secondary'
            }`}
          >
            <span>{isAvailable ? 'Réserver' : 'Détails'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
};
