import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Car,
  ChevronLeft
} from 'lucide-react';
import { useCart } from '../store/useCartStore';

export const CartPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  if (!cart) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-white">Votre panier est actuellement vide</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Explorez notre flotte de véhicules disponibles et configurez votre réservation en quelques clics.
        </p>
        <Link
          to="/vehicules"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-sm transition"
        >
          <Car className="w-4 h-4" />
          <span>Découvrir nos véhicules</span>
        </Link>
      </div>
    );
  }

  const { vehicle } = cart;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-brand-400" />
            <span>Votre Panier de Réservation</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Vérifiez les dates et options de votre location avant de finaliser vos informations.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-bold transition p-2 rounded-lg hover:bg-rose-500/10"
        >
          <Trash2 className="w-4 h-4" />
          <span>Vider le panier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Cart details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-6">
            
            {/* Vehicle preview header */}
            <div className="flex items-center gap-4">
              <img
                src={vehicle.imageUrl}
                alt={vehicle.model}
                className="w-28 h-20 object-cover rounded-2xl bg-slate-900 border border-slate-800"
              />
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  {vehicle.category.name}
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  {vehicle.brand} {vehicle.model}
                </h3>
                <p className="text-xs text-slate-400">
                  {vehicle.year} • {vehicle.transmission === 'AUTOMATIC' ? 'Automatique' : 'Manuelle'} • {vehicle.seats} places
                </p>
              </div>
            </div>

            {/* Dates & Location summary */}
            <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-200">Période de location : {cart.durationDays} jour{cart.durationDays > 1 ? 's' : ''}</p>
                  <p className="text-slate-400 mt-0.5">Du <strong>{cart.startDate}</strong> ({cart.pickupTime}) au <strong>{cart.endDate}</strong> ({cart.returnTime})</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-slate-900 pt-3">
                <MapPin className="w-4 h-4 text-[#D8C59A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-200">Prise en charge :</p>
                  <p className="text-slate-400 mt-0.5">{cart.pickupLocation}</p>
                  {cart.pickupLocation !== cart.returnLocation && (
                    <div className="mt-2 pt-2 border-t border-white/[0.05]">
                      <p className="font-bold text-[#D8C59A]">Restitution (Aller-Simple) :</p>
                      <p className="text-slate-300 mt-0.5">{cart.returnLocation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Options list */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Options & Services souscrits ({cart.options.length})
              </h4>
              {cart.options.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Aucune option additionnelle souscrite.</p>
              ) : (
                <div className="space-y-2">
                  {cart.options.map((opt) => (
                    <div
                      key={opt.code}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#D8C59A]" />
                        <div>
                          <span className="font-semibold text-slate-200">{opt.name}</span>
                          {opt.code === 'CHAUFFEUR_VIP' && (
                            <span className="ml-2 text-[9px] px-2 py-0.5 rounded-full bg-[#B89B5F]/20 text-[#D8C59A] font-extrabold uppercase">
                              VIP
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-bold text-[#D8C59A]">
                        +{(opt.pricePerDay * cart.durationDays).toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions button */}
            <div className="pt-2 flex items-center justify-between">
              <Link
                to={`/vehicules/${vehicle.id}`}
                className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Modifier les options & dates</span>
              </Link>
            </div>

          </div>
        </div>

        {/* Right: Price Summary & Checkout (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
            <h3 className="text-lg font-black text-white pb-3 border-b border-slate-800">
              Récapitulatif Financier
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Location de base ({cart.durationDays} j × {cart.dailyRate.toLocaleString('fr-FR')} F) :</span>
                <span className="text-white font-semibold">{cart.subtotal.toLocaleString('fr-FR')} FCFA</span>
              </div>

              {cart.optionsTotal > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>Options & Services VIP :</span>
                  <span className="text-[#D8C59A] font-semibold">+{cart.optionsTotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
              )}

              {Boolean(cart.oneWayFee && cart.oneWayFee > 0) && (
                <div className="flex justify-between text-slate-400">
                  <span className="text-[#D8C59A]">Frais logistiques aller-simple :</span>
                  <span className="text-[#D8C59A] font-semibold">+{(cart.oneWayFee || 0).toLocaleString('fr-FR')} FCFA</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>Caution de garantie (bloquée) :</span>
                <span className="text-slate-300 font-semibold">{cart.depositAmount.toLocaleString('fr-FR')} FCFA</span>
              </div>

              <div className="border-t border-slate-800 pt-4 flex justify-between items-center text-sm">
                <span className="font-black text-white">Total à payer :</span>
                <span className="text-2xl font-black text-[#D8C59A]">
                  {cart.totalAmount.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-400 hover:to-amber-400 text-black font-extrabold text-base shadow-xl shadow-brand-500/20 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <span>Passer au Checkout</span>
              <ArrowRight className="w-5 h-5 text-black" />
            </button>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
              <p className="flex items-center gap-1.5 font-bold text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Garantie Hertz Digital
              </p>
              <p>Votre contrat est immédiatement édité et certifié après la validation du paiement.</p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
