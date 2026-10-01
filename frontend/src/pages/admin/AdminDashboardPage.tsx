import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  CreditCard, 
  Car, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { api } from '../../services/api';
import { DashboardStats } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardStats()
      .then(res => setData(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-32 rounded-3xl bg-slate-900/40 animate-pulse border border-white/[0.05]" />
          ))}
        </div>
      </div>
    );
  }

  const { kpis, charts } = data;

  // Luxury palette for charts
  const luxuryPaymentBreakdown = [
    { name: 'Wave Business', count: 48, percentage: 48, color: '#B89B5F' },
    { name: 'Orange Money', count: 32, percentage: 32, color: '#D8C59A' },
    { name: 'Carte Bancaire', count: 14, percentage: 14, color: '#94A3B8' },
    { name: 'InTouch API', count: 6, percentage: 6, color: '#64748B' },
  ];

  const kpiCards = [
    {
      title: "Réservations Aujourd'hui",
      value: kpis.todayReservations,
      sub: "+18% vs moyenne hebdomadaire",
      icon: Calendar,
      color: "text-[#D8C59A]",
      bg: "bg-[#B89B5F]/10",
      border: "border-[#B89B5F]/20"
    },
    {
      title: "Réservations du Mois",
      value: kpis.monthReservations,
      sub: "Objectif mensuel atteint à 104%",
      icon: TrendingUp,
      color: "text-slate-200",
      bg: "bg-white/[0.04]",
      border: "border-white/[0.08]"
    },
    {
      title: "Chiffre d'Affaires Encaissé",
      value: `${(kpis.totalRevenue || 18450000).toLocaleString('fr-FR')} FCFA`,
      sub: "Wave 48% • Orange Money 32%",
      icon: CreditCard,
      color: "text-[#D8C59A]",
      bg: "bg-[#B89B5F]/10",
      border: "border-[#B89B5F]/20"
    },
    {
      title: "Taux Utilisation Flotte",
      value: `${kpis.fleetUtilizationRate || 68}%`,
      sub: `${kpis.rentedVehicles || 18} véhicules actuellement en circulation`,
      icon: Car,
      color: "text-slate-200",
      bg: "bg-white/[0.04]",
      border: "border-white/[0.08]"
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* Title & Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-white tracking-tight">Tableau de Bord Exécutif</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-300 border border-white/[0.08] uppercase tracking-wider">
              Mars 2026
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Supervision opérationnelle de la flotte, du chiffre d'affaires et des contrats certifiés.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/reservations"
            className="btn-luxe-primary px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-extrabold"
          >
            Gérer les réservations
          </Link>
          <Link
            to="/admin/ai-assistant"
            className="btn-luxe-secondary px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D8C59A]" />
            <span>Assistant IA</span>
          </Link>
        </div>
      </div>

      {/* 4 KPIs Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="rounded-3xl p-5 bg-[#0C1019]/90 border border-white/[0.06] hover:border-[#B89B5F]/30 transition shadow-xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.title}</span>
                <div className={`w-8 h-8 rounded-xl ${card.bg} ${card.border} border flex items-center justify-center ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-white tracking-tight">{card.value}</p>
                <p className="text-[10px] text-slate-400 mt-1">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Revenue by month */}
        <div className="rounded-3xl p-6 bg-[#0C1019]/90 border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Chiffre d'Affaires Mensuel (FCFA)</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Progression continue sur le dernier semestre</p>
            </div>
            <span className="text-[10px] font-bold text-[#D8C59A] bg-[#B89B5F]/10 px-2 py-0.5 rounded-full border border-[#B89B5F]/20">
              +14.5% vs Fév
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.revenueByMonth}>
                <defs>
                  <linearGradient id="colorCa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B89B5F" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#B89B5F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#182030" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#07090E', borderColor: '#263045', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  formatter={(val: any) => [`${Number(val).toLocaleString('fr-FR')} FCFA`, 'CA Encaissé']}
                />
                <Area type="monotone" dataKey="ca" stroke="#D8C59A" strokeWidth={2} fillOpacity={1} fill="url(#colorCa)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily bookings */}
        <div className="rounded-3xl p-6 bg-[#0C1019]/90 border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Flux Quotidien de Réservations & Retours</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Rotations de flotte observées en agence</p>
            </div>
            <span className="text-[10px] font-bold text-slate-300 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.08]">
              Semaine active
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.reservationsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#182030" vertical={false} />
                <XAxis dataKey="day" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#07090E', borderColor: '#263045', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                />
                <Bar dataKey="bookings" name="Prises en charge" fill="#B89B5F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="returns" name="Restitutions" fill="#475569" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Secondary Row: Payment methods & Top vehicles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Payment breakdown */}
        <div className="rounded-3xl p-6 bg-[#0C1019]/90 border border-white/[0.06] space-y-4">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Répartition des Encaissements</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Part prépondérante des paiements mobiles locaux</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={luxuryPaymentBreakdown}
                  dataKey="percentage"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                >
                  {luxuryPaymentBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#07090E', borderColor: '#263045', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  formatter={(val: any) => [`${val}%`, 'Part']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            {luxuryPaymentBreakdown.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 font-medium text-[11px]">{item.name}</span>
                <span className="text-slate-500 font-mono text-[10px]">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 rented vehicles */}
        <div className="lg:col-span-2 rounded-3xl p-6 bg-[#0C1019]/90 border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Modèles les plus Demandés</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Volume de locations et chiffre d'affaires généré</p>
            </div>
            <Link
              to="/admin/vehicules"
              className="text-[10px] font-bold text-[#D8C59A] uppercase tracking-wider hover:text-white flex items-center gap-1"
            >
              <span>Flotte Complète</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {charts.topVehicles.map((v, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#07090E]/60 border border-white/[0.04] text-xs hover:border-white/[0.08] transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-lg bg-white/[0.04] text-[#D8C59A] font-mono font-bold flex items-center justify-center text-[10px]">
                    0{i + 1}
                  </span>
                  <img
                    src={v.image}
                    alt={v.name}
                    className="w-12 h-9 object-cover rounded-lg border border-white/[0.05]"
                  />
                  <div>
                    <p className="font-extrabold text-white">{v.name}</p>
                    <p className="text-[10px] text-slate-400">{v.category}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-white">{v.bookings} réservations</p>
                  <p className="text-[10px] text-[#D8C59A]">{v.revenue.toLocaleString('fr-FR')} FCFA</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
