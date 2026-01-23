import React, { useState, useRef } from 'react';
import { Camera, Wand2, Download, Upload, RefreshCw } from 'lucide-react';
import { editHunterImage } from '../services/genAi';

const HunterCam: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!selectedImage || !prompt) return;
    
    setLoading(true);
    try {
      const result = await editHunterImage(selectedImage, prompt);
      setResultImage(result);
    } catch (error) {
      alert("Gagal memproses gambar. Coba lagi ya!");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = 'hunter-transformation.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <section id="hunter-cam" className="py-24 px-4 bg-deep-stage relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-orbitron font-black mb-4 text-white uppercase italic">
          NANOTECH <span className="text-huntr-blue">ARMORY</span>
        </h2>
        <p className="font-rajdhani text-gray-300 mb-12 text-lg">
          Upload fotomu dan gunakan Nanobot AI untuk mengubah penampilanmu menjadi Hunter sejati!
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Input Section */}
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <div 
              className="aspect-square bg-black/40 rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-huntr-pink transition-colors relative overflow-hidden group"
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedImage ? (
                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6">
                  <Upload className="mx-auto text-gray-500 mb-2 group-hover:text-huntr-pink transition-colors" size={32} />
                  <p className="font-orbitron text-sm text-gray-400">Upload Foto Selfie</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-left text-xs font-orbitron text-huntr-blue mb-2 uppercase tracking-widest">
                  Perintah Nanobot
                </label>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Cth: Tambahkan kacamata neon..."
                  className="w-full bg-black/50 border border-white/20 p-3 rounded text-white font-rajdhani focus:outline-none focus:border-huntr-blue"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                {['Pakai kacamata cyberpunk', 'Ubah background jadi panggung konser', 'Rambut warna neon biru'].map((suggestion) => (
                  <button 
                    key={suggestion}
                    onClick={() => setPrompt(suggestion)}
                    className="text-[10px] px-2 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-gray-400 font-orbitron"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <button
                onClick={handleEdit}
                disabled={loading || !selectedImage || !prompt}
                className={`w-full py-4 bg-huntr-blue text-black font-orbitron font-black uppercase tracking-widest skew-x-[-5deg] hover:bg-white transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                    <>
                        <RefreshCw className="animate-spin" size={20} />
                        MEMPROSES...
                    </>
                ) : (
                    <>
                        <Wand2 size={20} />
                        AKTIFKAN EDIT
                    </>
                )}
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="glass-panel p-6 rounded-xl border border-white/10 relative min-h-[400px] flex flex-col">
            <h3 className="font-orbitron text-white text-lg mb-4 flex items-center gap-2">
                <Camera className="text-huntr-pink" size={20} />
                HASIL TRANSFORMASI
            </h3>
            
            <div className="flex-1 bg-black/40 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden relative">
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
                        <div className="w-16 h-16 border-4 border-huntr-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="font-orbitron text-huntr-blue animate-pulse">NANOBOTS BEKERJA...</p>
                    </div>
                )}
                
                {resultImage ? (
                    <img src={resultImage} alt="Result" className="w-full h-full object-contain" />
                ) : (
                    <p className="font-rajdhani text-gray-600 text-sm">
                        Hasil edit akan muncul di sini...
                    </p>
                )}
            </div>

            {resultImage && (
                <button
                    onClick={downloadImage}
                    className="mt-4 w-full py-3 border border-huntr-pink text-huntr-pink font-orbitron font-bold uppercase tracking-widest hover:bg-huntr-pink hover:text-white transition-all flex items-center justify-center gap-2"
                >
                    <Download size={18} />
                    SIMPAN FOTO
                </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HunterCam;