import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  ShieldCheck, 
  User, 
  ArrowRight, 
  Sparkles,
  AlertCircle,
  Car
} from 'lucide-react';
import { useAuth } from '../store/useAuthStore';

export const LoginPage: React.FC = () => {
  const { loginManual, loginDemo, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const user = await loginManual({ email, password });
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/mes-reservations');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Identifiants incorrects.');
    }
  };

  const handleQuickDemo = async (role: 'ADMIN' | 'CLIENT') => {
    setErrorMsg(null);
    try {
      const user = await loginDemo(role);
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/mes-reservations');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la connexion démo.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      
      {/* Brand logo */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center text-black font-extrabold mx-auto shadow-xl shadow-brand-500/20">
          <Car className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-white">Connexion à votre espace</h1>
        <p className="text-xs text-slate-400">
          Accédez à vos réservations, factures et contrats de location
        </p>
      </div>

      {/* QUICK DEMO BUTTONS */}
      <div className="glass-panel rounded-3xl p-5 border border-amber-500/30 space-y-3 bg-amber-500/5">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Accès rapide Démonstrateur (1 Clic)</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Pour le recruteur ou comité d'évaluation, connectez-vous immédiatement sans mot de passe :
        </p>
        
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleQuickDemo('CLIENT')}
            disabled={isLoading}
            className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 hover:border-emerald-400 text-left transition group"
          >
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white group-hover:text-emerald-400">Client Démo</span>
            </div>
            <p className="text-[10px] text-slate-500">client@demo.local</p>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('ADMIN')}
            disabled={isLoading}
            className="p-3 rounded-xl bg-slate-900 border border-indigo-500/30 hover:border-indigo-400 text-left transition group"
          >
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white group-hover:text-indigo-400">Admin Démo</span>
            </div>
            <p className="text-[10px] text-slate-500">admin@demo.local</p>
          </button>
        </div>
      </div>

      {/* Standard Form */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-slate-400 font-bold uppercase mb-1">Adresse Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@demo.local"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-bold uppercase mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-50"
          >
            <span>{isLoading ? 'Connexion...' : 'Se connecter'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-800">
          <p>Comptes de test pré-configurés :</p>
          <p className="text-slate-500 mt-1 font-mono">
            Admin: admin@demo.local (Admin123!) • Client: client@demo.local (Client123!)
          </p>
        </div>
      </div>

    </div>
  );
};
