import React from 'react';
import { 
  X, 
  CheckCheck, 
  MapPin, 
  FileText, 
  PhoneCall, 
  Navigation, 
  Car, 
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface WhatsAppNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationData: {
    reference: string;
    vehicleName: string;
    pickupLocation: string;
    returnLocation?: string;
    startDate: string;
    endDate: string;
    customerName: string;
    totalAmount: number;
    kycVerified?: boolean;
  };
}

export const WhatsAppNotificationModal: React.FC<WhatsAppNotificationModalProps> = ({
  isOpen,
  onClose,
  reservationData
}) => {
  if (!isOpen) return null;

  const nowTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-sm rounded-[36px] bg-[#0B141A] border-4 border-slate-800 shadow-2xl overflow-hidden relative flex flex-col h-[650px]">
        
        {/* Smartphone Speaker & Camera Notch */}
        <div className="bg-[#0B141A] pt-3 pb-1 flex justify-center items-center">
          <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-950 mr-2" />
            <div className="w-8 h-1 rounded-full bg-slate-800" />
          </div>
        </div>

        {/* WhatsApp Header */}
        <div className="bg-[#202C33] px-4 py-3 flex items-center justify-between border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D8C59A] to-[#B89B5F] flex items-center justify-center text-black font-black text-sm shadow">
                H
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#202C33] flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">✓</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-white text-xs font-bold leading-tight">Hertz Digital Sénégal</h3>
              </div>
              <p className="text-[10px] text-emerald-400 font-medium">Compte Officiel Vérifié • En ligne</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/50 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Body (with authentic WhatsApp background pattern) */}
        <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#0B141A] relative">
          
          {/* Timestamp Pill */}
          <div className="flex justify-center">
            <span className="px-3 py-1 rounded-lg bg-[#182229] text-[10px] text-slate-400 shadow">
              Aujourd'hui
            </span>
          </div>

          {/* Incoming Message Bubble */}
          <div className="max-w-[92%] rounded-2xl rounded-tl-sm p-3.5 bg-[#202C33] text-slate-200 text-xs shadow-md space-y-2.5 relative border border-slate-700/40">
            
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-700/60">
              <span className="text-[10px] font-black uppercase text-[#D8C59A] tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#D8C59A]" /> Confirmation de Réservation
              </span>
              <span className="text-[9px] text-slate-400 font-mono">{nowTime}</span>
            </div>

            <p className="text-slate-100">
              Bonjour <strong>{reservationData.customerName}</strong>, votre réservation <strong>{reservationData.reference}</strong> est confirmée avec succès chez Hertz Digital Sénégal !
            </p>

            {/* Vehicle Summary Card Inside Message */}
            <div className="rounded-xl p-2.5 bg-[#111B21] border border-slate-800 space-y-1.5 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">{reservationData.vehicleName}</span>
                <span className="text-[#D8C59A] font-bold">{reservationData.totalAmount.toLocaleString('fr-FR')} F</span>
              </div>
              <div className="text-[10px] text-slate-400 space-y-0.5">
                <p>📅 Du {reservationData.startDate} au {reservationData.endDate}</p>
                <p>📍 Prise en charge : {reservationData.pickupLocation}</p>
                {reservationData.returnLocation && reservationData.returnLocation !== reservationData.pickupLocation && (
                  <p className="text-[#D8C59A]">🔄 Restitution Aller-Simple : {reservationData.returnLocation}</p>
                )}
              </div>
            </div>

            {/* Parking Location Card */}
            <div className="rounded-xl p-2.5 bg-emerald-950/40 border border-emerald-500/30 space-y-1 text-[11px]">
              <p className="font-bold text-emerald-300 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-emerald-400" />
                Emplacement du véhicule à l'arrivée
              </p>
              <p className="text-[10px] text-slate-300">
                Parking VIP AIBD • <strong>Allée B, Emplacement #14</strong>
              </p>
              <p className="text-[9px] text-slate-400">
                Agent d'accueil : Ousmane (+221 77 123 45 67)
              </p>
            </div>

            {/* KYC Status inside WhatsApp */}
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-300 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Dossier KYC Validé : Retrait express sans passage en agence.</span>
            </div>

            {/* PDF Contract Link Simulation */}
            <a
              href={`/contrat/${reservationData.reference}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#005C4B] hover:bg-[#007A65] text-white text-[11px] font-bold transition shadow"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" />
                <span>Télécharger le Contrat PDF Officiel</span>
              </div>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>

            {/* Read receipt */}
            <div className="flex justify-end items-center gap-1 text-[9px] text-slate-400 pt-1">
              <span>Reçu & Lu</span>
              <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
            </div>

          </div>

        </div>

        {/* WhatsApp Bottom Bar (Simulator footer) */}
        <div className="bg-[#202C33] px-3 py-3 border-t border-slate-700/50 flex items-center justify-between gap-2">
          <div className="flex-1 bg-[#2A3942] rounded-full px-4 py-2 text-[11px] text-slate-400">
            Répondre à Hertz Assistance 24/7...
          </div>
          <button
            onClick={() => alert('Assistance Conciergerie WhatsApp joignable au +221 33 800 00 00')}
            className="w-9 h-9 rounded-full bg-[#00A884] hover:bg-[#008F6F] flex items-center justify-center text-white shadow"
          >
            <PhoneCall className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
