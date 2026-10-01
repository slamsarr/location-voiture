import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Car, 
  Camera, 
  Gauge, 
  Fuel, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  MapPin,
  ArrowRight
} from 'lucide-react';

export const AdminInspectionV2Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CHECK_IN' | 'CHECK_OUT'>('CHECK_IN');
  const [mileage, setMileage] = useState(42150);
  const [fuelLevel, setFuelLevel] = useState(100);

  const [damages, setDamages] = useState([
    { id: 1, part: 'Pare-chocs avant droit', severity: 'Léger', note: 'Micro-rayure de surface 3cm' },
    { id: 2, part: 'Aile arrière gauche', severity: 'Mineur', note: 'Léger impact gravillon' }
  ]);

  return (
    <div className="space-y-8">
      
      {/* Title & V2 Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-white">Inspection Numérique du Véhicule</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              V2 PREVIEW
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Vision future de l'état des lieux numérique assisté par photos et cartographie des dommages.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('CHECK_IN')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'CHECK_IN'
                ? 'bg-brand-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Avant Location (Départ)
          </button>
          <button
            onClick={() => setActiveTab('CHECK_OUT')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'CHECK_OUT'
                ? 'bg-brand-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Après Location (Retour)
          </button>
        </div>
      </div>

      {/* Vehicle Info Header */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=600"
            alt="Toyota Prado"
            className="w-24 h-16 object-cover rounded-2xl border border-slate-800"
          />
          <div>
            <p className="text-[10px] font-bold text-amber-400 uppercase">Véhicule inspecté</p>
            <h3 className="text-lg font-black text-white">Toyota Land Cruiser Prado TX-L</h3>
            <p className="text-xs text-slate-400">Immatriculation : DK-2024-HZ09 • Contrat HZ-2026-001004</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div className="text-center sm:text-right">
            <p className="text-slate-400">Locataire assigné</p>
            <p className="font-extrabold text-white">Moussa Ba</p>
          </div>
          <span className="h-8 w-px bg-slate-800 hidden sm:block" />
          <div className="text-center sm:text-right">
            <p className="text-slate-400">Agent Inspecteur</p>
            <p className="font-extrabold text-brand-400">M. Seck (AIBD)</p>
          </div>
        </div>
      </div>

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Interactive Vehicle Schematic & Damage pins (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Car className="w-4 h-4 text-brand-400" />
                Cartographie 2D de la Carrosserie
              </h3>
              <span className="text-[11px] text-slate-400">2 points d'impact relevés</span>
            </div>

            {/* Interactive schematic representation */}
            <div className="relative bg-slate-950 rounded-2xl p-6 border border-slate-800 flex items-center justify-center min-h-[300px]">
              
              {/* Vehicle vector wireframe outline */}
              <svg viewBox="0 0 500 240" className="w-full max-w-md stroke-slate-700 fill-slate-900/50 stroke-2">
                {/* Car body outline */}
                <rect x="70" y="40" width="360" height="160" rx="40" />
                {/* Windshield */}
                <path d="M 160 50 L 200 80 L 200 160 L 160 190 Z" fill="#1e293b" />
                {/* Rear windshield */}
                <path d="M 370 50 L 340 80 L 340 160 L 370 190 Z" fill="#1e293b" />
                {/* Roof */}
                <rect x="200" y="80" width="140" height="80" fill="#0f172a" />
                {/* Wheels */}
                <rect x="110" y="20" width="60" height="20" rx="6" fill="#475569" />
                <rect x="330" y="20" width="60" height="20" rx="6" fill="#475569" />
                <rect x="110" y="200" width="60" height="20" rx="6" fill="#475569" />
                <rect x="330" y="200" width="60" height="20" rx="6" fill="#475569" />
              </svg>

              {/* Pin 1 : Pare-chocs avant */}
              <div 
                className="absolute left-[20%] top-[45%] group cursor-pointer"
                title="Rayure pare-chocs"
              >
                <span className="w-6 h-6 rounded-full bg-amber-500 text-black font-black text-xs flex items-center justify-center shadow-lg shadow-amber-500/50 animate-pulse">
                  1
                </span>
              </div>

              {/* Pin 2 : Aile arrière */}
              <div 
                className="absolute right-[22%] bottom-[35%] group cursor-pointer"
                title="Impact gravillon"
              >
                <span className="w-6 h-6 rounded-full bg-amber-500 text-black font-black text-xs flex items-center justify-center shadow-lg shadow-amber-500/50 animate-pulse">
                  2
                </span>
              </div>

            </div>

            {/* Damage list */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Registre des dommages constatés
              </h4>
              {damages.map((d) => (
                <div key={d.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-black flex items-center justify-center text-[10px]">
                      {d.id}
                    </span>
                    <div>
                      <p className="font-extrabold text-white">{d.part}</p>
                      <p className="text-[10px] text-slate-400">{d.note}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {d.severity}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Right: Mileage, Fuel & Photo inspection checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Counters */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-6">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Relevés Compteur & Fluides
            </h3>

            {/* Kilométrage */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                  <Gauge className="w-4 h-4 text-brand-400" />
                  Index Kilométrique
                </span>
                <span className="font-black text-white font-mono text-sm">{mileage} km</span>
              </div>
              <input
                type="number"
                value={mileage}
                onChange={(e) => setMileage(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
              />
            </div>

            {/* Carburant */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                  <Fuel className="w-4 h-4 text-brand-400" />
                  Niveau Carburant
                </span>
                <span className="font-black text-amber-400">{fuelLevel}% (Plein)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={fuelLevel}
                onChange={(e) => setFuelLevel(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Photos checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-brand-400" />
                  Photos Certifiées
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">4 / 4 conformes</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {['Face Avant', 'Côté Droit', 'Côté Gauche', 'Arrière'].map((angle, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-2 text-center group">
                    <img
                      src="https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=400"
                      alt={angle}
                      className="w-full h-16 object-cover rounded-lg opacity-80"
                    />
                    <p className="text-[10px] font-bold text-white mt-1">{angle}</p>
                    <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[10px] font-black">
                      ✓
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => alert('État des lieux V2 enregistré avec horodatage blockchain.')}
              className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs shadow-md transition"
            >
              Signer & Valider l'État des Lieux
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
