import React, { useEffect, useState } from 'react';
import { Bell, MessageSquare, Mail, Smartphone, CheckCircle2, Clock } from 'lucide-react';
import { api } from '../../services/api';

export const AdminNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNotifications()
      .then(res => setNotifications(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'WHATSAPP':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">WHATSAPP</span>;
      case 'SMS':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-500/20 text-sky-400 border border-sky-500/30">SMS</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">EMAIL</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Journal des Notifications & Alertes</h1>
          <p className="text-xs text-slate-400">
            Historique d'envoi automatisé (SMS, WhatsApp, Email) aux conducteurs
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Canal</th>
                <th className="p-4">Destinataire</th>
                <th className="p-4">Message / Contenu</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Date d'envoi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Chargement des notifications...
                  </td>
                </tr>
              ) : notifications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Aucune notification enregistrée.
                  </td>
                </tr>
              ) : (
                notifications.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-900/50 transition">
                    <td className="p-4">
                      {getTypeBadge(n.type)}
                    </td>
                    <td className="p-4 font-mono font-bold text-white">
                      {n.recipient}
                    </td>
                    <td className="p-4 max-w-md text-slate-300">
                      {n.subject && <p className="font-bold text-white text-[11px] mb-0.5">{n.subject}</p>}
                      <p className="line-clamp-2">{n.content}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3" />
                        ENVOYÉ
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(n.sentAt).toLocaleDateString('fr-FR')} {new Date(n.sentAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
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
