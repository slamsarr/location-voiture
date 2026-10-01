import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Search, ArrowRight } from 'lucide-react';

import { SENEGAL_HUBS } from '../map/SenegalAgenciesMap';

interface SearchBarProps {
  initialValues?: {
    location?: string;
    returnLocation?: string;
    startDate?: string;
    endDate?: string;
    pickupTime?: string;
    returnTime?: string;
  };
  compact?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ initialValues, compact = false }) => {
  const navigate = useNavigate();

  const defaultStart = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
  const defaultEnd = new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0];

  const [location, setLocation] = useState(initialValues?.location || 'AIBD_DAKAR');
  const [returnLocation, setReturnLocation] = useState(initialValues?.returnLocation || 'SALY_MBOUR');
  const [isOneWay, setIsOneWay] = useState(
    Boolean(initialValues?.returnLocation && initialValues?.returnLocation !== (initialValues?.location || 'AIBD_DAKAR'))
  );
  const [startDate, setStartDate] = useState(initialValues?.startDate || defaultStart);
  const [endDate, setEndDate] = useState(initialValues?.endDate || defaultEnd);
  const [pickupTime, setPickupTime] = useState(initialValues?.pickupTime || '10:00');
  const [returnTime, setReturnTime] = useState(initialValues?.returnTime || '10:00');

  const agencyOptions = SENEGAL_HUBS.map(hub => ({
    id: hub.id,
    label: hub.name
  }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      location,
      returnLocation: isOneWay ? returnLocation : location,
      startDate,
      endDate,
      pickupTime,
      returnTime,
    }).toString();
    navigate(`/vehicules?${query}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`glass-panel rounded-3xl p-3.5 sm:p-5 border border-white/[0.08] shadow-2xl ${
        compact ? 'max-w-4xl' : 'max-w-5xl'
      } mx-auto transition-all space-y-3`}
    >
      {/* Option Aller-Simple One-Way Checkbox */}
      <div className="flex items-center justify-between px-1">
        <label className="inline-flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300 hover:text-white">
          <input
            type="checkbox"
            checked={isOneWay}
            onChange={(e) => setIsOneWay(e.target.checked)}
            className="w-4 h-4 rounded border-white/20 bg-black/40 text-[#B89B5F] focus:ring-[#B89B5F] accent-[#B89B5F]"
          />
          <span className="font-semibold">Restituer dans une autre agence / ville (Aller-simple)</span>
        </label>
        {isOneWay && (
          <span className="text-[10px] text-[#D8C59A] font-bold uppercase tracking-wider bg-[#B89B5F]/15 px-2 py-0.5 rounded-full border border-[#B89B5F]/30">
            Frais logistiques calculés en direct
          </span>
        )}
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 ${isOneWay ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-3 lg:gap-4 items-center`}>
        
        {/* Lieu de prise en charge */}
        <div className="bg-[#0C1019]/90 rounded-2xl p-3.5 border border-white/[0.06] hover:border-[#B89B5F]/40 transition group">
          <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#D8C59A]" />
            Prise en charge
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
          >
            {agencyOptions.map((opt) => (
              <option key={opt.id} value={opt.id} className="bg-[#0C1019] text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Lieu de restitution (si Aller-Simple) */}
        {isOneWay && (
          <div className="bg-[#0C1019]/90 rounded-2xl p-3.5 border border-[#B89B5F]/30 hover:border-[#B89B5F] transition group animate-fade-in">
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-[#D8C59A] uppercase tracking-widest mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D8C59A]" />
              Restitution
            </label>
            <select
              value={returnLocation}
              onChange={(e) => setReturnLocation(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              {agencyOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-[#0C1019] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date & Heure Départ */}
        <div className="bg-[#0C1019]/90 rounded-2xl p-3.5 border border-white/[0.06] hover:border-[#B89B5F]/40 transition">
          <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#D8C59A]" />
            Départ
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none w-full cursor-pointer"
            />
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="bg-transparent text-[11px] font-medium text-slate-400 focus:outline-none w-14 cursor-pointer"
            />
          </div>
        </div>

        {/* Date & Heure Retour */}
        <div className="bg-[#0C1019]/90 rounded-2xl p-3.5 border border-white/[0.06] hover:border-[#B89B5F]/40 transition">
          <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#D8C59A]" />
            Restitution
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none w-full cursor-pointer"
            />
            <input
              type="time"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
              className="bg-transparent text-[11px] font-medium text-slate-400 focus:outline-none w-14 cursor-pointer"
            />
          </div>
        </div>

        {/* CTA Button Luxe */}
        <div>
          <button
            type="submit"
            className="btn-luxe-primary w-full h-[58px] rounded-2xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-extrabold active:scale-[0.98]"
          >
            <Search className="w-4 h-4 text-black" />
            <span>Rechercher un véhicule</span>
          </button>
        </div>

      </div>
    </form>
  );
};
