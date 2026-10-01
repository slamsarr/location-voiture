import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Eye, Download, ShieldCheck, Search } from 'lucide-react';
import { api } from '../../services/api';

export const AdminContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllContracts()
      .then(res => setContracts(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Registre des Contrats Électroniques</h1>
          <p className="text-xs text-slate-400">
            {contracts.length} contrats certifiés avec signature électronique horodatée
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">N° Contrat</th>
                <th className="p-4">Réf Réservation</th>
                <th className="p-4">Locataire</th>
                <th className="p-4">Véhicule</th>
                <th className="p-4">Date de signature</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Chargement des contrats...
                  </td>
                </tr>
              ) : contracts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Aucun contrat émis pour l'instant.
                  </td>
                </tr>
              ) : (
                contracts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-900/50 transition">
                    <td className="p-4 font-mono font-bold text-amber-400">
                      {c.reference}
                    </td>
                    <td className="p-4 font-mono text-slate-400">
                      {c.reservation?.reference}
                    </td>
                    <td className="p-4 font-bold text-white">
                      {c.reservation?.customer?.firstName} {c.reservation?.customer?.lastName}
                    </td>
                    <td className="p-4 text-slate-300">
                      {c.reservation?.vehicle?.brand} {c.reservation?.vehicle?.model}
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(c.signedAt || c.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-max">
                        <ShieldCheck className="w-3 h-3" />
                        CERTIFIÉ
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/contrat/${c.reservationId}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-brand-400 border border-slate-800 font-bold transition"
                        title="Visualiser et Télécharger PDF"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Voir PDF</span>
                      </Link>
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
