import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  FileCheck, 
  Sparkles, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  Car, 
  Compass, 
  Users, 
  Headphones,
  ChevronRight,
  Shield
} from 'lucide-react';
import { SearchBar } from '../components/booking/SearchBar';
import { VehicleCard } from '../components/booking/VehicleCard';
import { SenegalAgenciesMap } from '../components/map/SenegalAgenciesMap';
import { api } from '../services/api';
import { Vehicle } from '../types';

export const HomePage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getVehicles({ sort: 'popularity' })
      .then(res => {
        setVehicles(res.vehicles);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { id: 'all', label: 'Toute la Flotte' },
    { id: 'suv', label: 'SUV & 4x4' },
    { id: 'berline', label: 'Berlines Prestige' },
    { id: 'compacte', label: 'Compactes Urbaines' },
    { id: 'economique', label: 'Économiques' },
  ];

  const filteredVehicles = selectedCategory === 'all'
    ? vehicles.slice(0, 6)
    : vehicles.filter(v => v.category?.slug === selectedCategory || v.category?.name.toLowerCase() === selectedCategory).slice(0, 6);

  const steps = [
    {
      step: '01',
      title: 'Sélectionnez votre véhicule',
      desc: 'Parcourez notre collection exclusive de modèles récents et entretenus selon les standards des constructeurs.',
      icon: Car,
    },
    {
      step: '02',
      title: 'Personnalisez votre contrat',
      desc: 'Ajustez vos dates, vos options (assurance tous risques zéro franchise, GPS, siège enfant) avec tarification dynamique en direct.',
      icon: Compass,
    },
    {
      step: '03',
      title: 'Réglez en toute sécurité',
      desc: 'Paiement mobile instantané par Wave, Orange Money ou Carte Bancaire certifiée sans frais cachés.',
      icon: CreditCard,
    },
    {
      step: '04',
      title: 'Recevez votre contrat certifié',
      desc: 'Obtenez immédiatement votre contrat officiel horodaté avec signature numérique prêt pour contrôle routier.',
      icon: FileCheck,
    },
  ];

  const reviews = [
    {
      name: 'Ibrahima Fall',
      role: 'Directeur Général, Cabinet Conseil Dakar',
      rating: 5,
      comment: 'Service impeccable. Le Land Cruiser Prado était prêt dès notre atterrissage à Blaise Diagne. Paiement Wave instantané et contrat officiel reçu sur WhatsApp.',
      vehicle: 'Toyota Land Cruiser Prado'
    },
    {
      name: 'Claire Dupont',
      role: 'Consultante Internationale, Paris',
      rating: 5,
      comment: 'Une expérience digne des plus grands loueurs de standing international. Véhicule irréprochable, insonorisé et propre. La restitution s’est faite en 5 minutes.',
      vehicle: 'Mercedes-Benz Classe C'
    },
    {
      name: 'Moussa Ndiaye',
      role: 'Entrepreneur, Saly Portudal',
      rating: 5,
      comment: 'Transparence absolue sur la caution et les tarifs en FCFA. Le recalcul dynamique des options apporte une clarté remarquable qu’on ne trouve nulle part ailleurs.',
      vehicle: 'Toyota RAV4 AWD'
    }
  ];

  return (
    <div className="space-y-24 pb-24">
      
      {/* HERO PRESTIGE */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        
        {/* Subtle Luxury Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-[#B89B5F]/8 blur-[160px] pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#D8C59A] text-[10px] uppercase font-bold tracking-widest backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-[#D8C59A]" />
              <span>Location Automobile Haut de Gamme • 100% Dématérialisée</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Votre mobilité d'exception.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4EFE6] via-[#D8C59A] to-[#B89B5F]">
                En toute sérénité.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Réservez votre véhicule en ligne en quelques clics, choisissez vos dates, payez en toute sécurité via Wave, Orange Money ou Carte Bancaire et recevez immédiatement votre contrat certifié.
            </p>
          </div>

          {/* SearchBar Luxury Island */}
          <div className="mt-12">
            <SearchBar />
          </div>

          {/* Reassurance Bar */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D8C59A]" /> Disponibilité immédiate garantie
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D8C59A]" /> Contrat officiel PDF avec signature numérique
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D8C59A]" /> Prise en charge 24h/24 à l'Aéroport AIBD
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D8C59A]" /> Tarification transparente en FCFA
            </span>
          </div>

        </div>
      </section>

      {/* DYNAMIC FLEET SECTION WITH CATEGORY TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/[0.06]">
          <div>
            <p className="text-[10px] text-[#D8C59A] font-bold uppercase tracking-widest mb-1.5">Collection Sélectionnée</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Véhicules Disponibles à la Réservation</h2>
          </div>

          {/* Dynamic interactive Category filter tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-[#0F1420] border border-white/[0.06]">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition ${
                  selectedCategory === cat.id
                    ? 'bg-[#B89B5F] text-black font-extrabold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-slate-900/40 animate-pulse border border-white/[0.05]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            to="/vehicules"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-extrabold text-[#D8C59A] hover:text-white transition group py-2"
          >
            <span>Explorer l'intégralité du catalogue (12 véhicules)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* CARTE INTERACTIVE DU SÉNÉGAL & AGENCES RÉGIONALES */}
      <section id="agences-senegal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <SenegalAgenciesMap />
      </section>

      {/* 4 ÉTAPES SECTION PRESTIGE */}
      <section id="etapes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="rounded-3xl p-8 sm:p-14 bg-[#0B0E17]/90 border border-white/[0.06] shadow-2xl relative overflow-hidden">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D8C59A] px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08]">
              Parcours 100% Dématérialisé
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Réservez en 4 étapes simples
            </h2>
            <p className="text-xs text-slate-300">
              Un processus rapide et autonome conçu pour supprimer toute attente au guichet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  className="rounded-2xl p-6 bg-[#080B12]/80 border border-white/[0.06] hover:border-[#B89B5F]/30 transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.04] text-[#D8C59A] border border-white/[0.08] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-2xl font-black text-slate-700 font-mono group-hover:text-[#D8C59A]/40 transition">
                        {st.step}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-white mb-2">{st.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US PRESTIGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D8C59A]">
              Engagement & Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
              Une exigence technique pour une mobilité haut de gamme
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Inspirée des standards de plateformes internationales comme IonyKar et StreetLoc, notre architecture numérique offre une transparence totale sur les cautions, la disponibilité et les garanties contractuelles.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white/[0.04] text-[#D8C59A] border border-white/[0.07] mt-0.5 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wide">Assurance Tout Risque & Zéro Mauvaise Surprise</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Véhicules assurés avec franchise claire et caution protégée.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white/[0.04] text-[#D8C59A] border border-white/[0.07] mt-0.5 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wide">Service Accueil Privilège 24/7</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Prise en charge directe au terminal des arrivées de l'Aéroport Blaise Diagne (AIBD) ou livraison personnalisée.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white/[0.04] text-[#D8C59A] border border-white/[0.07] mt-0.5 shrink-0">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wide">Assistance Dédiée Permanente</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Assistance téléphonique et conciergerie 7j/7 tout au long de votre séjour.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/[0.08] relative group">
              <img
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200"
                alt="Flotte Automobile Prestige"
                className="w-full h-[440px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl glass-panel border border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Flotte 2024 - 2026</p>
                    <p className="text-base font-extrabold text-white">Véhicules Récents de Moins de 2 Ans</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-[#D8C59A]">98%</p>
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Satisfaction Client</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AVIS CLIENTS LUXE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <p className="text-[10px] text-[#D8C59A] font-bold uppercase tracking-widest">Retours d'Expérience</p>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Témoignages de nos clients</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, i) => (
            <div
              key={i}
              className="rounded-3xl p-6 bg-[#0B0E17]/80 border border-white/[0.06] flex flex-col justify-between hover:border-[#B89B5F]/20 transition"
            >
              <div>
                <div className="flex items-center gap-1 text-[#D8C59A] mb-4">
                  {[...Array(rev.rating)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-[#D8C59A]" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed mb-6">"{rev.comment}"</p>
              </div>

              <div className="border-t border-white/[0.05] pt-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs">{rev.name}</h4>
                  <p className="text-[10px] text-slate-400">{rev.role}</p>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-white/[0.04] text-[#D8C59A] font-semibold border border-white/[0.06]">
                  {rev.vehicle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER PRESTIGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#111624] via-[#161C2C] to-[#111624] p-8 sm:p-14 border border-[#B89B5F]/25 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 max-w-xl text-center lg:text-left relative z-10">
            <span className="text-[10px] font-bold text-[#D8C59A] uppercase tracking-widest">
              Réservation Instantanée
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Prêt pour votre prochain déplacement ?
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Consultez nos disponibilités en temps réel, bloquez votre véhicule avec confirmation immédiate et bénéficiez de notre garantie meilleur tarif.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 relative z-10">
            <Link
              to="/vehicules"
              className="btn-luxe-primary px-8 py-3.5 rounded-2xl text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2"
            >
              <span>Voir tous les véhicules</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>
            <Link
              to="/contact"
              className="btn-luxe-secondary px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider font-bold flex items-center justify-center"
            >
              Contacter un conseiller
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
