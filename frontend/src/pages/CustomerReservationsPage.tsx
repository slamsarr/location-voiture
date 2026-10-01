import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Car, 
  FileText, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Eye,
  User
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../store/useAuthStore';
import { Reservation } from '../types';

export const CustomerReservationsPage: React.FC = () => {
  const { user, loginDemo } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const customerEmail = user?.email || 'client@demo.local';

  useEffect(() => {
    setLoading(true);
    api.getCustomerReservations(customerEmail)
      .then(res => setReservations(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [customerEmail]);

  const timelineSteps = [
    { label: 'Réservation', done: true },
    { label: 'Paiement', done: true },
    { label: 'Confirmation', done: true },
    { label: 'Contrat certifié', done: true },
    { label: 'Prise en charge', done: false },
    { label: 'Retour', done: false },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-amber-600 flex items-center justify-center text-black font-extrabold shadow-lg">
            <User className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{user?.name || 'Amadou Diallo'}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Client Certifié
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {customerEmail} • Espace personnel & Suivi des réservations
            </p>
          </div>
        </div>

        <Link
          to="/vehicules"
          className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-md transition self-start sm:self-auto"
        >
          <Car className="w-4 h-4" />
          <span>Nouvelle réservation</span>
        </Link>
      </div>

      {/* Timeline explainer */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-400" />
            Parcours type d'une location dématérialisée
          </h3>
          <span className="text-[11px] text-slate-400">Suivi automatisé en temps réel</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2">
          {timelineSteps.map((st, i) => (
            <div key={i} className="flex flex-col items-center text-center p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black mb-1.5 ${
                st.done ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-500'
              }`}>
                {st.done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className="text-[11px] font-bold text-slate-200">{st.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reservations list */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-white">Vos réservations en cours & archivées</h3>

        {loading ? (
          <div className="h-64 rounded-3xl bg-slate-900/50 animate-pulse border border-slate-800" />
        ) : reservations.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-white/10 space-y-4">
            <Car className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-white">Aucune réservation pour le moment</h4>
            <p className="text-xs text-slate-400">Vos contrats et factures s'afficheront ici après votre première réservation.</p>
            <Link
              to="/vehicules"
              className="inline-block px-5 py-2.5 rounded-xl bg-brand-500 text-black font-extrabold text-xs"
            >
              Réserver un véhicule
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((res) => (
              <div
                key={res.id}
                className="glass-panel rounded-3xl p-6 border border-white/10 hover:border-brand-500/40 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Left vehicle preview */}
                <div className="flex items-center gap-4">
                  <img
                    src={res.vehicle.imageUrl}
                    alt={res.vehicle.model}
                    className="w-24 h-16 object-cover rounded-2xl border border-slate-800 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-brand-400">{res.reference}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold uppercase ${
                        res.status === 'PAID' || res.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {res.status}
                      </span>
                    </div>
                    <h4 className="text-base font-black text-white mt-1">
                      {res.vehicle.brand} {res.vehicle.model}
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      Du {res.startDate} au {res.endDate} ({res.durationDays} j)
                    </p>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-800">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Montant Réglé</p>
                    <p className="text-lg font-black text-white">
                      {res.totalAmount.toLocaleString('fr-FR')} <span className="text-xs text-brand-400">FCFA</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/contrat/${res.id}`}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <FileText className="w-4 h-4 text-brand-400" />
                      <span>Contrat</span>
                    </Link>

                    <Link
                      to={`/confirmation/${res.id}`}
                      className="p-2.5 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 text-brand-400 border border-brand-500/30 transition"
                      title="Voir le reçu"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
