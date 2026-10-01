import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../store/useCartStore';
import { useAuth } from '../store/useAuthStore';
import { api } from '../services/api';
import { CustomerData } from '../types';
import { KYCModal } from '../components/kyc/KYCModal';

export const CheckoutPage: React.FC = () => {
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [kycModalOpen, setKycModalOpen] = useState(false);

  // Form State
  const [customer, setCustomer] = useState<CustomerData>({
    firstName: user?.role === 'CLIENT' ? 'Amadou' : '',
    lastName: user?.role === 'CLIENT' ? 'Diallo' : '',
    email: user?.email || '',
    phone: user?.phone || '+221 78 987 65 43',
    licenseNumber: 'SN-DKR-2018-98452',
    licenseExpiry: '2028-11-20',
    licenseCountry: 'Sénégal',
    address: 'Almadies, Lot 14',
    city: 'Dakar',
    country: 'Sénégal',
    kycVerified: false,
  });

  const [termsAccepted, setTermsAccepted] = useState(true);

  if (!cart) {
    navigate('/panier');
    return null;
  }

  const fillDemoData = () => {
    setCustomer({
      firstName: 'Amadou',
      lastName: 'Diallo',
      email: 'client@demo.local',
      phone: '+221 78 987 65 43',
      licenseNumber: 'SN-DKR-2018-98452',
      licenseExpiry: '2028-11-20',
      licenseCountry: 'Sénégal',
      address: 'Route des Almadies, Villa 12',
      city: 'Dakar',
      country: 'Sénégal',
    });
  };

  const handleNextStep = () => {
    setErrorMsg(null);
    if (step === 1) {
      if (!customer.firstName || !customer.lastName || !customer.email || !customer.phone) {
        setErrorMsg('Veuillez renseigner tous les champs obligatoires.');
        return;
      }
    }
    if (step === 2) {
      if (!customer.licenseNumber || !customer.licenseExpiry) {
        setErrorMsg('Veuillez renseigner le numéro et la date d’expiration du permis.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleProceedToPayment = async () => {
    if (!termsAccepted) {
      setErrorMsg('Veuillez accepter les conditions générales de location.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Créer la réservation sur le backend
      const reservation = await api.createReservation({
        vehicleId: cart.vehicle.id,
        startDate: cart.startDate,
        endDate: cart.endDate,
        pickupTime: cart.pickupTime,
        returnTime: cart.returnTime,
        pickupLocation: cart.pickupLocation,
        returnLocation: cart.returnLocation,
        options: cart.options,
        customer,
      });

      // 2. Rediriger vers la page de paiement simulé
      navigate(`/paiement/${reservation.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Impossible de créer la réservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsLabels = [
    { num: 1, label: 'Identité' },
    { num: 2, label: 'Permis' },
    { num: 3, label: 'Options' },
    { num: 4, label: 'Récapitulatif' },
    { num: 5, label: 'Paiement' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Checkout Progress Stepper */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 -z-0" />
          {stepsLabels.map((st) => (
            <div key={st.num} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs transition duration-200 ${
                  step === st.num
                    ? 'bg-brand-500 text-black shadow-lg shadow-brand-500/30'
                    : step > st.num
                    ? 'bg-emerald-500 text-black'
                    : 'bg-slate-900 border border-slate-700 text-slate-400'
                }`}
              >
                {step > st.num ? <CheckCircle2 className="w-5 h-5" /> : st.num}
              </div>
              <span className={`text-[11px] font-bold mt-1.5 hidden sm:block ${
                step === st.num ? 'text-brand-400' : 'text-slate-400'
              }`}>
                {st.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Demo helper */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-brand-500/20 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>Accélérez la démonstration avec des données pré-remplies :</span>
        </div>
        <button
          onClick={fillDemoData}
          className="px-3 py-1.5 rounded-lg bg-brand-500/20 hover:bg-brand-500/30 text-brand-400 font-extrabold border border-brand-500/30 transition text-[11px]"
        >
          Remplir profil démo
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: INFORMATIONS PERSONNELLES */}
      {step === 1 && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <h2 className="text-xl font-extrabold text-white">Étape 1 : Coordonnées du locataire</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase">Prénom *</label>
              <input
                type="text"
                value={customer.firstName}
                onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                placeholder="Amadou"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase">Nom *</label>
              <input
                type="text"
                value={customer.lastName}
                onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                placeholder="Diallo"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase">Email *</label>
              <input
                type="email"
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                placeholder="client@demo.local"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase">Téléphone (WhatsApp) *</label>
              <input
                type="tel"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                placeholder="+221 78 987 65 43"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase">Ville</label>
              <input
                type="text"
                value={customer.city}
                onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                placeholder="Dakar"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase">Pays</label>
              <input
                type="text"
                value={customer.country}
                onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
                placeholder="Sénégal"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleNextStep}
              className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg transition"
            >
              <span>Continuer : Informations Permis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PERMIS CONDUCTEUR */}
      {step === 2 && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <h2 className="text-xl font-extrabold text-white">Étape 2 : Permis de conduire</h2>
          <p className="text-xs text-slate-400">Requis pour l'édition automatique et légale du contrat de location.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            {/* KYC Biometric AI Card */}
            <div className="sm:col-span-2 p-4 rounded-2xl bg-[#07090E] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#B89B5F]/15 border border-[#B89B5F]/30 flex items-center justify-center text-[#D8C59A] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-white">Vérification Biométrique KYC</p>
                    {customer.kycVerified ? (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                        Certifié Conforme IA
                      </span>
                    ) : (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#B89B5F]/20 text-[#D8C59A] font-bold border border-[#B89B5F]/30">
                        Standard Virtuo / Sixt
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {customer.kycVerified 
                      ? 'Permis et identité certifiés. Contrat 100% prêt pour remise de clés sans contact.'
                      : 'Numérisez votre permis et validez votre identité par scan biométrique instantané.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setKycModalOpen(true)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 shadow ${
                  customer.kycVerified
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                    : 'btn-luxe-primary'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{customer.kycVerified ? 'Re-vérifier KYC' : 'Scanner mon permis (IA)'}</span>
              </button>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase">Numéro de permis de conduire *</label>
              <input
                type="text"
                value={customer.licenseNumber}
                onChange={(e) => setCustomer({ ...customer, licenseNumber: e.target.value })}
                placeholder="SN-DKR-2018-98452"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1 uppercase">Date d’expiration *</label>
              <input
                type="date"
                value={customer.licenseExpiry}
                onChange={(e) => setCustomer({ ...customer, licenseExpiry: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 font-medium cursor-pointer"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-bold mb-1 uppercase">Pays d'émission du permis</label>
              <input
                type="text"
                value={customer.licenseCountry}
                onChange={(e) => setCustomer({ ...customer, licenseCountry: e.target.value })}
                placeholder="Sénégal"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-3 rounded-xl bg-slate-900 text-slate-300 font-bold text-xs flex items-center gap-2 hover:bg-slate-800 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>
            <button
              onClick={handleNextStep}
              className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg transition"
            >
              <span>Continuer : Récapitulatif</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 & 4: RÉCAPITULATIF & OPTIONS */}
      {(step === 3 || step === 4) && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <h2 className="text-xl font-extrabold text-white">Étape {step} : Confirmation de la commande</h2>
          
          <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-slate-400 font-bold uppercase">Véhicule sélectionné :</span>
              <span className="text-white font-extrabold text-sm">{cart.vehicle.brand} {cart.vehicle.model}</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-slate-400 font-bold uppercase">Dates :</span>
              <span className="text-slate-200">Du {cart.startDate} au {cart.endDate} ({cart.durationDays} jours)</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-slate-400 font-bold uppercase">Prise en charge :</span>
              <span className="text-slate-200">{cart.pickupLocation}</span>
            </div>

            {cart.pickupLocation !== cart.returnLocation && (
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-[#D8C59A] font-bold uppercase">Restitution (Aller-Simple) :</span>
                <span className="text-slate-200 font-semibold">{cart.returnLocation}</span>
              </div>
            )}

            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-slate-400 font-bold uppercase">Conducteur & Statut KYC :</span>
              <div className="text-right">
                <span className="text-slate-200 block">{customer.firstName} {customer.lastName}</span>
                <span className={`text-[10px] font-bold ${customer.kycVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {customer.kycVerified ? '✓ Certifié Biométrique KYC' : '⚠ Non vérifié (passage au guichet requis)'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-slate-400 font-bold uppercase">Permis N° :</span>
              <span className="text-slate-200">{customer.licenseNumber} (Exp: {customer.licenseExpiry})</span>
            </div>

            {Boolean(cart.oneWayFee && cart.oneWayFee > 0) && (
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[#D8C59A]">
                <span className="font-bold uppercase">Frais logistiques aller-simple :</span>
                <span className="font-bold">+{(cart.oneWayFee || 0).toLocaleString('fr-FR')} FCFA</span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm pt-2">
              <span className="font-extrabold text-white">Montant total TTC :</span>
              <span className="text-xl font-black text-[#D8C59A]">{cart.totalAmount.toLocaleString('fr-FR')} FCFA</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <input
              type="checkbox"
              id="cgl"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 accent-[#B89B5F] cursor-pointer"
            />
            <label htmlFor="cgl" className="text-xs text-slate-300 cursor-pointer">
              J'accepte sans réserve les <strong>Conditions Générales de Location (CGL)</strong>, la politique de cautionnement et certifie l'exactitude des informations du permis de conduire.
            </label>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(step === 4 ? 2 : 2)}
              className="px-5 py-3 rounded-xl bg-slate-900 text-slate-300 font-bold text-xs flex items-center gap-2 hover:bg-slate-800 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>
            <button
              onClick={handleProceedToPayment}
              disabled={isSubmitting}
              className="btn-luxe-primary px-8 py-3.5 rounded-xl font-extrabold text-sm flex items-center gap-2 active:scale-95 transition disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Préparation...' : 'Valider & Choisir le mode de paiement'}</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      )}

      {/* KYC Verification Modal */}
      <KYCModal
        isOpen={kycModalOpen}
        onClose={() => setKycModalOpen(false)}
        initialLicenseNumber={customer.licenseNumber}
        onSuccess={(data) => {
          setCustomer((prev) => ({
            ...prev,
            licenseNumber: data.licenseNumber,
            licenseExpiry: data.expiryDate,
            kycVerified: true,
          }));
        }}
      />

    </div>
  );
};
