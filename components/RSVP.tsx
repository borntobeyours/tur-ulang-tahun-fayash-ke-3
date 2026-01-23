import React, { useState, useEffect } from 'react';
import { Ticket, ArrowRight } from 'lucide-react';

const RSVP: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    count: 1,
    song: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invite = params.get('invite');
    if (invite) {
      setFormData(prev => ({ ...prev, name: invite }));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
        setSubmitted(true);
    }, 1000);
  };

  if (submitted) {
    return (
        <section id="tickets" className="py-20 px-4 flex justify-center items-center min-h-[50vh] bg-[#0f0720]">
            <div className="relative glass-panel p-10 max-w-lg w-full text-center border-l-4 border-huntr-pink overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-huntr-pink opacity-20 rotate-45"></div>
                
                <Ticket size={48} className="mx-auto text-huntr-pink mb-4" />
                <h2 className="text-3xl font-orbitron font-bold text-white mb-2 uppercase italic">TIKET VIP DITERBITKAN</h2>
                <p className="font-rajdhani text-xl text-gray-300">Sampai jumpa di pesta, Hunter!</p>
                
                <div className="mt-8 border-2 border-dashed border-white/20 p-4 rounded bg-black/20">
                    <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2">ID Tiket</p>
                    <p className="font-orbitron text-2xl text-white tracking-widest">FAYASH-3RD-BDAY</p>
                </div>

                <button onClick={() => setSubmitted(false)} className="mt-8 text-sm text-gray-500 hover:text-white underline font-rajdhani">Isi data lagi</button>
            </div>
        </section>
    );
  }

  return (
    <section id="tickets" className="py-24 px-4 relative bg-deep-stage">
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#1a0b2e] rounded-xl overflow-hidden border border-white/10 shadow-2xl relative">
            {/* Top Bar */}
             <div className="bg-gradient-to-r from-huntr-purple to-huntr-pink h-2 w-full"></div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                <div className="space-y-2">
                    <label className="block font-orbitron text-xs text-huntr-blue uppercase tracking-widest">Nama Hunter (Tamu)</label>
                    <input 
                        required
                        type="text" 
                        className="w-full bg-black/40 border border-white/10 rounded p-4 text-white focus:border-huntr-pink focus:outline-none transition-colors font-rajdhani text-lg placeholder-gray-600"
                        placeholder="Nama Lengkap"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block font-orbitron text-xs text-neon-glow uppercase tracking-widest">Jumlah Tiket (Orang)</label>
                    <select 
                        className="w-full bg-black/40 border border-white/10 rounded p-4 text-white focus:border-neon-glow focus:outline-none font-rajdhani text-lg"
                        value={formData.count}
                        onChange={(e) => setFormData({...formData, count: Number(e.target.value)})}
                    >
                        {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num} className="bg-black text-white">{num} Tiket VIP{num > 1 ? 's' : ''}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block font-orbitron text-xs text-huntr-pink uppercase tracking-widest">Request Lagu</label>
                    <input 
                        type="text" 
                        className="w-full bg-black/40 border border-white/10 rounded p-4 text-white focus:border-huntr-pink focus:outline-none font-rajdhani text-lg placeholder-gray-600"
                        placeholder="Lagu apa yang asik?"
                        value={formData.song}
                        onChange={(e) => setFormData({...formData, song: e.target.value})}
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-white text-black py-5 font-orbitron font-black uppercase tracking-widest hover:bg-huntr-blue hover:text-white transition-all flex items-center justify-center gap-3 group mt-8 skew-x-[-5deg]"
                >
                    <span className="skew-x-[5deg] flex items-center gap-2">
                        Konfirmasi Hadir <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </button>
            </form>
        </div>
      </div>
    </section>
  );
};

export default RSVP;