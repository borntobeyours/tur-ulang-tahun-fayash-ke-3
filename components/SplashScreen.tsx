import React, { useState } from 'react';
import { Headphones, Sparkles, Zap } from 'lucide-react';

interface SplashScreenProps {
    onStart: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
    const [isExiting, setIsExiting] = useState(false);

    const handleStart = () => {
        setIsExiting(true);
        // Allow animation to complete before calling onStart
        setTimeout(() => {
            onStart();
        }, 800);
    };

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-all duration-700
        ${isExiting ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}
            style={{
                background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a1f 50%, #0f0a15 100%)',
            }}
        >
            {/* Animated Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Glowing orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-huntr-pink/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-huntr-pink/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

                {/* Animated lines */}
                <div className="absolute inset-0">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute h-px bg-gradient-to-r from-transparent via-huntr-pink/50 to-transparent"
                            style={{
                                top: `${20 + i * 15}%`,
                                left: '-100%',
                                right: '-100%',
                                animation: `slideRight ${3 + i * 0.5}s linear infinite`,
                                animationDelay: `${i * 0.3}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Floating particles */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-huntr-pink rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                            animationDelay: `${Math.random() * 2}s`,
                            opacity: 0.3 + Math.random() * 0.5,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-6">
                {/* Logo/Title */}
                <div className="mb-8 relative">
                    <Sparkles className="absolute -top-6 -left-4 text-huntr-pink animate-pulse" size={24} />
                    <Sparkles className="absolute -top-4 -right-2 text-purple-400 animate-pulse" size={16} style={{ animationDelay: '0.5s' }} />

                    <h1 className="font-orbitron font-black text-5xl md:text-7xl text-white tracking-wider mb-2">
                        FAYASH<span className="text-huntr-pink">/</span>3
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                        <Zap size={16} className="text-huntr-pink" />
                        <span className="font-rajdhani text-sm md:text-base tracking-[0.3em] uppercase">World Tour 2026</span>
                        <Zap size={16} className="text-huntr-pink" />
                    </div>
                </div>

                {/* Subtitle */}
                <p className="font-rajdhani text-lg md:text-xl text-gray-300 mb-12 tracking-wide">
                    Undangan Spesial Ulang Tahun Ke-3
                </p>

                {/* Start Button */}
                <button
                    onClick={handleStart}
                    className="group relative inline-flex items-center gap-4 px-10 py-5 
            bg-gradient-to-r from-huntr-pink via-pink-500 to-huntr-pink bg-[length:200%_100%]
            rounded-full font-orbitron font-bold text-lg md:text-xl text-white uppercase tracking-widest
            transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(244,114,182,0.6)]
            animate-gradient-x"
                    style={{
                        boxShadow: '0 0 30px rgba(244, 114, 182, 0.4), inset 0 0 20px rgba(255,255,255,0.1)',
                    }}
                >
                    <Headphones size={28} className="animate-bounce" />
                    <span>TAP TO START</span>

                    {/* Ripple effect */}
                    <div className="absolute inset-0 rounded-full border-2 border-huntr-pink/50 animate-ping opacity-75" />
                </button>

                {/* Hint text */}
                <p className="mt-8 font-rajdhani text-sm text-gray-500 animate-pulse">
                    🎵 Musik akan langsung diputar 🎵
                </p>
            </div>

            {/* Bottom decoration */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="w-2 h-2 bg-huntr-pink/50 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                    />
                ))}
            </div>

            {/* Inline styles for custom animations */}
            <style>{`
        @keyframes slideRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
        </div>
    );
};

export default SplashScreen;
