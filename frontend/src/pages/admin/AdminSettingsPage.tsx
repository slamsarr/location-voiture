import React, { useState } from 'react';
import { Settings, Shield, Building, CreditCard, Save, CheckCircle2 } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [agencyName, setAgencyName] = useState('Hertz Digital Mobility S.A.S.');
  const [currency, setCurrency] = useState('FCFA');
  const [taxRate, setTaxRate] = useState(18);
  const [contactEmail, setContactEmail] = useState('reservations@hertz-digital.demo');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white">Paramètres Généraux de la Plateforme</h1>
          <p className="text-xs text-slate-400">
            Personnalisation du branding, des devises et des passerelles d'intégration
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Paramètres de l'agence mis à jour avec succès !</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Branding & Société */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-brand-400" />
            Identité de l'Agence & Facturation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase">Raison Sociale</label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-medium focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase">Devise Monétaire</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-bold focus:outline-none"
              >
                <option value="FCFA">FCFA (Franc CFA - UEMOA)</option>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase">Email Opérations</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-medium focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase">TVA Inclus (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-medium focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Passerelles de paiement */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-brand-400" />
            Passerelles de Paiement & Mode Démonstrateur
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-extrabold text-white">Mode Démonstration Actif (MockPaymentProvider)</p>
                <p className="text-[11px] text-slate-400">Simule les flux Wave, Orange Money et InTouch sans requérir de clés API marchandes de production.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs">
                ACTIF
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg transition"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer les paramètres</span>
          </button>
        </div>

      </form>

    </div>
  );
};
