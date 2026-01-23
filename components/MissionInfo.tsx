import React from 'react';
import { MapPin, Music, Calendar, Clock } from 'lucide-react';

const MissionInfo: React.FC = () => {
  return (
    <section id="tour" className="py-24 px-4 relative bg-deep-stage">
      {/* Decorative Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-huntr-purple to-transparent"></div>

      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-orbitron font-black text-center text-white italic mb-16">
            DETAIL <span className="text-huntr-blue">MISI</span>
        </h2>

        <div className="flex flex-col gap-4">
            {/* Date Card */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#1a0b2e] to-[#0f0720] border border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between hover:border-huntr-pink transition-colors duration-300">
                <div className="flex items-center gap-6 mb-4 md:mb-0 w-full md:w-auto">
                    <div className="text-center min-w-[80px]">
                        <p className="font-orbitron text-huntr-pink text-3xl font-bold">01</p>
                        <p className="font-rajdhani text-gray-400 uppercase tracking-widest">FEB</p>
                    </div>
                    <div className="h-12 w-[1px] bg-white/20 hidden md:block"></div>
                    <div>
                        <h3 className="font-orbitron text-2xl text-white uppercase italic">Tanggal Misi</h3>
                        <div className="flex items-center gap-2 text-huntr-blue mt-1">
                            <Calendar size={16} />
                            <span className="font-rajdhani font-bold">MINGGU, 01 FEBRUARI 2026</span>
                        </div>
                    </div>
                </div>
                <div className="px-4 py-2 bg-white/5 rounded-full text-xs font-rajdhani text-gray-400 border border-white/10">
                    STATUS: WAJIB HADIR
                </div>
            </div>

            {/* Time Card */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#1a0b2e] to-[#0f0720] border border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between hover:border-huntr-blue transition-colors duration-300">
                 <div className="flex items-center gap-6 mb-4 md:mb-0 w-full md:w-auto">
                    <div className="text-center min-w-[80px]">
                        <p className="font-orbitron text-huntr-blue text-3xl font-bold">10</p>
                        <p className="font-rajdhani text-gray-400 uppercase tracking-widest">00</p>
                    </div>
                    <div className="h-12 w-[1px] bg-white/20 hidden md:block"></div>
                    <div>
                        <h3 className="font-orbitron text-2xl text-white uppercase italic">Waktu Operasi</h3>
                        <div className="flex items-center gap-2 text-huntr-purple mt-1">
                            <Clock size={16} />
                            <span className="font-rajdhani font-bold">10:00 - 12:00 WIB</span>
                        </div>
                    </div>
                </div>
                <div className="px-4 py-2 bg-huntr-blue/10 rounded-full text-xs font-rajdhani text-huntr-blue border border-huntr-blue/20 animate-pulse">
                    ON TIME
                </div>
            </div>

            {/* Location Card */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#1a0b2e] to-[#0f0720] border border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between hover:border-huntr-purple transition-colors duration-300">
                 <div className="flex items-center gap-6 mb-4 md:mb-0 w-full md:w-auto">
                    <div className="text-center min-w-[80px]">
                        <div className="bg-white/10 p-3 rounded-full inline-block">
                             <MapPin className="text-white" size={24} />
                        </div>
                    </div>
                    <div className="h-12 w-[1px] bg-white/20 hidden md:block"></div>
                    <div>
                        <h3 className="font-orbitron text-2xl text-white uppercase italic">Markas Pusat (McD Sumedang)</h3>
                        <div className="flex items-center gap-2 text-gray-400 mt-1">
                            <span className="font-rajdhani font-bold text-lg">McDonald's Sumedang</span>
                        </div>
                    </div>
                </div>
                <a 
                    href="https://maps.app.goo.gl/XP55FmjNVgxGVfx66" 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-6 py-3 bg-white text-black font-orbitron font-bold uppercase text-sm hover:bg-huntr-purple hover:text-white transition-colors skew-x-[-10deg] text-center"
                >
                    <span className="block skew-x-[10deg]">Buka Peta</span>
                </a>
            </div>
        </div>
      </div>
    </section>
  );
};

export default MissionInfo;