import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  FileCheck, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  Car, 
  Compass, 
  Headphones,
  Trophy,
  MapPin,
  Flame,
  CalendarDays,
} from 'lucide-react';
import { SearchBar } from '../components/booking/SearchBar';
import { VehicleCard } from '../components/booking/VehicleCard';
import { SenegalAgenciesMap } from '../components/map/SenegalAgenciesMap';
import { api } from '../services/api';
import { Vehicle } from '../types';

// ─── Animated Counter Hook ───────────────────────────────────────────────────
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ─── Intersection Observer Hook ──────────────────────────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── JOJ Countdown Hook ──────────────────────────────────────────────────────
function useCountdown(targetDate: Date) {
  const calc = () => {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

// ─── Senegal Cities Data ──────────────────────────────────────────────────────
const senegalCities = [
  {
    name: 'Dakar',
    subtitle: 'Capitale vibrante — Siège des JOJ 2026',
    image: 'https://images.unsplash.com/photo-1584811644165-33db7a6b7d3d?auto=format&fit=crop&q=80&w=800',
    tag: '🏙️ Capitale',
    joj: true,
  },
  {
    name: 'Saly',
    subtitle: 'Littoral turquoise — Épreuves nautiques JOJ',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    tag: '🏖️ Station balnéaire',
    joj: true,
  },
  {
    name: 'Diamniadio',
    subtitle: 'Cité moderne — Village olympique',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80&w=800',
    tag: '🏗️ Ville nouvelle',
    joj: true,
  },
  {
    name: 'Saint-Louis',
    subtitle: 'Patrimoine UNESCO — Charme colonial',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=800',
    tag: '🏛️ Patrimoine',
    joj: false,
  },
];

export const HomePage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Intersection observers
  const statsSection = useInView();
  const jojSection = useInView(0.1);
  const citiesSection = useInView(0.1);
  const stepsSection = useInView(0.1);
  const reviewsSection = useInView(0.1);

  // Animated counters
  const clientCount = useCountUp(500, 1800, statsSection.inView);
  const vehicleCount = useCountUp(12, 1500, statsSection.inView);
  const satisfactionCount = useCountUp(98, 1600, statsSection.inView);

  // JOJ countdown — 31 octobre 2026
  const jojDate = new Date('2026-10-31T00:00:00');
  const countdown = useCountdown(jojDate);

  // Payment logos marquee
  const paymentLogos = ['🌊 Wave', '🟠 Orange Money', '💳 Visa', '🔵 Mastercard', '📄 Contrat Officiel', '✅ Zéro Frais Cachés', '🛡️ Assurance Incluse', '🚗 Livraison Aéroport'];

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
    <div className="space-y-0 pb-24">

      {/* ══════════════════════════════════════════════
          HERO — Split layout (texte gauche / voiture droite)
      ══════════════════════════════════════════════ */}
      <section className="relative pt-16 pb-12 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#B89B5F]/6 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-[#00853F]/4 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Gauche */}
            <div className="space-y-7">
              {/* Badge Sénégal */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md">
                <span className="flex gap-0.5">
                  <span className="w-1.5 h-3.5 rounded-l-sm bg-[#00853F]" />
                  <span className="w-1.5 h-3.5 bg-[#FDEF42] flex items-center justify-center text-[6px]">★</span>
                  <span className="w-1.5 h-3.5 rounded-r-sm bg-[#E31B23]" />
                </span>
                <span className="text-[#D8C59A] text-[10px] uppercase font-bold tracking-widest">Location Haut de Gamme · Sénégal</span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white leading-[1.08]">
                Votre mobilité{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4EFE6] via-[#D8C59A] to-[#B89B5F]">d'exception.</span>
                <br />
                <span className="text-3xl sm:text-4xl font-bold text-slate-300">En toute sérénité.</span>
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
                Réservez votre véhicule en ligne, payez par{' '}
                <span className="text-[#D8C59A] font-semibold">Wave</span>,{' '}
                <span className="text-[#D8C59A] font-semibold">Orange Money</span> ou carte bancaire, et recevez votre contrat certifié immédiatement.
              </p>

              <div className="flex flex-wrap gap-2">
                {['Disponibilité immédiate', 'Contrat PDF certifié', 'AIBD 24/7', 'Tarifs FCFA'].map(item => (
                  <span key={item} className="flex items-center gap-1.5 text-[10px] text-slate-300 bg-white/[0.04] border border-white/[0.07] px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-[#D8C59A]" />{item}
                  </span>
                ))}
              </div>

              <SearchBar />
            </div>

            {/* Droite — voiture cinématique */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/[0.08]">
                <img
                  src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=1200"
                  alt="Véhicule de prestige au Sénégal"
                  className="w-full h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#07090E]/60 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 glass-panel rounded-2xl p-4 border border-white/[0.10]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">Flotte 2024–2026</p>
                      <p className="text-sm font-extrabold text-white">Véhicules de Moins de 2 ans</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-[#D8C59A]">98%</p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider">Satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Mini drapeau flottant */}
              <div className="absolute -top-3 -right-3 flex gap-0.5 rounded-xl overflow-hidden shadow-xl border border-white/10">
                <div className="w-3 h-14 bg-[#00853F]" />
                <div className="w-3 h-14 bg-[#FDEF42] flex items-center justify-center text-[8px]">★</div>
                <div className="w-3 h-14 bg-[#E31B23]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MARQUEE PAIEMENTS
      ══════════════════════════════════════════════ */}
      <div className="border-y border-white/[0.05] bg-[#0A0D15]/80 py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...paymentLogos, ...paymentLogos].map((logo, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-400 mx-8">
              <span className="text-[#D8C59A]">{logo}</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          STATS ANIMÉES
      ══════════════════════════════════════════════ */}
      <section ref={statsSection.ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          {[
            { value: clientCount, suffix: '+', label: 'Clients satisfaits', sub: 'Au Sénégal & diaspora' },
            { value: vehicleCount, suffix: '', label: 'Véhicules premium', sub: 'Flotte 2024–2026' },
            { value: satisfactionCount, suffix: '%', label: 'Satisfaction client', sub: 'Note moyenne 4.9★' },
          ].map((stat, i) => (
            <div key={i}
              className={`text-center rounded-2xl p-6 bg-[#0B0E17]/80 border border-white/[0.06] transition-all duration-700 ${statsSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <p className="text-4xl sm:text-5xl font-black text-[#D8C59A]">{stat.value}{stat.suffix}</p>
              <p className="text-sm font-bold text-white mt-1">{stat.label}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          🏅 JOJ DAKAR 2026
      ══════════════════════════════════════════════ */}
      <section ref={jojSection.ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`relative rounded-3xl overflow-hidden border border-[#D8C59A]/20 shadow-2xl transition-all duration-1000 ${jojSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Fond image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=1600"
              alt="Jeux Olympiques de la Jeunesse Dakar 2026"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07090E] via-[#07090E]/90 to-[#07090E]/60" />
          </div>

          {/* Bande drapeau haut */}
          <div className="absolute top-0 left-0 right-0 h-1 flex">
            <div className="flex-1 bg-[#00853F]" />
            <div className="flex-1 bg-[#FDEF42]" />
            <div className="flex-1 bg-[#E31B23]" />
          </div>

          <div className="relative z-10 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Info */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  <div className="w-2 h-6 rounded-l bg-[#00853F]" />
                  <div className="w-2 h-6 bg-[#FDEF42] flex items-center justify-center text-[8px]">★</div>
                  <div className="w-2 h-6 rounded-r bg-[#E31B23]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FDEF42] px-3 py-1 rounded-full bg-[#FDEF42]/10 border border-[#FDEF42]/20">
                  🏅 1ers Jeux Olympiques sur le sol africain
                </span>
              </div>

              <div>
                <p className="text-[11px] text-[#D8C59A] uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
                  <Trophy className="w-3.5 h-3.5" /> Jeux Olympiques de la Jeunesse Dakar 2026
                </p>
                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                  Déplacez-vous avec{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDEF42] via-[#D8C59A] to-[#B89B5F]">
                    style pendant les JOJ
                  </span>
                </h2>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Du <span className="font-bold text-white">31 octobre au 13 novembre 2026</span>, Dakar accueille les premiers Jeux Olympiques de la Jeunesse d'Afrique.{' '}
                <span className="text-[#D8C59A]">2 700 athlètes · 200+ nations · 25 sports</span>.
                Nous assurons votre mobilité entre Dakar, Diamniadio et Saly.
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  { icon: MapPin, text: 'Dakar · Diamniadio · Saly' },
                  { icon: CalendarDays, text: '31 Oct – 13 Nov 2026' },
                  { icon: Flame, text: '25 sports · 2 700 athlètes' },
                ].map(({ icon: Icon, text }) => (
                  <span key={text} className="flex items-center gap-1.5 text-[11px] text-slate-300 bg-white/[0.05] border border-white/[0.08] px-3 py-1.5 rounded-full">
                    <Icon className="w-3 h-3 text-[#D8C59A]" />{text}
                  </span>
                ))}
              </div>

              <Link
                to="/vehicules"
                className="inline-flex items-center gap-2 btn-luxe-primary px-7 py-3.5 rounded-2xl text-xs uppercase tracking-wider font-extrabold"
              >
                <Trophy className="w-4 h-4" /> Réserver pour les JOJ <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Compte à rebours */}
            <div className="flex flex-col items-center gap-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#D8C59A]">⏱️ Compte à rebours — Ouverture des JOJ</p>
              <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
                {[
                  { v: countdown.days, label: 'Jours' },
                  { v: countdown.hours, label: 'Heures' },
                  { v: countdown.minutes, label: 'Min' },
                  { v: countdown.seconds, label: 'Sec' },
                ].map(({ v, label }) => (
                  <div key={label} className="flex flex-col items-center rounded-2xl p-4 bg-black/40 border border-[#D8C59A]/20 backdrop-blur-md">
                    <span className="text-3xl font-black text-[#D8C59A] tabular-nums">{String(v).padStart(2, '0')}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest mt-1">{label}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 text-center">🌍 Premiers Jeux Olympiques organisés en Afrique</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          🇸🇳 VILLES DU SÉNÉGAL
      ══════════════════════════════════════════════ */}
      <section ref={citiesSection.ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className={`transition-all duration-700 ${citiesSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center space-y-2 mb-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#D8C59A]">🇸🇳 Découvrir le Sénégal</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Nos destinations — Les villes qui font le Sénégal
            </h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Zones hôtes officielles des JOJ 2026 et destinations emblématiques desservies par notre flotte.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {senegalCities.map((city, i) => (
              <div
                key={city.name}
                className="relative rounded-2xl overflow-hidden border border-white/[0.07] group hover:border-[#D8C59A]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <img src={city.image} alt={city.name} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-[#D8C59A]">
                    {city.tag}
                  </span>
                  {city.joj && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FDEF42]/20 border border-[#FDEF42]/30 text-[#FDEF42]">🏅 JOJ</span>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-base font-black text-white">{city.name}</h3>
                  <p className="text-[10px] text-slate-300 mt-0.5">{city.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <p className="text-[10px] text-slate-500 flex items-center justify-center gap-2">
              <MapPin className="w-3 h-3 text-[#D8C59A]" />
              Livraison et reprise disponibles dans toutes ces zones pendant les JOJ 2026
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FLOTTE — ONGLETS CATÉGORIES
      ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/[0.06]">
          <div>
            <p className="text-[10px] text-[#D8C59A] font-bold uppercase tracking-widest mb-1.5">Collection Sélectionnée</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Véhicules Disponibles à la Réservation</h2>
          </div>
          <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-[#0F1420] border border-white/[0.06]">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition ${
                  selectedCategory === cat.id ? 'bg-[#B89B5F] text-black font-extrabold shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => <div key={n} className="h-96 rounded-3xl bg-slate-900/40 animate-pulse border border-white/[0.05]" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
          </div>
        )}

        <div className="text-center pt-4">
          <Link to="/vehicules" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-extrabold text-[#D8C59A] hover:text-white transition group py-2">
            <span>Explorer l'intégralité du catalogue (12 véhicules)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* CARTE SÉNÉGAL */}
      <section id="agences-senegal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 py-8">
        <SenegalAgenciesMap />
      </section>

      {/* 4 ÉTAPES */}
      <section ref={stepsSection.ref} id="etapes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 py-8">
        <div className={`rounded-3xl p-8 sm:p-14 bg-[#0B0E17]/90 border border-white/[0.06] shadow-2xl relative overflow-hidden transition-all duration-700 ${stepsSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D8C59A] px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08]">Parcours 100% Dématérialisé</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Réservez en 4 étapes simples</h2>
            <p className="text-xs text-slate-300">Un processus rapide et autonome conçu pour supprimer toute attente au guichet.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st) => {
              const Icon = st.icon;
              return (
                <div key={st.step} className="rounded-2xl p-6 bg-[#080B12]/80 border border-white/[0.06] hover:border-[#B89B5F]/30 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.04] text-[#D8C59A] border border-white/[0.08] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#B89B5F]/10 transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-2xl font-black text-slate-700 font-mono group-hover:text-[#D8C59A]/40 transition">{st.step}</span>
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

      {/* POURQUOI NOUS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D8C59A]">Engagement & Standards</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
              Une exigence technique pour une mobilité haut de gamme
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Notre architecture numérique offre une transparence totale sur les cautions, la disponibilité et les garanties contractuelles — à la hauteur des attentes des JOJ Dakar 2026.
            </p>
            <div className="space-y-4 pt-2">
              {[
                { icon: ShieldCheck, title: 'Assurance Tout Risque & Zéro Mauvaise Surprise', desc: 'Véhicules assurés avec franchise claire et caution protégée.' },
                { icon: Clock, title: 'Service Accueil Privilège 24/7', desc: "Prise en charge directe au terminal des arrivées de l'Aéroport Blaise Diagne (AIBD) ou livraison personnalisée." },
                { icon: Headphones, title: 'Assistance Dédiée Permanente', desc: 'Assistance téléphonique et conciergerie 7j/7 tout au long de votre séjour.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] text-[#D8C59A] border border-white/[0.07] mt-0.5 shrink-0"><Icon className="w-4 h-4" /></div>
                  <div>
                    <h4 className="font-bold text-white text-xs uppercase tracking-wide">{title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/[0.08] relative group">
              <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200" alt="Flotte Prestige" className="w-full h-[440px] object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl glass-panel border border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Flotte 2024–2026</p>
                    <p className="text-base font-extrabold text-white">Véhicules Récents de Moins de 2 Ans</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-[#D8C59A]">98%</p>
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Satisfaction Client</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Drapeau décoratif */}
            <div className="absolute -bottom-3 -left-3 flex rounded-xl overflow-hidden shadow-xl border border-white/10">
              <div className="w-2 h-12 bg-[#00853F]" />
              <div className="w-2 h-12 bg-[#FDEF42] flex items-center justify-center text-[6px]">★</div>
              <div className="w-2 h-12 bg-[#E31B23]" />
            </div>
          </div>
        </div>
      </section>

      {/* AVIS CLIENTS */}
      <section ref={reviewsSection.ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8">
        <div className={`transition-all duration-700 ${reviewsSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center max-w-xl mx-auto space-y-2">
            <p className="text-[10px] text-[#D8C59A] font-bold uppercase tracking-widest">Retours d'Expérience</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Témoignages de nos clients</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {reviews.map((rev, i) => (
              <div key={i}
                className="rounded-3xl p-6 bg-[#0B0E17]/80 border border-white/[0.06] flex flex-col justify-between hover:border-[#B89B5F]/20 hover:-translate-y-1 transition-all duration-300"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div>
                  <div className="flex items-center gap-1 text-[#D8C59A] mb-4">
                    {[...Array(rev.rating)].map((_, idx) => <Star key={idx} className="w-3.5 h-3.5 fill-[#D8C59A]" />)}
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed mb-6">"{rev.comment}"</p>
                </div>
                <div className="border-t border-white/[0.05] pt-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-xs">{rev.name}</h4>
                    <p className="text-[10px] text-slate-400">{rev.role}</p>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-white/[0.04] text-[#D8C59A] font-semibold border border-white/[0.06]">{rev.vehicle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="rounded-3xl bg-gradient-to-r from-[#111624] via-[#161C2C] to-[#111624] p-8 sm:p-14 border border-[#B89B5F]/25 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          {/* Bande drapeau bas */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 flex">
            <div className="flex-1 bg-[#00853F]" />
            <div className="flex-1 bg-[#FDEF42]" />
            <div className="flex-1 bg-[#E31B23]" />
          </div>
          <div className="space-y-3 max-w-xl text-center lg:text-left relative z-10">
            <span className="text-[10px] font-bold text-[#D8C59A] uppercase tracking-widest">Réservation Instantanée</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Prêt pour votre prochain déplacement au Sénégal ?
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Consultez nos disponibilités en temps réel — idéal pour les JOJ Dakar 2026. Confirmation immédiate et garantie meilleur tarif.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 relative z-10">
            <Link to="/vehicules" className="btn-luxe-primary px-8 py-3.5 rounded-2xl text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2">
              <span>Voir tous les véhicules</span><ArrowRight className="w-4 h-4 text-black" />
            </Link>
            <Link to="/contact" className="btn-luxe-secondary px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider font-bold flex items-center justify-center">
              Contacter un conseiller
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
