import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Users, 
  Fuel, 
  Gauge, 
  Wind, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../store/useCartStore';
import { Vehicle, BookingOption } from '../types';
import { SENEGAL_HUBS, calculateOneWayFee } from '../components/map/SenegalAgenciesMap';

export const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  const defaultStart = searchParams.get('startDate') || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
  const defaultEnd = searchParams.get('endDate') || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0];
  const defaultLocation = searchParams.get('location') || 'AIBD_DAKAR';
  const defaultReturnLocation = searchParams.get('returnLocation') || defaultLocation;

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnTime, setReturnTime] = useState('10:00');
  const [pickupLocation, setPickupLocation] = useState(defaultLocation);
  const [returnLocation, setReturnLocation] = useState(defaultReturnLocation);
  const [isDifferentReturn, setIsDifferentReturn] = useState(defaultLocation !== defaultReturnLocation);

  const availableOptions: BookingOption[] = [
    {
      code: 'CHAUFFEUR_VIP',
      name: 'Service Chauffeur Privé VIP & Concierge',
      pricePerDay: 25000,
      description: 'Chauffeur d’élite agréé bilingue (FR/EN/Wolof), conduite défensive, protocole VIP et péages inclus.'
    },
    {
      code: 'FULL_INSURANCE',
      name: 'Assurance Zéro Franchise',
      pricePerDay: 5000,
      description: 'Couverture intégrale dommages & vol sans aucun reste à charge.'
    },
    {
      code: 'EXTRA_DRIVER',
      name: 'Second Conducteur Certifié',
      pricePerDay: 2500,
      description: 'Autorise un second conducteur sur le contrat officiel.'
    },
    {
      code: 'GPS_WIFI',
      name: 'Hotspot Wi-Fi 4G & GPS',
      pricePerDay: 2000,
      description: 'Connexion haut débit illimitée pour l’ensemble des passagers.'
    },
    {
      code: 'CHILD_SEAT',
      name: 'Siège Enfant Isofix',
      pricePerDay: 2000,
      description: 'Siège haute sécurité certifié aux normes internationales.'
    }
  ];

  const [selectedOptionCodes, setSelectedOptionCodes] = useState<string[]>(['FULL_INSURANCE']);

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.getVehicleById(id)
        .then(data => setVehicle(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="h-96 rounded-3xl bg-slate-900/30 animate-pulse border border-white/[0.05]" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Véhicule introuvable</h2>
        <button onClick={() => navigate('/vehicules')} className="btn-luxe-primary px-5 py-2 rounded-xl text-xs font-bold">
          Retour au catalogue
        </button>
      </div>
    );
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const durationDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const effectiveReturnLocation = isDifferentReturn ? returnLocation : pickupLocation;
  const oneWayFee = calculateOneWayFee(pickupLocation, effectiveReturnLocation);

  const subtotal = vehicle.pricePerDay * durationDays;
  const chosenOptions = availableOptions.filter(o => selectedOptionCodes.includes(o.code));
  const optionsTotal = chosenOptions.reduce((sum, opt) => sum + (opt.pricePerDay * durationDays), 0);
  const totalAmount = subtotal + optionsTotal + oneWayFee;

  const toggleOption = (code: string) => {
    setSelectedOptionCodes(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleBooking = () => {
    addToCart(
      vehicle,
      startDate,
      endDate,
      chosenOptions,
      pickupLocation,
      effectiveReturnLocation,
      pickupTime,
      returnTime
    );
    navigate('/panier');
  };

  const parsedFeatures: string[] = vehicle.features 
    ? (typeof vehicle.features === 'string' ? JSON.parse(vehicle.features) : vehicle.features)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[11px] text-slate-400 uppercase tracking-wider">
        <button onClick={() => navigate('/')} className="hover:text-white">Accueil</button>
        <span>/</span>
        <button onClick={() => navigate('/vehicules')} className="hover:text-white">Flotte</button>
        <span>/</span>
        <span className="text-[#D8C59A] font-bold">{vehicle.brand} {vehicle.model}</span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Main Photo Prestige */}
          <div className="relative rounded-3xl overflow-hidden bg-[#07090E] border border-white/[0.08] h-80 sm:h-[460px] shadow-2xl">
            <img
              src={vehicle.imageUrl}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-black/70 backdrop-blur-md text-[#D8C59A] border border-white/[0.08]">
                {vehicle.category?.name}
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 backdrop-blur-md">
                {vehicle.status === 'AVAILABLE' ? 'Disponible' : vehicle.status}
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#D8C59A] font-bold">{vehicle.brand}</p>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {vehicle.model} <span className="text-base text-slate-500 font-normal">({vehicle.year})</span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              {vehicle.description}
            </p>
          </div>

          {/* Specs Grid Luxe */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#0C1019]/90 border border-white/[0.06] text-center">
              <Gauge className="w-4 h-4 text-[#D8C59A] mx-auto mb-1.5" />
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Transmission</p>
              <p className="text-xs font-bold text-white mt-0.5">{vehicle.transmission === 'AUTOMATIC' ? 'Automatique' : 'Manuelle'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0C1019]/90 border border-white/[0.06] text-center">
              <Fuel className="w-4 h-4 text-[#D8C59A] mx-auto mb-1.5" />
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Motorisation</p>
              <p className="text-xs font-bold text-white mt-0.5">{vehicle.fuel === 'GASOLINE' ? 'Essence' : vehicle.fuel === 'HYBRID' ? 'Hybride' : 'Diesel'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0C1019]/90 border border-white/[0.06] text-center">
              <Users className="w-4 h-4 text-[#D8C59A] mx-auto mb-1.5" />
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Capacité</p>
              <p className="text-xs font-bold text-white mt-0.5">{vehicle.seats} Passagers</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0C1019]/90 border border-white/[0.06] text-center">
              <Wind className="w-4 h-4 text-[#D8C59A] mx-auto mb-1.5" />
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Climatisation</p>
              <p className="text-xs font-bold text-white mt-0.5">Automatique</p>
            </div>
          </div>

          {/* Features */}
          {parsedFeatures.length > 0 && (
            <div className="rounded-3xl p-6 bg-[#0C1019]/90 border border-white/[0.06] space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Équipements & Confort</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                {parsedFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D8C59A] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conditions & Caution */}
          <div className="rounded-3xl p-6 bg-[#0C1019]/90 border border-white/[0.06] space-y-3 text-xs text-slate-300">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D8C59A]" />
              Conditions Contractuelles & Cautionnement
            </h3>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                <span>Âge minimum requis :</span>
                <strong className="text-white font-semibold">21 ans révolus</strong>
              </li>
              <li className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                <span>Ancienneté permis de conduire :</span>
                <strong className="text-white font-semibold">2 ans minimum</strong>
              </li>
              <li className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                <span>Kilométrage contractuel :</span>
                <strong className="text-emerald-400 font-semibold">{vehicle.mileagePolicy}</strong>
              </li>
              <li className="flex items-center justify-between py-1.5">
                <span>Caution de garantie (bloquée) :</span>
                <strong className="text-[#D8C59A] font-bold">{vehicle.deposit.toLocaleString('fr-FR')} FCFA</strong>
              </li>
            </ul>
          </div>

        </div>

        {/* Right Column: Dynamic Price Engine (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 rounded-3xl p-6 sm:p-8 bg-[#0C1019]/95 border border-white/[0.08] shadow-2xl space-y-6">
            
            {/* Price Header */}
            <div className="flex items-end justify-between pb-4 border-b border-white/[0.06]">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Tarif Journalier</p>
                <p className="text-3xl font-black text-white">
                  {vehicle.pricePerDay.toLocaleString('fr-FR')}{' '}
                  <span className="text-xs font-bold text-[#D8C59A]">FCFA</span>
                </p>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.04] text-slate-300 font-bold border border-white/[0.08] uppercase">
                TTC Inclus
              </span>
            </div>

            {/* Date Selectors */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-[#07090E] rounded-xl p-3 border border-white/[0.06]">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Date Départ
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                  />
                </div>
                <div className="bg-[#07090E] rounded-xl p-3 border border-white/[0.06]">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Date Retour
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Agency Prise en Charge */}
              <div className="bg-[#07090E] rounded-xl p-3 border border-white/[0.06]">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Agence Prise en Charge
                </label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
                >
                  {SENEGAL_HUBS.map((hub) => (
                    <option key={hub.id} value={hub.id} className="bg-[#07090E] text-white">
                      {hub.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Toggle Aller-Simple One-Way */}
              <div className="flex items-center justify-between px-1 py-1">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={isDifferentReturn}
                    onChange={(e) => setIsDifferentReturn(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-white/20 bg-black/40 text-[#B89B5F] focus:ring-[#B89B5F] accent-[#B89B5F]"
                  />
                  <span className="text-[11px] font-semibold">Restituer dans une autre agence</span>
                </label>
                {isDifferentReturn && (
                  <span className="text-[9px] text-[#D8C59A] font-bold uppercase">Aller-Simple</span>
                )}
              </div>

              {/* Agency Restitution (si One-Way) */}
              {isDifferentReturn && (
                <div className="bg-[#07090E] rounded-xl p-3 border border-[#B89B5F]/30 animate-fade-in">
                  <label className="text-[9px] font-bold text-[#D8C59A] uppercase tracking-widest block mb-1">
                    Agence Restitution
                  </label>
                  <select
                    value={returnLocation}
                    onChange={(e) => setReturnLocation(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
                  >
                    {SENEGAL_HUBS.map((hub) => (
                      <option key={hub.id} value={hub.id} className="bg-[#07090E] text-white">
                        {hub.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Options Selection */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                Options Additionnelles & Services VIP
              </p>
              <div className="space-y-2">
                {availableOptions.map((opt) => {
                  const isChecked = selectedOptionCodes.includes(opt.code);
                  return (
                    <div
                      key={opt.code}
                      onClick={() => toggleOption(opt.code)}
                      className={`p-3 rounded-2xl border text-xs cursor-pointer transition flex items-start justify-between gap-3 ${
                        isChecked
                          ? 'bg-[#B89B5F]/10 border-[#B89B5F]/40 text-white'
                          : 'bg-[#07090E]/60 border-white/[0.05] text-slate-400 hover:border-white/[0.1]'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 accent-[#B89B5F] cursor-pointer"
                        />
                        <div>
                          <p className="font-bold text-white text-xs">{opt.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{opt.description}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#D8C59A] whitespace-nowrap text-xs">
                        +{opt.pricePerDay.toLocaleString('fr-FR')} F/j
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Calculation Breakdown */}
            <div className="bg-[#07090E] rounded-2xl p-4 border border-white/[0.06] space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Location ({durationDays} j × {vehicle.pricePerDay.toLocaleString('fr-FR')} F) :</span>
                <span className="text-white font-semibold">{subtotal.toLocaleString('fr-FR')} FCFA</span>
              </div>

              {optionsTotal > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>Options souscrites ({chosenOptions.length}) :</span>
                  <span className="text-[#D8C59A] font-semibold">+{optionsTotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
              )}

              {oneWayFee > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span className="text-[#D8C59A]">Frais de relocalisation aller-simple :</span>
                  <span className="text-[#D8C59A] font-semibold">+{oneWayFee.toLocaleString('fr-FR')} FCFA</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>Caution de garantie (bloquée) :</span>
                <span className="text-slate-300 font-medium">{vehicle.deposit.toLocaleString('fr-FR')} FCFA</span>
              </div>

              <div className="border-t border-white/[0.06] pt-3 flex justify-between items-center text-sm">
                <span className="font-bold text-white">Montant Total à régler :</span>
                <span className="text-xl font-black text-[#D8C59A]">
                  {totalAmount.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleBooking}
              className="btn-luxe-primary w-full py-4 rounded-2xl text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2"
            >
              <span>Réserver ce véhicule</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>

            <p className="text-[10px] text-center text-slate-500">
              Paiement instantané Wave, Orange Money ou Carte. Aucun débit avant confirmation finale.
            </p>

          </div>
        </div>

      </div>

    </div>
  );
};
