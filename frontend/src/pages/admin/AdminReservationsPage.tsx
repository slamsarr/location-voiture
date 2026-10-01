import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarCheck, 
  Search, 
  Filter, 
  Eye, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Download,
  X,
  User,
  Car
} from 'lucide-react';
import { api } from '../../services/api';
import { Reservation } from '../../types';

export const AdminReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);

  const fetchReservations = () => {
    setLoading(true);
    api.getAllReservations({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: searchQuery || undefined,
    })
      .then(res => setReservations(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReservations();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReservations();
  };

  const handleStatusChange = async (resId: string, newStatus: string) => {
    try {
      await api.updateReservationStatus(resId, newStatus);
      fetchReservations();
      if (selectedRes && selectedRes.id === resId) {
        setSelectedRes({ ...selectedRes, status: newStatus as any });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">PAYÉE / CONFIRMÉE</span>;
      case 'ACTIVE':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30">EN COURS</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-500/20 text-slate-300 border border-slate-500/30">CLÔTURÉE</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30">ANNULÉE</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">EN ATTENTE</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Gestion des Réservations</h1>
          <p className="text-xs text-slate-400">
            {reservations.length} réservation{reservations.length > 1 ? 's' : ''} enregistrée{reservations.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Réf, nom client..."
              className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-brand-500 w-48 sm:w-64"
            />
          </form>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none cursor-pointer"
          >
            <option value="all">Tous les statuts</option>
            <option value="PAID">Payée</option>
            <option value="ACTIVE">En cours</option>
            <option value="PENDING">En attente</option>
            <option value="COMPLETED">Clôturée</option>
            <option value="CANCELLED">Annulée</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Référence</th>
                <th className="p-4">Client</th>
                <th className="p-4">Véhicule</th>
                <th className="p-4">Départ → Retour</th>
                <th className="p-4">Montant</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Chargement des réservations...
                  </td>
                </tr>
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Aucune réservation trouvée.
                  </td>
                </tr>
              ) : (
                reservations.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-900/50 transition">
                    <td className="p-4 font-mono font-bold text-brand-400">
                      {r.reference}
                    </td>
                    <td className="p-4">
                      <p className="font-extrabold text-white">
                        {r.customer?.firstName} {r.customer?.lastName}
                      </p>
                      <p className="text-[10px] text-slate-500">{r.customer?.phone}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-200">{r.vehicle?.brand} {r.vehicle?.model}</p>
                      <p className="text-[10px] text-slate-500">{r.vehicle?.plateNumber}</p>
                    </td>
                    <td className="p-4 text-slate-300">
                      <p className="font-semibold">{r.startDate} → {r.endDate}</p>
                      <p className="text-[10px] text-slate-500">{r.durationDays} jours</p>
                    </td>
                    <td className="p-4 font-black text-white whitespace-nowrap">
                      {r.totalAmount?.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="p-4">
                      {getStatusBadge(r.status)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedRes(r)}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
                          title="Détail réservation"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          to={`/contrat/${r.id}`}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-brand-400 border border-slate-800 transition"
                          title="Contrat officiel PDF"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRes && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">Détail Réservation</p>
                <h3 className="text-xl font-black text-white font-mono">{selectedRes.reference}</h3>
              </div>
              <button
                onClick={() => setSelectedRes(null)}
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Client</p>
                <p className="font-extrabold text-white text-sm">
                  {selectedRes.customer?.firstName} {selectedRes.customer?.lastName}
                </p>
                <p className="text-slate-300">Tél : {selectedRes.customer?.phone}</p>
                <p className="text-slate-300">Email : {selectedRes.customer?.email}</p>
                <p className="text-slate-400">Permis : {selectedRes.customer?.licenseNumber}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Véhicule</p>
                <p className="font-extrabold text-white text-sm">
                  {selectedRes.vehicle?.brand} {selectedRes.vehicle?.model}
                </p>
                <p className="text-slate-300">Immatriculation : {selectedRes.vehicle?.plateNumber}</p>
                <p className="text-slate-300">Catégorie : {selectedRes.vehicle?.category?.name}</p>
                <p className="text-slate-400">Caution : {selectedRes.depositAmount?.toLocaleString('fr-FR')} FCFA</p>
              </div>
            </div>

            {/* Change Status Action */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <p className="text-xs font-bold text-white uppercase tracking-wider">Modifier le statut opérationnel</p>
              <div className="flex flex-wrap gap-2">
                {['PENDING', 'CONFIRMED', 'PAID', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedRes.id, st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition ${
                      selectedRes.status === st
                        ? 'bg-brand-500 text-black border-brand-500 shadow-md'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <Link
                to={`/contrat/${selectedRes.id}`}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-brand-400 border border-brand-500/30 text-xs font-bold flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Consulter le contrat officiel PDF</span>
              </Link>

              <button
                onClick={() => setSelectedRes(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
