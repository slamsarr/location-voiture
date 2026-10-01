import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Shield, Phone, Mail, MapPin, CheckCircle, CreditCard, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-black font-black">
                <Car className="w-6 h-6" />
              </div>
              <span className="text-xl font-extrabold text-white">HERTZ DIGITAL</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Plateforme digitale de réservation automobile de référence. Flotte récente, tarification transparente, paiement mobile instantané et génération automatique de contrat certifié.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <Shield className="w-3.5 h-3.5" /> Véhicules 100% assurés
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold border border-brand-500/20">
                <CheckCircle className="w-3.5 h-3.5" /> Support 24/7
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide mb-4 uppercase">Navigation</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="hover:text-brand-400 transition">Accueil</Link></li>
              <li><Link to="/vehicules" className="hover:text-brand-400 transition">Catalogue des véhicules</Link></li>
              <li><Link to="/mes-reservations" className="hover:text-brand-400 transition">Mes réservations</Link></li>
              <li><Link to="/faq" className="hover:text-brand-400 transition">Foire aux questions</Link></li>
              <li><Link to="/contact" className="hover:text-brand-400 transition">Assistance & Contact</Link></li>
            </ul>
          </div>

          {/* Catégories */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide mb-4 uppercase">Flotte</h4>
            <ul className="space-y-2.5">
              <li><Link to="/vehicules?category=economique" className="hover:text-brand-400 transition">Économique</Link></li>
              <li><Link to="/vehicules?category=compacte" className="hover:text-brand-400 transition">Compacte & Urbaine</Link></li>
              <li><Link to="/vehicules?category=suv" className="hover:text-brand-400 transition">SUV & 4x4 Tout-terrain</Link></li>
              <li><Link to="/vehicules?category=berline" className="hover:text-brand-400 transition">Berline Confort</Link></li>
              <li><Link to="/vehicules?category=premium" className="hover:text-brand-400 transition">Luxe & Prestige</Link></li>
            </ul>
          </div>

          {/* Contact & Agences */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide mb-4 uppercase">Agences</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Aéroport International Blaise Diagne (AIBD), Terminal Arrivées</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+221 33 800 00 00</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>contact@hertz-digital.demo</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Moyens de paiement acceptés */}
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-900">
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-slate-300 mb-2">Moyens de paiement sécurisés</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 font-black text-xs">
                WAVE
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold text-xs">
                ORANGE MONEY
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                INTOUCH / TOUCHPAY
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-semibold text-xs flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" /> VISA / MASTERCARD
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 max-w-md">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Architecture paiement sécurisée. Données sensibles protégées & simulation conforme aux exigences PCI-DSS.</span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Hertz Digital Rental Platform. Prototype fonctionnel de démonstration.</p>
          <div className="flex items-center gap-6">
            <Link to="/admin" className="text-amber-500/80 hover:text-amber-400">Accès Back-office Administrateur</Link>
            <span>Mentions légales</span>
            <span>Conditions Générales de Location (CGL)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
