import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  X, 
  Send, 
  Car, 
  Bot, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import { api } from '../../services/api';

export const RentalAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{
    sender: 'user' | 'ai';
    text: string;
    recommendations?: any[];
  }>>([
    {
      sender: 'ai',
      text: 'Bonjour ! Je suis l’assistant intelligent Hertz Digital. Décrivez-moi votre besoin en langage naturel (ex: "Je cherche une voiture automatique pour 4 personnes pendant 5 jours") et je vous trouverai le véhicule idéal.',
    }
  ]);

  const quickPrompts = [
    'SUV automatique pour 5 personnes pendant 5 jours',
    'Petite citadine économique et climatisée',
    'Berline de luxe pour rendez-vous d\'affaires'
  ];

  const handleSend = async (userText: string) => {
    const textToSend = userText.trim();
    if (!textToSend || isLoading) return;

    setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await api.queryClientAI(textToSend);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: response.answer,
          recommendations: response.recommendations,
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'Désolé, une erreur est survenue lors du traitement de votre demande. Veuillez réessayer.',
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating launcher button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 to-brand-500 hover:from-amber-400 hover:to-brand-400 text-black font-extrabold shadow-2xl flex items-center gap-2.5 group transition-all transform hover:scale-105"
        >
          <div className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-black animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <span className="text-xs uppercase tracking-wider">Rental AI Assistant</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-950/40 animate-ping" />
        </button>
      )}

      {/* Floating Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[95vw] sm:w-[420px] max-h-[85vh] h-[600px] glass-panel rounded-3xl border border-brand-500/30 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="px-5 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center text-black font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  Rental AI Assistant
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30">
                    DEMO
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400">Recherche intelligente en langage naturel</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand-500 text-black font-semibold rounded-br-none'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {/* Recommendations cards if present */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="w-full mt-3 space-y-2">
                    <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                      Véhicules recommandés :
                    </p>
                    {msg.recommendations.map((rec) => (
                      <div
                        key={rec.vehicleId}
                        className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-brand-500/40 transition flex items-center justify-between gap-3"
                      >
                        <img
                          src={rec.imageUrl}
                          alt={rec.model}
                          className="w-14 h-11 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-100 truncate">
                            {rec.brand} {rec.model}
                          </p>
                          <p className="text-[10px] text-brand-400 font-semibold truncate">
                            {rec.reason}
                          </p>
                          <p className="text-[11px] font-extrabold text-white">
                            {rec.pricePerDay.toLocaleString('fr-FR')} FCFA/j
                          </p>
                        </div>
                        <Link
                          to={`/vehicules/${rec.vehicleId}`}
                          onClick={() => setIsOpen(false)}
                          className="p-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-black shrink-0 transition"
                          title="Réserver ce véhicule"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                <Sparkles className="w-4 h-4 text-brand-400 animate-spin" />
                <span>L'assistant analyse votre demande...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts suggestions */}
          <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-900 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-300 hover:border-brand-500/50 hover:text-white transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(query);
            }}
            className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: SUV automatique pour 4 personnes..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="p-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-black font-bold transition shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
