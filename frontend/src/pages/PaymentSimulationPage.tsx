import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Smartphone, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  AlertCircle,
  QrCode,
  ArrowRight,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../store/useCartStore';
import { Reservation } from '../types';

export const PaymentSimulationPage: React.FC = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<'WAVE' | 'ORANGE_MONEY' | 'INTOUCH' | 'CARD'>('WAVE');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (reservationId) {
      api.getReservationById(reservationId)
        .then(res => {
          setReservation(res);
          setPhoneNumber(res.customer.phone || '+221 78 987 65 43');
        })
        .catch(err => setErrorMsg(err.message))
        .finally(() => setLoading(false));
    }
  }, [reservationId]);

  const handleSimulatePayment = async (status: 'SUCCESS' | 'FAILED' = 'SUCCESS') => {
    if (!reservation) return;

    setProcessing(true);
    setErrorMsg(null);
    setPaymentResult(null);

    try {
      // Simulation d'un délai réseau réaliste (1,5s)
      await new Promise(r => setTimeout(r, 1200));

      const result = await api.initiatePayment({
        reservationId: reservation.id,
        method: selectedMethod,
        customerPhone: phoneNumber,
        simulateStatus: status,
      });

      setPaymentResult(result);

      if (result.status === 'SUCCESS') {
        clearCart();
        // Redirection fluide vers la confirmation
        setTimeout(() => {
          navigate(`/confirmation/${reservation.id}`);
        }, 1500);
      } else {
        setErrorMsg(result.message || 'Le paiement a échoué.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la communication avec la passerelle.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
        <p className="text-xs text-slate-400 mt-3">Initialisation de la passerelle de paiement...</p>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Réservation introuvable</h2>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl bg-brand-500 text-black font-bold text-xs"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-400 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
          Étape 5 / 5 • Passerelle Démonstrateur
        </span>
        <h1 className="text-3xl font-black text-white">Règlement de votre location</h1>
        <p className="text-xs text-slate-400">
          Réservation <strong className="text-white">{reservation.reference}</strong> • Véhicule : {reservation.vehicle.brand} {reservation.vehicle.model}
        </p>
      </div>

      {/* Amount banner */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 text-center space-y-1">
        <p className="text-xs text-slate-400 uppercase font-semibold">Montant Total à régler</p>
        <p className="text-4xl font-black text-brand-400 tracking-tight">
          {reservation.totalAmount.toLocaleString('fr-FR')} <span className="text-lg text-white font-bold">FCFA</span>
        </p>
        <p className="text-[11px] text-slate-500">Caution de {reservation.depositAmount.toLocaleString('fr-FR')} FCFA empreinte bancaire non débitée</p>
      </div>

      {/* Payment methods choice */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
          Choisissez votre moyen de paiement :
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          {/* Wave */}
          <button
            onClick={() => setSelectedMethod('WAVE')}
            className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-between gap-3 ${
              selectedMethod === 'WAVE'
                ? 'bg-sky-500/15 border-sky-400 text-white shadow-lg'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-black text-sm">
              W
            </div>
            <div>
              <p className="font-extrabold text-xs text-white">Wave</p>
              <p className="text-[10px] text-slate-400">Paiement 0%</p>
            </div>
          </button>

          {/* Orange Money */}
          <button
            onClick={() => setSelectedMethod('ORANGE_MONEY')}
            className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-between gap-3 ${
              selectedMethod === 'ORANGE_MONEY'
                ? 'bg-orange-500/15 border-orange-400 text-white shadow-lg'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-black text-sm">
              OM
            </div>
            <div>
              <p className="font-extrabold text-xs text-white">Orange Money</p>
              <p className="text-[10px] text-slate-400">Code secret</p>
            </div>
          </button>

          {/* InTouch */}
          <button
            onClick={() => setSelectedMethod('INTOUCH')}
            className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-between gap-3 ${
              selectedMethod === 'INTOUCH'
                ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-lg'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm">
              IT
            </div>
            <div>
              <p className="font-extrabold text-xs text-white">InTouch</p>
              <p className="text-[10px] text-slate-400">Agrégateur</p>
            </div>
          </button>

          {/* Carte Bancaire */}
          <button
            onClick={() => setSelectedMethod('CARD')}
            className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-between gap-3 ${
              selectedMethod === 'CARD'
                ? 'bg-indigo-500/15 border-indigo-400 text-white shadow-lg'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-xs text-white">Carte CB</p>
              <p className="text-[10px] text-slate-400">Visa / Master</p>
            </div>
          </button>

        </div>

        {/* Method Detail simulation */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-200">
            <Smartphone className="w-4 h-4 text-brand-400" />
            <span>Paramètres de la transaction ({selectedMethod})</span>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              Numéro de téléphone mobile lié au compte :
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-medium focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Info className="w-4 h-4 text-brand-400 shrink-0" />
            <span>
              Un ordre de débit de <strong>{reservation.totalAmount.toLocaleString('fr-FR')} FCFA</strong> sera transmis à votre application mobile.
            </span>
          </div>
        </div>

        {/* Success or Error Feedback */}
        {paymentResult && (
          <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
            paymentResult.status === 'SUCCESS'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            {paymentResult.status === 'SUCCESS' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <div>
              <p className="font-extrabold">{paymentResult.message}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Réf transaction : {paymentResult.transactionId} • Statut : {paymentResult.status}
              </p>
            </div>
          </div>
        )}

        {errorMsg && !paymentResult && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          
          {/* Main Success Trigger */}
          <button
            onClick={() => handleSimulatePayment('SUCCESS')}
            disabled={processing}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-400 hover:to-amber-400 text-black font-extrabold text-base shadow-xl shadow-brand-500/20 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Simulation du paiement en cours...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Confirmer et Payer {reservation.totalAmount.toLocaleString('fr-FR')} FCFA</span>
              </>
            )}
          </button>

          {/* Error Simulation Trigger for Recruiter / Demo evaluation */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => handleSimulatePayment('FAILED')}
              disabled={processing}
              className="text-xs text-slate-500 hover:text-rose-400 underline font-medium transition"
            >
              [Démo : Tester le scénario d'échec de paiement / solde insuffisant]
            </button>
          </div>

        </div>

      </div>

      <p className="text-center text-xs text-slate-500">
        Architecture extensible PaymentProvider. Aucun débit réel n'est effectué dans ce prototype de démonstration.
      </p>

    </div>
  );
};
