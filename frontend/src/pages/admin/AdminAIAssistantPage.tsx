import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  TrendingUp, 
  Calendar, 
  Car, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight,
  Database
} from 'lucide-react';
import { api } from '../../services/api';

export const AdminAIAssistantPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{
    q: string;
    answer: string;
    dataSummary?: any;
    suggestedAction?: string;
  }>>([
    {
      q: 'Quel est le chiffre d\'affaires du mois ?',
      answer: 'Le chiffre d\'affaires total encaissé s\'élève actuellement à **18 450 000 FCFA** sur un total de 32 réservations confirmées en Mars 2026.',
      dataSummary: { totalCA: 18450000, volume: 32 },
      suggestedAction: 'Consulter l\'onglet Rapports financiers'
    }
  ]);

  const presetQuestions = [
    'Quelles sont les réservations impayées ?',
    'Quels véhicules sont disponibles actuellement ?',
    'Quel est le chiffre d\'affaires du mois ?',
    'Quel est le taux d\'utilisation de la flotte ?',
  ];

  const handleAsk = async (questionText: string) => {
    const text = questionText.trim();
    if (!text || loading) return;

    setLoading(true);
    setQuery('');

    try {
      const response = await api.queryAdminAI(text);
      setHistory(prev => [
        {
          q: text,
          answer: response.answer,
          dataSummary: response.dataSummary,
          suggestedAction: response.suggestedAction,
        },
        ...prev,
      ]);
    } catch (err: any) {
      setHistory(prev => [
        {
          q: text,
          answer: 'Erreur lors de l’interrogation des données internes : ' + err.message,
        },
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-white">Assistant Décisionnel IA</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
              MODULE DEMO IA
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Interrogez en direct la base de données opérationnelle en langage naturel.
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-brand-500 text-black font-extrabold flex items-center justify-center">
          <Bot className="w-6 h-6" />
        </div>
      </div>

      {/* Query Bar */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(query);
          }}
          className="flex items-center gap-3"
        >
          <div className="relative flex-1">
            <Bot className="w-5 h-5 text-brand-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Posez une question sur les finances, réservations, véhicules..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-brand-500 font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="px-6 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-black font-extrabold text-sm flex items-center gap-2 shadow-lg transition"
          >
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Interroger</span>
          </button>
        </form>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Questions types :</span>
          {presetQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleAsk(q)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Answers History */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-wider">
          Réponses & Insights Récents
        </h3>

        {history.map((item, idx) => (
          <div
            key={idx}
            className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Requête : "{item.q}"</span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed">
              {item.answer}
            </p>

            {item.dataSummary && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-brand-400" /> Données extraites en temps réel
                </p>
                <pre className="text-emerald-400 font-mono text-[11px] overflow-x-auto">
                  {JSON.stringify(item.dataSummary, null, 2)}
                </pre>
              </div>
            )}

            {item.suggestedAction && (
              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800">
                <span className="text-slate-400">Action recommandée :</span>
                <span className="font-bold text-white flex items-center gap-1">
                  {item.suggestedAction} <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
