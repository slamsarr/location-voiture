import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Car, 
  ShoppingBag, 
  User, 
  ShieldCheck, 
  Menu, 
  X, 
  Sparkles, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useCart } from '../../store/useCartStore';
import { useAuth } from '../../store/useAuthStore';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { hasItems } = useCart();
  const { user, isAdmin, logout, loginDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDemoSwitch = async (role: 'ADMIN' | 'CLIENT') => {
    await loginDemo(role);
    setUserMenuOpen(false);
    if (role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/mes-reservations');
    }
  };

  const navLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'La Flotte', path: '/vehicules' },
    { label: 'Agences Sénégal', path: '/#agences-senegal' },
    { label: 'Comment ça marche', path: '/#etapes' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#07090E]/85 border-b border-white/[0.06] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Prestige */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D8C59A] via-[#B89B5F] to-[#8E703B] flex items-center justify-center shadow-lg shadow-gold-500/10 group-hover:scale-[1.03] transition-transform duration-300">
              <Car className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-wider text-white">HERTZ</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#B89B5F]/15 text-[#D8C59A] border border-[#B89B5F]/30 tracking-widest uppercase">
                  DIGITAL
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                Location Automobile de Prestige
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs uppercase tracking-widest font-semibold transition-colors duration-200 hover:text-[#D8C59A] ${
                  location.pathname === link.path ? 'text-[#D8C59A] font-bold' : 'text-slate-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Panier */}
            <Link
              to="/panier"
              className="relative p-2.5 rounded-xl bg-[#0F1420] border border-white/[0.07] text-slate-300 hover:text-white hover:border-[#B89B5F]/40 transition"
              title="Mon panier"
            >
              <ShoppingBag className="w-4 h-4" />
              {hasItems && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#B89B5F] text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-md">
                  1
                </span>
              )}
            </Link>

            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#0F1420] border border-white/[0.07] text-xs font-medium hover:border-[#B89B5F]/40 transition"
              >
                <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-indigo-400' : user ? 'bg-[#B89B5F]' : 'bg-slate-500'}`} />
                <span className="text-[11px] text-slate-300 tracking-wide">
                  {isAdmin ? 'Admin' : user ? 'Client' : 'Mode Démo'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 glass-dropdown rounded-2xl p-2 z-50 text-slate-200 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bascule Démo Rapide</p>
                    <p className="text-[11px] text-slate-500">Un clic pour basculer de rôle</p>
                  </div>

                  <button
                    onClick={() => handleDemoSwitch('CLIENT')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/[0.04] flex items-center justify-between transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-[#D8C59A]" />
                      <div>
                        <p className="font-semibold text-xs text-slate-200 group-hover:text-[#D8C59A]">Compte Client</p>
                        <p className="text-[10px] text-slate-500">client@demo.local</p>
                      </div>
                    </div>
                    {user?.role === 'CLIENT' && <span className="text-[10px] bg-[#B89B5F]/20 text-[#D8C59A] px-1.5 py-0.5 rounded font-bold">Actif</span>}
                  </button>

                  <button
                    onClick={() => handleDemoSwitch('ADMIN')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/[0.04] flex items-center justify-between transition group mt-1"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-400" />
                      <div>
                        <p className="font-semibold text-xs text-slate-200 group-hover:text-indigo-400">Compte Admin / Back-Office</p>
                        <p className="text-[10px] text-slate-500">admin@demo.local</p>
                      </div>
                    </div>
                    {isAdmin && <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-bold">Actif</span>}
                  </button>

                  {user && (
                    <div className="border-t border-white/[0.06] mt-2 pt-1">
                      <Link
                        to="/profil"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-slate-300 hover:bg-white/[0.04] flex items-center gap-2 text-xs"
                      >
                        <User className="w-3.5 h-3.5 text-[#D8C59A]" />
                        Mon Profil
                      </Link>
                      <Link
                        to="/mes-reservations"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-slate-300 hover:bg-white/[0.04] flex items-center gap-2 text-xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#D8C59A]" />
                        Mes Réservations
                      </Link>
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 text-xs"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Déconnexion
                      </button>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Back-office direct shortcut */}
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] text-[11px] font-semibold text-slate-300 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D8C59A]" />
              <span>Back-Office</span>
            </Link>

            {/* CTA Réservation */}
            <Link
              to="/vehicules"
              className="btn-luxe-primary px-5 py-2 rounded-xl text-xs uppercase tracking-wider font-extrabold flex items-center gap-2"
            >
              <span>Réserver</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <Link to="/panier" className="relative p-2 text-slate-300">
              <ShoppingBag className="w-5 h-5" />
              {hasItems && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#B89B5F] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  1
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-dropdown border-t border-white/[0.06] px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-200 hover:text-[#D8C59A]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/mes-reservations"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-200 hover:text-[#D8C59A]"
          >
            Mes réservations
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#D8C59A]"
          >
            Accès Back-Office Admin
          </Link>
          <div className="pt-3 border-t border-white/[0.06] flex gap-2">
            <button
              onClick={() => { handleDemoSwitch('CLIENT'); setMobileMenuOpen(false); }}
              className="flex-1 py-2 text-xs font-bold rounded-lg bg-white/[0.04] text-[#D8C59A] border border-white/[0.08]"
            >
              Démo Client
            </button>
            <button
              onClick={() => { handleDemoSwitch('ADMIN'); setMobileMenuOpen(false); }}
              className="flex-1 py-2 text-xs font-bold rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
            >
              Démo Admin
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
