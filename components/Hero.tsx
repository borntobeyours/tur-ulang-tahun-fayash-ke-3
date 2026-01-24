import React, { useEffect, useState } from 'react';

const Hero: React.FC = () => {
    const [guestName, setGuestName] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        // Support 'name' parameter for personalization, fallback to 'invite'
        const nameParam = params.get('name') || params.get('invite');
        if (nameParam) {
            setGuestName(nameParam);
        }

        // Set target date: Feb 1, 2026 10:00:00
        const targetDate = new Date('2026-02-01T10:00:00').getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(interval);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-20 bg-stage-gradient">
            {/* Concert Spotlights */}
            <div className="absolute top-[-50%] left-[20%] w-[200px] h-[1000px] bg-huntr-purple opacity-20 rotate-[-25deg] blur-[50px] animate-spotlight"></div>
            <div className="absolute top-[-50%] right-[20%] w-[200px] h-[1000px] bg-huntr-pink opacity-20 rotate-[25deg] blur-[50px] animate-spotlight" style={{ animationDelay: '1s' }}></div>

            {/* Background Particles/Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

            <div className="z-10 text-center px-4 relative w-full">
                <div className="mb-4">
                    <h2 className="font-orbitron text-huntr-blue tracking-[0.5em] text-sm md:text-lg animate-pulse uppercase">
                        Misi Rahasia Dimulai
                    </h2>
                </div>

                <div className="relative mb-6 group">
                    {/* The "HUNTR/X" style logo effect */}
                    <h1 className="font-orbitron text-6xl md:text-9xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-[0_0_25px_rgba(168,85,247,0.8)] transform -skew-x-12">
                        FAYASH<span className="text-huntr-pink mx-1 relative inline-block">/</span>3
                    </h1>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full">
                        <p className="font-rajdhani text-xl md:text-3xl font-bold text-huntr-pink tracking-widest uppercase text-glow bg-black/50 inline-block px-4 backdrop-blur-sm">
                            TUR ULANG TAHUN FAYASH KE-3
                        </p>
                    </div>
                </div>

                {guestName ? (
                    <div className="mt-8 mb-8 animate-bounce">
                        <div className="inline-block px-6 py-3 border-2 border-huntr-blue rounded-full bg-black/60 backdrop-blur-md transform -skew-x-12 shadow-[0_0_20px_rgba(56,189,248,0.6)]">
                            <p className="font-orbitron text-white text-sm md:text-xl skew-x-12 uppercase tracking-wide">
                                HI <span className="text-huntr-blue font-bold text-lg md:text-2xl mx-1">{guestName}</span>,
                                <span className="block md:inline md:ml-1">KAMU DIUNDANG UNTUK BERGABUNG!</span>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 mb-8">
                        <div className="inline-block px-6 py-2 border-2 border-white/10 rounded-full bg-black/40 backdrop-blur-md transform -skew-x-12">
                            <p className="font-orbitron text-gray-400 text-sm md:text-base skew-x-12 uppercase tracking-widest">
                                PANGGILAN UNTUK SEMUA HUNTER
                            </p>
                        </div>
                    </div>
                )}

                {/* COUNTDOWN TIMER */}
                <div className="max-w-3xl mx-auto grid grid-cols-4 gap-2 md:gap-6 mb-12 px-4">
                    {[
                        { label: 'HARI', value: timeLeft.days },
                        { label: 'JAM', value: timeLeft.hours },
                        { label: 'MENIT', value: timeLeft.minutes },
                        { label: 'DETIK', value: timeLeft.seconds }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-black/40 border border-white/10 backdrop-blur-sm p-2 md:p-4 rounded-lg flex flex-col items-center justify-center relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-huntr-pink to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <span className="font-orbitron text-2xl md:text-4xl font-black text-white">{String(item.value).padStart(2, '0')}</span>
                            <span className="font-rajdhani text-[10px] md:text-xs text-huntr-blue tracking-widest mt-1">{item.label}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-6 max-w-lg mx-auto glass-panel p-6 rounded-xl border-t border-huntr-purple mb-8">
                    <div className="flex justify-between items-center text-sm font-rajdhani text-gray-300 mb-2 border-b border-white/10 pb-2">
                        <span>FEBRUARI 2026</span>
                        <span>AKSES VIP</span>
                    </div>
                    <p className="font-rajdhani text-lg md:text-xl text-white leading-relaxed">
                        Monster kegelapan mencoba mengacaukan pesta! Fayash butuh bantuanmu untuk misi penyelamatan kue ulang tahun.
                    </p>
                    <p className="mt-2 text-huntr-pink font-bold font-rajdhani italic">
                        Apakah kamu siap bergabung?
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-6 justify-center items-center pb-8">
                    <a href="#tour" className="relative group px-10 py-4 bg-huntr-pink text-white font-black font-orbitron uppercase tracking-widest skew-x-[-10deg] hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(244,114,182,0.6)]">
                        <span className="block skew-x-[10deg]">Lihat Lokasi</span>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </a>
                    <a href="#game" className="relative group px-10 py-4 bg-transparent border-2 border-huntr-blue text-huntr-blue font-black font-orbitron uppercase tracking-widest skew-x-[-10deg] hover:bg-huntr-blue hover:text-black transition-all duration-300">
                        <span className="block skew-x-[10deg]">Cek Kekuatanmu</span>
                    </a>
                </div>
            </div>

            {/* Decorative Bottom Fade */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-deep-stage to-transparent"></div>
        </section>
    );
};

export default Hero;