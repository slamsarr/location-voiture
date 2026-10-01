import React, { useEffect, useState } from 'react';
import { CreditCard, CheckCircle2, XCircle, Clock, Search, Filter } from 'lucide-react';
import { api } from '../../services/api';

export const AdminPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    api.getAllPayments(statusFilter !== 'all' ? statusFilter : undefined)
      .then(res => setPayments(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const getMethodBadge = (m: string) => {
    switch (m) {
      case 'WAVE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-500/20 text-sky-400 border border-sky-500/30">WAVE</span>;
      case 'ORANGE_MONEY':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-500/20 text-orange-400 border border-orange-500/30">ORANGE MONEY</span>;
      case 'CARD':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">CARTE CB</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">INTOUCH</span>;
    }
  };

  const getStatusBadge = (s: string) => {
    if (s === 'SUCCESS') {
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">CONFIRMÉ</span>;
    }
    if (s === 'FAILED') {
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">ÉCHOUÉ</span>;
    }
    return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">EN ATTENTE</span>;
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Suivi des Règlements & Encaissements</h1>
          <p className="text-xs text-slate-400">
            Journal d'audit des transactions monétaires via MockPaymentProvider / Wave / OM
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none cursor-pointer"
          >
            <option value="all">Tous les états</option>
            <option value="SUCCESS">Confirmé (Succès)</option>
            <option value="PENDING">En attente</option>
            <option value="FAILED">Échoué</option>
          </select>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Référence</th>
                <th className="p-4">Réservation</th>
                <th className="p-4">Client</th>
                <th className="p-4">Méthode</th>
                <th className="p-4">Montant</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Chargement des paiements...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Aucune transaction trouvée.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/50 transition">
                    <td className="p-4 font-mono font-bold text-brand-400">
                      {p.reference}
                    </td>
                    <td className="p-4 font-mono text-slate-300">
                      {p.reservation?.reference}
                    </td>
                    <td className="p-4 font-semibold text-white">
                      {p.reservation?.customer?.firstName} {p.reservation?.customer?.lastName}
                    </td>
                    <td className="p-4">
                      {getMethodBadge(p.method)}
                    </td>
                    <td className="p-4 font-black text-white whitespace-nowrap">
                      {p.amount.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="p-4">
                      {getStatusBadge(p.status)}
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
