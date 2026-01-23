import React, { useState, useRef, useEffect } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';
import Hero from './components/Hero';
import MissionInfo from './components/MissionInfo';
import PersonaGenerator from './components/PersonaGenerator';
import MiniGame from './components/MiniGame';

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed interaction required"));
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Auto-play attempt (often blocked by browsers until interaction, but good to try)
  useEffect(() => {
    const handleFirstClick = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
      document.removeEventListener('click', handleFirstClick);
    };
    document.addEventListener('click', handleFirstClick);
    return () => document.removeEventListener('click', handleFirstClick);
  }, []);

  return (
    <div className="min-h-screen bg-deep-stage text-white selection:bg-huntr-pink selection:text-white">
      {/* Background Music - Ganti src dengan link MP3 K-Pop instrumental pilihan Anda */}
      <audio ref={audioRef} loop src="https://assets.mixkit.co/music/preview/mixkit-tech-house-ibiza-sunset-131.mp3" />

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 glass-panel border-b-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="font-orbitron font-black text-xl text-white tracking-widest italic">
                HUNTR<span className="text-huntr-pink">/</span>X
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden lg:block">
              <div className="ml-10 flex items-baseline space-x-1">
                <a href="#tour" className="font-orbitron text-xs font-bold text-gray-400 hover:text-white px-3 py-2 transition-colors uppercase tracking-widest">Jadwal</a>
                <a href="#game" className="font-orbitron text-xs font-bold text-huntr-pink hover:text-white px-3 py-2 transition-colors uppercase tracking-widest border border-huntr-pink/30 rounded bg-huntr-pink/10 mx-2">Mini Game</a>
                <a href="#persona" className="font-orbitron text-xs font-bold text-gray-400 hover:text-white px-3 py-2 transition-colors uppercase tracking-widest">Persona</a>
              </div>
            </div>

            {/* Mobile Music Toggle */}
            <button 
              onClick={toggleMusic}
              className={`p-2 rounded-full border transition-all ${isPlaying ? 'border-huntr-pink text-huntr-pink shadow-[0_0_10px_rgba(244,114,182,0.5)]' : 'border-gray-600 text-gray-400'}`}
            >
              {isPlaying ? <Volume2 size={20} className="animate-pulse" /> : <VolumeX size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <main>
        <Hero />
        <MissionInfo />
        <MiniGame />
        <PersonaGenerator />
      </main>

      <footer className="py-12 text-center text-gray-500 font-rajdhani text-sm glass-panel bg-black/50 border-t border-white/5">
        <p>HUNTR/X WORLD TOUR © 2026</p>
        <p className="mt-2 text-xs opacity-50">DIBUAT OLEH TIM PRODUKSI (PAPI & MAMI)</p>
      </footer>
    </div>
  );
};

export default App;