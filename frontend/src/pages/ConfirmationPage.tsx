import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Download, 
  Calendar, 
  Car, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  QrCode,
  Share2,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { Reservation } from '../types';
import { WhatsAppNotificationModal } from '../components/common/WhatsAppNotificationModal';

export const ConfirmationPage: React.FC = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Déclenchement du confetti de célébration discret
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#ffffff']
      });
    } catch {}

    if (reservationId) {
      api.getReservationById(reservationId)
        .then(res => setReservation(res))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [reservationId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-brand-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-slate-400 mt-4">Chargement de votre confirmation certifiée...</p>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white">Réservation introuvable</h2>
        <Link to="/" className="mt-4 inline-block text-xs text-brand-400 underline">Retour à l'accueil</Link>
      </div>
    );
  }

  const { vehicle, customer } = reservation;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Success Badge & Title */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl animate-bounce" style={{ animationIterationCount: 2 }}>
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          Réservation validée & Paiement confirmé
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Réservation confirmée !
        </h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Votre contrat électronique officiel a été généré avec succès. Une copie a également été transmise par SMS et WhatsApp au <strong className="text-slate-200">{customer.phone}</strong>.
        </p>
      </div>

      {/* Main Reservation Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-2xl">
        
        {/* Header with Reference */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Référence Réservation</p>
            <p className="text-2xl font-black text-brand-400 font-mono tracking-tight">{reservation.reference}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Paiement Confirmé
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-brand-500/20 text-brand-400 font-bold text-xs border border-brand-500/30">
              Contrat Disponible
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          
          <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <p className="text-slate-400 uppercase font-bold text-[10px]">Véhicule loué</p>
            <div className="flex items-center gap-3">
              <img
                src={vehicle.imageUrl}
                alt={vehicle.model}
                className="w-16 h-12 object-cover rounded-xl border border-slate-800"
              />
              <div>
                <p className="font-extrabold text-white text-sm">{vehicle.brand} {vehicle.model}</p>
                <p className="text-slate-400">{vehicle.category?.name || 'Standard'} • Immat: {vehicle.plateNumber}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <p className="text-slate-400 uppercase font-bold text-[10px]">Dates de location</p>
            <div className="space-y-1">
              <p className="font-bold text-white text-sm">
                Du {reservation.startDate} au {reservation.endDate}
              </p>
              <p className="text-slate-400">Durée : <strong>{reservation.durationDays} jours</strong> • Prise en charge {reservation.pickupTime}</p>
            </div>
          </div>

          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <p className="text-slate-400 uppercase font-bold text-[10px]">Titulaire du contrat</p>
            <p className="font-bold text-white">{customer.firstName} {customer.lastName}</p>
            <p className="text-slate-400">Permis N° {customer.licenseNumber}</p>
            <p className="text-slate-400">{customer.email}</p>
          </div>

          <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <p className="text-slate-400 uppercase font-bold text-[10px]">Règlement</p>
            <p className="font-black text-white text-base">
              {reservation.totalAmount.toLocaleString('fr-FR')} <span className="text-xs text-brand-400">FCFA</span>
            </p>
            <p className="text-slate-400">Caution garantie : {reservation.depositAmount.toLocaleString('fr-FR')} FCFA</p>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-4 space-y-3">
          <Link
            to={`/contrat/${reservation.id}`}
            className="btn-luxe-primary w-full py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <FileText className="w-5 h-5 text-black" />
            <span>Visualiser & Télécharger mon Contrat (PDF)</span>
          </Link>

          {/* WhatsApp Business Notification Trigger Button */}
          <button
            type="button"
            onClick={() => setWhatsAppModalOpen(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#00A884]/15 hover:bg-[#00A884]/25 text-emerald-300 font-extrabold text-xs flex items-center justify-center gap-2 border border-emerald-500/30 transition shadow-lg shadow-emerald-900/20"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Ouvrir la notification WhatsApp Business reçue</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 uppercase font-black">
              Simulateur Mobile
            </span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/mes-reservations"
              className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-800 transition"
            >
              <span>Voir mon espace réservations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/"
              className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs flex items-center justify-center transition border border-slate-800"
            >
              <span>Retour à l'accueil</span>
            </Link>
          </div>
        </div>

      </div>

      {/* WhatsApp Business Notification Modal */}
      <WhatsAppNotificationModal
        isOpen={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
        reservationData={{
          reference: reservation.reference,
          vehicleName: `${vehicle.brand} ${vehicle.model}`,
          pickupLocation: reservation.pickupLocation,
          returnLocation: reservation.returnLocation,
          startDate: reservation.startDate,
          endDate: reservation.endDate,
          customerName: `${customer.firstName} ${customer.lastName}`,
          totalAmount: reservation.totalAmount,
          kycVerified: true,
        }}
      />

    </div>
  );
};
