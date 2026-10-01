import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-400 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
          Assistance 24/7
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Contactez nos conseillers mobilité</h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Une question sur un véhicule spécifique ou un besoin de devis sur mesure ? Notre équipe est à votre écoute 7 jours sur 7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
            <h3 className="text-base font-black text-white">Nos coordonnées</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Aéroport International Blaise Diagne</p>
                  <p className="text-slate-400">Terminal Passagers, Hall Arrivées, Dakar, Sénégal</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Ligne directe & WhatsApp 24/7</p>
                  <p className="text-slate-400">+221 33 800 00 00 / +221 77 123 45 67</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Service Client & Partenariats</p>
                  <p className="text-slate-400">contact@hertz-digital.demo</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Horaires de permanence</p>
                  <p className="text-slate-400">Agence Aéroport : Ouverte 24h/24, 7j/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
            <h3 className="text-base font-black text-white">Envoyez-nous un message</h3>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <p className="font-bold text-sm">Message transmis avec succès !</p>
                <p className="text-xs text-slate-300">Un conseiller vous répondra dans un délai de 30 minutes.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase">Nom complet</label>
                    <input
                      type="text"
                      required
                      placeholder="Amadou Diallo"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1 uppercase">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="votre.email@domaine.com"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase">Objet</label>
                  <input
                    type="text"
                    required
                    placeholder="Demande d'information pour location longue durée"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1 uppercase">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Détaillez votre besoin..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer la demande</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
