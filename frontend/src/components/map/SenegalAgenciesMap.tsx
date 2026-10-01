import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Car, 
  ArrowRight, 
  Sparkles,
  Compass,
  CheckCircle2,
  Navigation
} from 'lucide-react';

export interface SenegalHub {
  id: string;
  name: string;
  region: string;
  coords: { x: number; y: number }; // Coordinates on custom SVG map (viewBox 0 0 800 560)
  address: string;
  phone: string;
  hours: string;
  availableFleetCount: number;
  highlight: string;
  recommendedTypes: string[];
  perk: string;
  popularModels: { name: string; category: string; price: number; image: string }[];
}

export const SENEGAL_HUBS: SenegalHub[] = [
  {
    id: 'AIBD_DAKAR',
    name: 'Dakar & Aéroport Blaise Diagne (AIBD)',
    region: 'Région de Dakar',
    coords: { x: 125, y: 265 },
    address: 'Terminal Passagers Arrivées VIP, Diass & Boulevard de la République, Dakar Plateau',
    phone: '+221 33 800 00 00 / +221 77 123 45 67',
    hours: 'Ouvert 24h/24 • 7j/7 (Permanence vols de nuit)',
    availableFleetCount: 12,
    highlight: 'Hub Principal & Réception VIP Express',
    recommendedTypes: ['Berlines Prestige', 'Citadines Urbaines', 'SUV d\'Affaires'],
    perk: 'Accueil nominatif pancarte au terminal des vols internationaux et remise de clés en 3 min chrono.',
    popularModels: [
      { name: 'Mercedes-Benz Classe C', category: 'Prestige', price: 95000, image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=400' },
      { name: 'Toyota Corolla Hybride', category: 'Compacte', price: 35000, image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=400' },
      { name: 'Toyota Land Cruiser Prado', category: '4x4 VIP', price: 130000, image: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: 'SALY_MBOUR',
    name: 'Saly Portudal & Petite Côte',
    region: 'Petite Côte / Mbour',
    coords: { x: 155, y: 315 },
    address: 'Route des Hôtels & Résidences Balnéaires, Saly Portudal',
    phone: '+221 33 957 00 00',
    hours: '08:00 - 20:00 (Livraison hôtelière 24/7)',
    availableFleetCount: 8,
    highlight: 'Détente, Tourisme & Escapades Plage',
    recommendedTypes: ['SUV Confort', 'Crossovers Familiaux', 'Cabriolets & 4x4'],
    perk: 'Livraison gratuite directement à votre villa ou au lobby de votre hôtel (Rhino Resort, Lamantin, etc.).',
    popularModels: [
      { name: 'Toyota RAV4 AWD', category: 'SUV All-Road', price: 55000, image: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?auto=format&fit=crop&q=80&w=400' },
      { name: 'Peugeot 3008 Allure', category: 'SUV Urbain', price: 48000, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: 'SAINT_LOUIS',
    name: 'Saint-Louis (Ndar)',
    region: 'Région Nord / Fleuve Sénégal',
    coords: { x: 175, y: 115 },
    address: 'Île de Saint-Louis, Rue Blaise Diagne (Face Pont Faidherbe)',
    phone: '+221 33 961 00 00',
    hours: '08:30 - 19:30',
    availableFleetCount: 6,
    highlight: 'Patrimoine Historique, Djoudj & Affaires',
    recommendedTypes: ['Berlines Routières', 'SUV Robustes'],
    perk: 'Véhicules rodés pour l’axe Dakar - Saint-Louis (RN2) avec option chauffeur-guide sur demande.',
    popularModels: [
      { name: 'Hyundai Tucson N-Line', category: 'SUV Routier', price: 50000, image: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&q=80&w=400' },
      { name: 'Renault Duster 4x4', category: 'Tout-Chemin', price: 38000, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: 'CAP_SKIRRING',
    name: 'Cap Skirring & Ziguinchor',
    region: 'Casamance Naturelle',
    coords: { x: 135, y: 495 },
    address: 'Aéroport de Cap Skirring & Boulevard Maritime, Ziguinchor',
    phone: '+221 33 991 00 00',
    hours: '08:00 - 19:00 (Synchronisé vols Transair & Air Sénégal)',
    availableFleetCount: 5,
    highlight: 'Écotourisme, Pistes Sauvages & Plages Tropicales',
    recommendedTypes: ['Tout-Terrain 4x4 Purs', 'Pick-up Double Cabine'],
    perk: 'Assurance pistes de Casamance incluse et garde au sol surélevée pour franchissement de bolongs.',
    popularModels: [
      { name: 'Toyota Hilux 4x4 Double Cabine', category: 'Pick-up Robuste', price: 45000, image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=400' },
      { name: 'Toyota Land Cruiser Prado', category: '4x4 Expédition', price: 130000, image: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: 'THIES',
    name: 'Thiès & Diamniadio',
    region: 'Pôle Économique & Ministériel',
    coords: { x: 170, y: 250 },
    address: 'Avenue Léopold S. Senghor & Pôle Urbain de Diamniadio',
    phone: '+221 33 951 00 00',
    hours: '08:00 - 20:00',
    availableFleetCount: 7,
    highlight: 'Carrefour Central & Déplacements Institutionnels',
    recommendedTypes: ['Berlines Confort', 'Utilitaires Professionnels'],
    perk: 'Mise à disposition rapide pour les délégations ministérielles et les sièges d’entreprises à Diamniadio.',
    popularModels: [
      { name: 'Mercedes-Benz Classe E 300', category: 'Grande Berline', price: 110000, image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400' },
      { name: 'Toyota Hilux Double Cabine', category: 'Utilitaire Pro', price: 45000, image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: 'TOUBA',
    name: 'Touba & Diourbel',
    region: 'Grand Bassin Commercial du Baol',
    coords: { x: 260, y: 245 },
    address: 'Axe Central Mbacké - Touba Mosquée',
    phone: '+221 33 976 00 00',
    hours: '08:00 - 19:30',
    availableFleetCount: 6,
    highlight: 'Missions Économiques, Événements & Affaires',
    recommendedTypes: ['SUV Spacieux 7 Places', 'Berlines Climatisées'],
    perk: 'Forfaits spéciaux événements et haute insonorisation avec double climatisation renforcée.',
    popularModels: [
      { name: 'Kia Sportage GT-Line', category: 'SUV Confort', price: 52000, image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=400' },
      { name: 'Toyota Land Cruiser Prado (7 places)', category: 'Prestige 7 Places', price: 130000, image: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=400' }
    ]
  }
];

export const ONE_WAY_FEES: Record<string, Record<string, number>> = {
  AIBD_DAKAR: {
    SALY_MBOUR: 15000,
    THIES_DIAMNIADIO: 10000,
    SAINT_LOUIS: 45000,
    TOUBA_MOUKADAMA: 35000,
    CAP_SKIRRING: 85000,
  },
  SALY_MBOUR: {
    AIBD_DAKAR: 15000,
    THIES_DIAMNIADIO: 15000,
    SAINT_LOUIS: 50000,
    TOUBA_MOUKADAMA: 35000,
    CAP_SKIRRING: 80000,
  },
  THIES_DIAMNIADIO: {
    AIBD_DAKAR: 10000,
    SALY_MBOUR: 15000,
    SAINT_LOUIS: 40000,
    TOUBA_MOUKADAMA: 30000,
    CAP_SKIRRING: 85000,
  },
  SAINT_LOUIS: {
    AIBD_DAKAR: 45000,
    SALY_MBOUR: 50000,
    THIES_DIAMNIADIO: 40000,
    TOUBA_MOUKADAMA: 40000,
    CAP_SKIRRING: 110000,
  },
  TOUBA_MOUKADAMA: {
    AIBD_DAKAR: 35000,
    SALY_MBOUR: 35000,
    THIES_DIAMNIADIO: 30000,
    SAINT_LOUIS: 40000,
    CAP_SKIRRING: 95000,
  },
  CAP_SKIRRING: {
    AIBD_DAKAR: 85000,
    SALY_MBOUR: 80000,
    THIES_DIAMNIADIO: 85000,
    SAINT_LOUIS: 110000,
    TOUBA_MOUKADAMA: 95000,
  },
};

export function calculateOneWayFee(pickup?: string, returnLoc?: string): number {
  if (!pickup || !returnLoc || pickup === returnLoc) return 0;
  const findKey = (val: string) => {
    const v = val.toUpperCase();
    if (v.includes('AIBD') || v.includes('DAKAR')) return 'AIBD_DAKAR';
    if (v.includes('SALY') || v.includes('MBOUR')) return 'SALY_MBOUR';
    if (v.includes('SAINT') || v.includes('LOUIS')) return 'SAINT_LOUIS';
    if (v.includes('THIES') || v.includes('DIAMNIADIO')) return 'THIES_DIAMNIADIO';
    if (v.includes('TOUBA') || v.includes('DIOURBEL')) return 'TOUBA_MOUKADAMA';
    if (v.includes('CAP') || v.includes('ZIGUINCHOR') || v.includes('CASAMANCE')) return 'CAP_SKIRRING';
    return v;
  };
  const pKey = findKey(pickup);
  const rKey = findKey(returnLoc);
  if (pKey === rKey) return 0;
  if (ONE_WAY_FEES[pKey] && ONE_WAY_FEES[pKey][rKey]) {
    return ONE_WAY_FEES[pKey][rKey];
  }
  return 20000;
}

export const SenegalAgenciesMap: React.FC = () => {
  const [selectedHubId, setSelectedHubId] = useState<string>('AIBD_DAKAR');
  const navigate = useNavigate();

  const activeHub = SENEGAL_HUBS.find(h => h.id === selectedHubId) || SENEGAL_HUBS[0];

  const handleSelectAgencyAndBook = (hub: SenegalHub) => {
    navigate(`/vehicules?location=${encodeURIComponent(hub.name)}`);
  };

  return (
    <div className="space-y-8">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold text-[#D8C59A] uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
              Réseau National Hertz Digital Sénégal
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Carte Interactive des Agences & Personnalisation Régionale
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Cliquez sur un pôle territorial du Sénégal pour découvrir la flotte disponible, les conditions de remise des clés et les recommandations spécifiques au terrain.
          </p>
        </div>

        {/* Quick city selector pills */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-[#0F1420] border border-white/[0.06] self-start md:self-auto">
          {SENEGAL_HUBS.map((hub) => (
            <button
              key={hub.id}
              onClick={() => setSelectedHubId(hub.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedHubId === hub.id
                  ? 'bg-[#B89B5F] text-black font-extrabold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {hub.name.split('&')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Vector Map + Dynamic Regional Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: SENEGAL MAP SVG LUXE (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl p-6 bg-[#0B0E17]/95 border border-white/[0.08] shadow-2xl relative overflow-hidden flex flex-col justify-between">
          
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#D8C59A]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Cartographie Territoriale • République du Sénégal
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              6 Pôles Opérationnels Actifs
            </span>
          </div>

          {/* SVG Canvas Map of Senegal */}
          <div className="relative w-full aspect-[4/3] bg-[#07090E] rounded-2xl border border-white/[0.05] p-2 flex items-center justify-center overflow-hidden">
            
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
            
            {/* Senegal stylized geo SVG map */}
            <svg
              viewBox="0 0 800 560"
              className="w-full h-full select-none"
              style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.8))' }}
            >
              <defs>
                {/* Gold glow for active marker */}
                <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                
                {/* Landmass gradient */}
                <linearGradient id="senegalLandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#141B2B" />
                  <stop offset="50%" stopColor="#101522" />
                  <stop offset="100%" stopColor="#0B0F1A" />
                </linearGradient>
              </defs>

              {/* Ocean / Atlantic ocean representation */}
              <text x="30" y="200" fill="#2A354E" fontSize="11" fontFamily="sans-serif" letterSpacing="4" opacity="0.6">
                OCÉAN ATLANTIQUE
              </text>

              {/* Senegal Stylized Polygon Boundary */}
              {/* Encompasses: Saint-Louis -> Podor -> Matam -> Bakel -> Kedougou -> Tamba -> Casamance -> Mbour -> Dakar */}
              <path
                d="M 175 110 
                   Q 280 60, 420 85 
                   L 560 140 
                   Q 660 210, 710 320 
                   L 660 480 
                   L 580 520 
                   L 440 450 
                   L 360 440 
                   L 300 480 
                   L 130 540 
                   L 120 480 
                   L 200 450 
                   L 220 370 
                   L 155 330 
                   L 100 270 
                   L 130 250 
                   L 175 110 Z"
                fill="url(#senegalLandGradient)"
                stroke="#B89B5F"
                strokeWidth="1.5"
                strokeOpacity="0.4"
                className="transition-colors duration-500 hover:stroke-[#D8C59A]"
              />

              {/* Gambia River indentation aesthetic outline */}
              <path
                d="M 140 370 Q 230 375, 340 375 L 340 405 Q 230 405, 140 400 Z"
                fill="#07090E"
                stroke="#ffffff"
                strokeOpacity="0.08"
                strokeWidth="1"
              />
              <text x="210" y="393" fill="#4B556D" fontSize="9" fontFamily="sans-serif" letterSpacing="2">
                GAMBIE
              </text>

              {/* Major Roads / Axes Inter-régions (RN1, RN2, Autoroute Ila Touba, Autoroute AIBD) */}
              <path d="M 125 265 L 175 110" stroke="#B89B5F" strokeWidth="1" strokeDasharray="3 3" opacity="0.25" />
              <path d="M 125 265 L 155 315" stroke="#B89B5F" strokeWidth="1.5" opacity="0.4" />
              <path d="M 125 265 L 170 250 L 260 245" stroke="#B89B5F" strokeWidth="1.5" opacity="0.4" />
              <path d="M 155 315 Q 260 380, 500 390" stroke="#B89B5F" strokeWidth="1" strokeDasharray="3 3" opacity="0.2" />
              <path d="M 125 265 Q 110 390, 135 495" stroke="#B89B5F" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />

              {/* Region Label Watermarks */}
              <text x="210" y="160" fill="#3D4B66" fontSize="10" fontWeight="bold" opacity="0.5">FLEUVE / NORD</text>
              <text x="280" y="320" fill="#3D4B66" fontSize="10" fontWeight="bold" opacity="0.5">BASSIN DU BAOL</text>
              <text x="440" y="410" fill="#3D4B66" fontSize="10" fontWeight="bold" opacity="0.4">SÉNÉGAL ORIENTAL</text>
              <text x="200" y="520" fill="#3D4B66" fontSize="10" fontWeight="bold" opacity="0.5">CASAMANCE</text>

              {/* Interactive City Hub Pins */}
              {SENEGAL_HUBS.map((hub) => {
                const isSelected = hub.id === selectedHubId;
                return (
                  <g
                    key={hub.id}
                    onClick={() => setSelectedHubId(hub.id)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing ring for active pin */}
                    {isSelected && (
                      <circle
                        cx={hub.coords.x}
                        cy={hub.coords.y}
                        r="22"
                        fill="#B89B5F"
                        opacity="0.18"
                        className="animate-ping"
                      />
                    )}

                    {/* Pin Outer circle */}
                    <circle
                      cx={hub.coords.x}
                      cy={hub.coords.y}
                      r={isSelected ? 10 : 6}
                      fill={isSelected ? '#B89B5F' : '#0B0E17'}
                      stroke={isSelected ? '#FFFFFF' : '#B89B5F'}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      filter={isSelected ? 'url(#goldGlow)' : undefined}
                      className="transition-all duration-300"
                    />

                    {/* Pin Inner core */}
                    <circle
                      cx={hub.coords.x}
                      cy={hub.coords.y}
                      r={isSelected ? 3.5 : 2}
                      fill={isSelected ? '#000000' : '#D8C59A'}
                    />

                    {/* City Label */}
                    <text
                      x={hub.coords.x + 14}
                      y={hub.coords.y + 4}
                      fill={isSelected ? '#FFFFFF' : '#94A3B8'}
                      fontSize={isSelected ? '12' : '10'}
                      fontWeight={isSelected ? 'bold' : '600'}
                      fontFamily="sans-serif"
                      className="transition-colors group-hover:fill-[#D8C59A]"
                    >
                      {hub.name.split('&')[0].trim()}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Quick legend on the map */}
            <div className="absolute bottom-3 left-4 p-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/[0.08] text-[9px] text-slate-300 flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B89B5F] shadow-sm shadow-gold-500/50" />
                Agence officielle Hertz
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-0.5 bg-[#B89B5F] opacity-50" />
                Axes autoroutiers & liaisons
              </span>
            </div>

          </div>

          <p className="text-[10px] text-slate-400 pt-3">
            💡 Astuce : Cliquez sur n'importe quel repère sur la carte pour charger le profil régional et les véhicules les plus recommandés.
          </p>

        </div>

        {/* RIGHT: DYNAMIC REGIONAL DOSSIER & CUSTOMIZATION (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl p-6 sm:p-7 bg-[#0C1019]/95 border border-white/[0.08] shadow-2xl space-y-6">
            
            {/* Header Hub info */}
            <div className="space-y-2 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#D8C59A] uppercase tracking-widest">
                  {activeHub.region}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B89B5F]/15 text-[#D8C59A] border border-[#B89B5F]/30 font-bold">
                  {activeHub.availableFleetCount} véhicules sur place
                </span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">
                {activeHub.name}
              </h3>
              <p className="text-xs text-amber-200/80 font-medium">
                ★ {activeHub.highlight}
              </p>
            </div>

            {/* Key Agency Details */}
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 text-slate-300">
                <MapPin className="w-4 h-4 text-[#D8C59A] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{activeHub.address}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Clock className="w-4 h-4 text-[#D8C59A] shrink-0" />
                <span>{activeHub.hours}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-4 h-4 text-[#D8C59A] shrink-0" />
                <span className="font-mono text-[11px]">{activeHub.phone}</span>
              </div>
            </div>

            {/* Local Specific Perk (Personnalisation Territoire) */}
            <div className="p-4 rounded-2xl bg-[#07090E] border border-[#B89B5F]/20 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#D8C59A] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Avantage Exclusif Hertz {activeHub.name.split('&')[0].trim()}
              </p>
              <p className="text-xs text-slate-200 leading-relaxed">
                {activeHub.perk}
              </p>
            </div>

            {/* Recommended Vehicle Types for this city */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Motorisations & Gabarits Conseillés pour ce Territoire
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeHub.recommendedTypes.map((type, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-white/[0.04] text-slate-200 border border-white/[0.08] text-[10px] font-semibold"
                  >
                    ✓ {type}
                  </span>
                ))}
              </div>
            </div>

            {/* Popular models for this city */}
            <div className="space-y-2.5 pt-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Modèles Phares dans cette Agence
              </p>
              <div className="space-y-2">
                {activeHub.popularModels.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-[#07090E]/60 border border-white/[0.05] text-xs hover:border-white/[0.1] transition"
                  >
                    <div className="flex items-center gap-3">
                      <img src={m.image} alt={m.name} className="w-12 h-9 object-cover rounded-lg" />
                      <div>
                        <p className="font-bold text-white text-xs">{m.name}</p>
                        <p className="text-[10px] text-slate-400">{m.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#D8C59A]">{m.price.toLocaleString('fr-FR')} F</p>
                      <p className="text-[9px] text-slate-500">/ jour</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Book for this city */}
            <button
              onClick={() => handleSelectAgencyAndBook(activeHub)}
              className="btn-luxe-primary w-full py-3.5 rounded-2xl text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2"
            >
              <span>Réserver à {activeHub.name.split('&')[0].trim()}</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};
