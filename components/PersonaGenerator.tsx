import React, { useState, useEffect } from 'react';
import { generateHunterPersona } from '../services/genAi';
import { HunterPersona } from '../types';
import { Sparkles, Sword, Shirt, Zap, Crown } from 'lucide-react';

const PersonaGenerator: React.FC = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState<HunterPersona | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get('name') || params.get('invite');
    if (nameParam) {
      setName(nameParam);
    }
  }, []);

  const handleGenerate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setPersona(null);
    const result = await generateHunterPersona(name);
    setPersona(result);
    setLoading(false);
  };

  return (
    <section id="persona" className="py-24 px-4 bg-[#0f0720] relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-huntr-purple opacity-20 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-huntr-blue opacity-20 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-orbitron font-black mb-4 text-white uppercase italic">
          GABUNG <span className="text-huntr-pink">SQUAD</span>
        </h2>
        <p className="font-rajdhani text-gray-300 mb-12 text-lg">
          Cek identitas rahasia kamu dan bersiaplah untuk pesta.
        </p>

        <div className="flex flex-col md:flex-row gap-0 justify-center mb-16 max-w-lg mx-auto shadow-2xl">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ketik Nama Kamu"
            className="flex-1 bg-white/5 border border-white/20 p-4 text-white font-orbitron focus:outline-none focus:border-huntr-pink transition-colors backdrop-blur-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !name}
            className={`px-8 py-4 bg-gradient-to-r from-huntr-purple to-huntr-pink text-white font-orbitron font-bold uppercase transition-all ${loading ? 'opacity-50' : 'hover:brightness-110'}`}
          >
            {loading ? 'Scanning...' : 'Cek Kekuatan'}
          </button>
        </div>

        {persona && (
          <div className="flex justify-center perspective-1000">
             {/* Character Card */}
            <div className="relative w-[320px] md:w-[380px] bg-black rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(124,58,237,0.4)] group hover:scale-105 transition-transform duration-500">
                
                {/* Card Header Image Area */}
                <div className="h-48 bg-gradient-to-br from-huntr-purple via-black to-huntr-blue relative overflow-hidden">
                    <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
                        <div className="flex items-center gap-2 mb-1">
                            {persona.squadPosition === 'Leader' && <Crown size={16} className="text-yellow-400" />}
                            <span className="text-huntr-blue font-orbitron text-xs tracking-widest uppercase">{persona.squadPosition}</span>
                        </div>
                        <h3 className="text-4xl font-orbitron font-black text-white italic uppercase text-glow">{persona.stageName}</h3>
                    </div>
                    {/* Floating Element */}
                    <div className="absolute top-4 right-4 animate-pulse">
                         <div className="w-3 h-3 rounded-full" style={{backgroundColor: persona.auraColor, boxShadow: `0 0 10px ${persona.auraColor}`}}></div>
                    </div>
                </div>

                {/* Card Stats */}
                <div className="p-6 space-y-4 text-left bg-black/80 backdrop-blur">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-white/5 rounded text-huntr-pink">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-orbitron">Peran</p>
                            <p className="text-white font-rajdhani font-bold text-lg leading-tight">{persona.role}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-white/5 rounded text-huntr-blue">
                            <Sword size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-orbitron">Senjata</p>
                            <p className="text-white font-rajdhani font-bold text-lg leading-tight">{persona.weapon}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-white/5 rounded text-neon-glow">
                            <Shirt size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-orbitron">Kostum</p>
                            <p className="text-gray-300 font-rajdhani text-sm leading-tight">{persona.fashionStyle}</p>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10">
                        <div className="flex justify-between items-center">
                            <span className="font-orbitron text-xs text-gray-500">JURUS ANDALAN</span>
                            <span className="font-rajdhani font-bold text-huntr-pink flex items-center gap-1">
                                <Zap size={14} /> {persona.specialMove}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PersonaGenerator;