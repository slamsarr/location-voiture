import React, { useEffect, useState } from 'react';
import { Users, Search, Mail, Phone, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getAllCustomers()
      .then(res => setCustomers(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Gestion de la Clientèle</h1>
          <p className="text-xs text-slate-400">
            {customers.length} conducteurs et entreprises enregistrés
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email..."
            className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-brand-500 w-64"
          />
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Client</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Permis N°</th>
                <th className="p-4 text-center">Réservations</th>
                <th className="p-4">Dépenses Totales</th>
                <th className="p-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Chargement des clients...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Aucun client trouvé.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-900/50 transition">
                    <td className="p-4">
                      <p className="font-extrabold text-white text-sm">{c.name}</p>
                      <p className="text-[10px] text-slate-500">{c.country}</p>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <p className="text-slate-300 font-semibold">{c.email}</p>
                      <p className="text-[10px] text-slate-500">{c.phone}</p>
                    </td>
                    <td className="p-4 font-mono text-slate-400">
                      {c.licenseNumber}
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-white font-extrabold text-[11px]">
                        {c.reservationsCount}
                      </span>
                    </td>
                    <td className="p-4 font-black text-amber-400">
                      {c.totalSpent.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ACTIF
                      </span>
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
