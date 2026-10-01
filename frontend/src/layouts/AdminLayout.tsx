import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Car, 
  Users, 
  CreditCard, 
  FileText, 
  Sparkles, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight, 
  ShieldCheck, 
  ClipboardCheck, 
  Bot,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../store/useAuthStore';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loginDemo } = useAuth();

  const menuItems = [
    { label: 'Tableau de bord', path: '/admin', icon: LayoutDashboard },
    { label: 'Réservations', path: '/admin/reservations', icon: CalendarCheck },
    { label: 'Flotte Véhicules', path: '/admin/vehicules', icon: Car },
    { label: 'Clients', path: '/admin/clients', icon: Users },
    { label: 'Paiements', path: '/admin/paiements', icon: CreditCard },
    { label: 'Contrats Électroniques', path: '/admin/contrats', icon: FileText },
    { label: 'Inspection Véhicule – V2', path: '/admin/inspection-v2', icon: ClipboardCheck, badge: 'V2 Preview' },
    { label: 'Assistant IA Admin', path: '/admin/ai-assistant', icon: Bot, badge: 'IA' },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
    { label: 'Paramètres Agence', path: '/admin/parametres', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col md:flex-row">
      
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500 text-black font-extrabold flex items-center justify-center">
            H
          </div>
          <span className="font-extrabold text-white text-sm">HERTZ ADMIN</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950/95 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-amber-600 flex items-center justify-center text-black font-extrabold shadow-lg">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-white text-base">HERTZ</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-black bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    BACK-OFFICE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Administration Flotte</p>
              </div>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-brand-500 text-black font-extrabold shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                      isActive 
                        ? 'bg-black/20 text-black' 
                        : item.badge === 'IA' 
                        ? 'bg-amber-500/20 text-amber-300' 
                        : 'bg-indigo-500/20 text-indigo-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User & Switch to Public site */}
        <div className="p-4 border-t border-slate-800/80 space-y-3 bg-slate-950">
          <Link
            to="/"
            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center gap-2 border border-slate-800 transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-brand-400" />
            <span>Voir le site client public</span>
          </Link>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div className="leading-tight">
                <p className="font-bold text-white text-xs">Admin Démo</p>
                <p className="text-[10px] text-slate-500">Direction générale</p>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/connexion');
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Desktop Admin Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-slate-950/70 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            <span>Plateforme Démonstrateur • Environnement de Recrutement & Appel à Projets</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Système 100% Opérationnel
            </span>
            <button
              onClick={() => loginDemo('CLIENT').then(() => navigate('/mes-reservations'))}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition"
            >
              Basculer vue Client
            </button>
          </div>
        </header>

        {/* View outlet */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
};
