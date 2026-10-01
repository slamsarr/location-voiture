import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Shield, CreditCard, FileText, CheckCircle2 } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Quels documents sont nécessaires pour louer un véhicule ?',
      a: 'Pour louer un véhicule chez Hertz Digital, vous devez fournir une pièce d’identité en cours de validité (Passeport ou CNI) ainsi qu’un permis de conduire valide depuis plus de 2 ans. Les permis étrangers sont acceptés accompagnés d’un permis international ou de leur traduction officielle.'
    },
    {
      q: 'Comment fonctionne la caution et quand est-elle restituée ?',
      a: 'La caution est une empreinte bancaire ou mobile bloquée lors de la réservation. Elle n’est pas débitée de votre compte. Elle est automatiquement libérée dans son intégralité sous 24 à 48 heures suivant la restitution du véhicule et la validation de l’état des lieux retour.'
    },
    {
      q: 'Quels sont les moyens de paiement acceptés sur la plateforme ?',
      a: 'Nous acceptons Wave, Orange Money, les passerelles partenaires InTouch ainsi que les cartes bancaires internationales (Visa, Mastercard). Tous les paiements bénéficient d’une confirmation instantanée et sans surcoût.'
    },
    {
      q: 'Où puis-je récupérer et restituer le véhicule ?',
      a: 'Nos véhicules sont disponibles à l’Aéroport International Blaise Diagne (AIBD) directement au terminal des arrivées, ou dans nos agences de Dakar Plateau, Almadies et Saly Portudal. Une option livraison à domicile ou à l’hôtel est également disponible.'
    },
    {
      q: 'Que comprend le contrat de location électronique ?',
      a: 'Le contrat électronique est généré immédiatement après paiement. Il détaille l’ensemble des conditions financières, les caractéristiques du véhicule loué, les assurances incluses et comporte une signature numérique certifiée avec horodatage garantissant sa valeur juridique.'
    },
    {
      q: 'Puis-je annuler ou modifier ma réservation ?',
      a: 'Oui, l’annulation est 100% gratuite jusqu’à 48 heures avant l’heure de départ prévue. Les remboursements sont traités immédiatement sur le moyen de paiement d’origine.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-400 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
          Support & Informations
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Foire Aux Questions</h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Retrouvez les réponses aux questions les plus courantes sur le fonctionnement de la réservation, les garanties et le retrait de véhicule.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="glass-panel rounded-2xl border border-white/10 overflow-hidden transition"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-brand-400 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-brand-400' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
