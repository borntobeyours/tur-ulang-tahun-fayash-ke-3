import React, { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import Hero from './components/Hero';
import MissionInfo from './components/MissionInfo';
import PersonaGenerator from './components/PersonaGenerator';
import MiniGame from './components/MiniGame';
import SplashScreen from './components/SplashScreen';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleStart = () => {
    // Play music immediately with sound when user taps "TAP TO START"
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.volume = 1.0;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setShowSplash(false);
        })
        .catch((e) => {
          console.log("Play failed:", e);
          setShowSplash(false);
        });
    } else {
      setShowSplash(false);
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.muted = false;
        audioRef.current.volume = 1.0;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.log("Audio play failed:", e));
      }
    }
  };

  return (
    <>
      {/* Audio element always rendered for preloading */}
      <audio
        ref={audioRef}
        loop
        playsInline
        preload="auto"
        src="/song.mp3"
      />

      {showSplash ? (
        <SplashScreen onStart={handleStart} />
      ) : (
        <div className="min-h-screen bg-deep-stage text-white selection:bg-huntr-pink selection:text-white">

          {/* Navigation Bar */}
          <nav className="fixed top-0 left-0 w-full z-50 glass-panel border-b-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex-shrink-0 flex items-center gap-2">
                  <span className="font-orbitron font-black text-xl text-white tracking-widest italic">
                    FAYASH<span className="text-huntr-pink">/</span>3
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
      )}
    </>
  );
};

export default App;