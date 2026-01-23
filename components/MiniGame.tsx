import React, { useState, useEffect, useRef } from 'react';
import { Ghost, Music, Trophy, Play, RotateCcw, Crosshair, Skull, Zap, AlertTriangle, Volume2, VolumeX, Loader2, Save, Info, HandMetal, MousePointer2 } from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { fetchLeaderboard, submitScoreToDb } from '../services/leaderboard';

const GRID_SIZE = 9;
const GAME_DURATION = 45; 
const TICK_RATE = 100; // Game loop tick every 100ms

type EnemyType = 'minion' | 'elite' | 'bonus';
type EnemyState = 'spawning' | 'active' | 'warning' | 'attacking';

interface Enemy {
    uuid: string;
    type: EnemyType;
    hp: number;
    maxHp: number;
    state: EnemyState;
    timer: number; // ticks remaining in current state
}

const MiniGame: React.FC = () => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [grid, setGrid] = useState<(Enemy | null)[]>(Array(GRID_SIZE).fill(null));
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Leaderboard State
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [isSavingScore, setIsSavingScore] = useState(false);
  const [playerName, setPlayerName] = useState('');
  
  // Game Loop Refs
  const gameStateRef = useRef<'menu' | 'playing' | 'gameover'>('menu');
  const gridRef = useRef<(Enemy | null)[]>(Array(GRID_SIZE).fill(null));
  const scoreRef = useRef(0);
  
  // Timers
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnTimerRef = useRef(0);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize AudioContext & Tutorial Check
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContext();
    }
    
    // Check tutorial
    const seen = localStorage.getItem('huntr_game_tutorial_seen');
    if (!seen) {
        setShowTutorial(true);
    }

    return () => {
        audioCtxRef.current?.close();
    }
  }, []);

  const handleCloseTutorial = () => {
    localStorage.setItem('huntr_game_tutorial_seen', 'true');
    setShowTutorial(false);
    playSound('start'); // Feedback sound
  };

  const playSound = (type: 'spawn' | 'hit' | 'kill' | 'warning' | 'damage' | 'start') => {
      if (!soundEnabled || !audioCtxRef.current) return;
      
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      
      switch (type) {
          case 'spawn':
              osc.type = 'sine';
              osc.frequency.setValueAtTime(600, now);
              osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
              gain.gain.setValueAtTime(0.05, now);
              gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
              osc.start(now);
              osc.stop(now + 0.1);
              break;
          case 'hit':
              osc.type = 'square'; // Crunchier sound
              osc.frequency.setValueAtTime(150, now);
              osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);
              gain.gain.setValueAtTime(0.05, now);
              gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
              osc.start(now);
              osc.stop(now + 0.08);
              break;
          case 'kill':
              osc.type = 'triangle';
              // Retro coin/pickup sound (two tones)
              osc.frequency.setValueAtTime(880, now); // A5
              osc.frequency.setValueAtTime(1760, now + 0.05); // A6
              gain.gain.setValueAtTime(0.05, now);
              gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
              osc.start(now);
              osc.stop(now + 0.15);
              break;
          case 'warning':
              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(200, now);
              osc.frequency.linearRampToValueAtTime(150, now + 0.2);
              gain.gain.setValueAtTime(0.03, now);
              gain.gain.linearRampToValueAtTime(0.001, now + 0.2);
              osc.start(now);
              osc.stop(now + 0.2);
              break;
          case 'damage':
              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(100, now);
              osc.frequency.exponentialRampToValueAtTime(10, now + 0.4);
              gain.gain.setValueAtTime(0.1, now);
              gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
              osc.start(now);
              osc.stop(now + 0.4);
              break;
          case 'start':
              osc.type = 'sine';
              osc.frequency.setValueAtTime(440, now);
              osc.frequency.linearRampToValueAtTime(880, now + 0.3);
              gain.gain.setValueAtTime(0.1, now);
              gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
              osc.start(now);
              osc.stop(now + 0.3);
              break;
      }
  };

  // Sync refs with state for rendering
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Load Leaderboard from "DB"
  useEffect(() => {
    const loadData = async () => {
        setIsLoadingLeaderboard(true);
        const data = await fetchLeaderboard();
        setLeaderboard(data);
        setIsLoadingLeaderboard(false);
    };
    loadData();
  }, []);

  const handleSaveScore = async () => {
    if (!playerName.trim() || isSavingScore) return;
    
    setIsSavingScore(true);
    const newEntry: LeaderboardEntry = {
      name: playerName.toUpperCase(),
      score: score,
      date: new Date().toISOString().split('T')[0]
    };

    try {
        const updatedLeaderboard = await submitScoreToDb(newEntry);
        setLeaderboard(updatedLeaderboard);
        setGameState('menu');
        setPlayerName('');
    } catch (e) {
        console.error("Failed to save", e);
    } finally {
        setIsSavingScore(false);
    }
  };

  // --- GAME LOGIC ---

  const startGame = () => {
    playSound('start');
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGrid(Array(GRID_SIZE).fill(null));
    gameStateRef.current = 'playing';
    setGameState('playing');
    spawnTimerRef.current = 0;

    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    gameLoopRef.current = setInterval(gameTick, TICK_RATE);
  };

  const stopGame = () => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    playSound('damage'); // Game over sound
    setGameState('gameover');
  };

  const gameTick = () => {
    if (gameStateRef.current !== 'playing') return;

    // 1. Update Time
    setTimeLeft(prev => {
        if (prev <= 0) {
            stopGame();
            return 0;
        }
        return prev - 0.1; // approximate 100ms
    });

    // 2. Spawner Logic
    spawnTimerRef.current -= TICK_RATE;
    if (spawnTimerRef.current <= 0) {
        spawnEnemy();
        // Randomize next spawn time (0.5s to 1.5s)
        spawnTimerRef.current = Math.random() * 1000 + 500;
    }

    // 3. Update Entities
    updateGridEntities();
  };

  const spawnEnemy = () => {
    const currentGrid = [...gridRef.current];
    const emptyIndices = currentGrid.map((e, i) => e === null ? i : -1).filter(i => i !== -1);
    
    if (emptyIndices.length === 0) return;

    const spawnIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    
    // Determine type
    const rand = Math.random();
    let type: EnemyType = 'minion';
    let hp = 1;
    let timer = 30; // 3 seconds to active

    if (rand > 0.85) {
        type = 'bonus'; // 15% chance
        timer = 20; // Disappears fast
    } else if (rand > 0.65) {
        type = 'elite'; // 20% chance
        hp = 3;
        timer = 40; // Durable
    }

    const newEnemy: Enemy = {
        uuid: Math.random().toString(36).substr(2, 9),
        type,
        hp,
        maxHp: hp,
        state: 'spawning',
        timer: 5 // 0.5s spawn animation
    };

    currentGrid[spawnIndex] = newEnemy;
    setGrid(currentGrid);
    playSound('spawn');
  };

  const updateGridEntities = () => {
    setGrid(prevGrid => {
        const nextGrid = [...prevGrid];
        let damageTaken = 0;
        let shouldPlayWarning = false;
        let shouldPlayDamage = false;

        nextGrid.forEach((enemy, index) => {
            if (!enemy) return;

            // AI Logic
            enemy.timer--;

            // State Transitions
            if (enemy.timer <= 0) {
                if (enemy.state === 'spawning') {
                    enemy.state = 'active';
                    // Set active duration based on type
                    enemy.timer = enemy.type === 'bonus' ? 15 : (enemy.type === 'elite' ? 40 : 30); 
                } else if (enemy.state === 'active') {
                    if (enemy.type === 'bonus') {
                        // Bonus just disappears
                        nextGrid[index] = null;
                    } else {
                        // Enemies get angry
                        enemy.state = 'warning';
                        enemy.timer = 15; // 1.5s warning
                        shouldPlayWarning = true;
                    }
                } else if (enemy.state === 'warning') {
                    enemy.state = 'attacking';
                    enemy.timer = 5; // 0.5s attack animation
                    shouldPlayDamage = true;
                } else if (enemy.state === 'attacking') {
                    // Deal Damage
                    damageTaken += (enemy.type === 'elite' ? 300 : 100);
                    nextGrid[index] = null; // Despawn
                }
            }

            // Elite Special Behavior: Random Move while idle
            if (enemy.type === 'elite' && enemy.state === 'active' && Math.random() < 0.02) {
                // Try move to adjacent
                const neighbors = getNeighbors(index);
                const emptyNeighbors = neighbors.filter(n => nextGrid[n] === null);
                if (emptyNeighbors.length > 0) {
                    const target = emptyNeighbors[Math.floor(Math.random() * emptyNeighbors.length)];
                    nextGrid[target] = enemy;
                    nextGrid[index] = null;
                }
            }
        });

        if (shouldPlayWarning) playSound('warning');
        if (shouldPlayDamage) playSound('damage');

        if (damageTaken > 0) {
            setScore(s => Math.max(0, s - damageTaken));
        }

        return nextGrid;
    });
  };

  const getNeighbors = (index: number) => {
      const neighbors = [];
      const row = Math.floor(index / 3);
      const col = index % 3;
      
      if (row > 0) neighbors.push(index - 3);
      if (row < 2) neighbors.push(index + 3);
      if (col > 0) neighbors.push(index - 1);
      if (col < 2) neighbors.push(index + 1);
      
      return neighbors;
  };

  const handleHit = (index: number) => {
    const currentGrid = [...gridRef.current];
    const enemy = currentGrid[index];

    if (!enemy || enemy.state === 'spawning') return;

    // Apply Damage
    enemy.hp--;

    // Visual feedback handled by render (hp bar update)
    
    if (enemy.hp <= 0) {
        // Kill
        let points = 100;
        if (enemy.type === 'elite') points = 500;
        if (enemy.type === 'bonus') points = 300;
        
        setScore(s => s + points);
        currentGrid[index] = null;
        playSound('kill');
    } else {
        playSound('hit');
        // Elite Hit but not dead (Panic Teleport)
        if (enemy.type === 'elite') {
            const emptyIndices = currentGrid.map((e, i) => e === null ? i : -1).filter(i => i !== -1);
            if (emptyIndices.length > 0) {
                const target = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
                currentGrid[target] = enemy;
                currentGrid[index] = null;
                enemy.state = 'warning'; // Angry after hit!
                enemy.timer = 10; // Fast attack incoming
                playSound('warning');
            }
        }
    }

    setGrid(currentGrid);
  };

  // --- ANIMATION HELPER ---
  const getEnemyAnimationClass = (enemy: Enemy) => {
      if (enemy.state === 'spawning') {
          return enemy.type === 'elite' ? 'anim-spawn-elite' : 'anim-spawn';
      }
      
      if (enemy.state === 'attacking') {
          return enemy.type === 'elite' ? 'anim-attack-elite text-red-600 z-30' : 'anim-attack-minion text-red-600 z-20';
      }
      
      if (enemy.state === 'warning') {
          return enemy.type === 'elite' ? 'anim-glitch' : 'anim-shake';
      }
      
      // Idle/Active States
      if (enemy.type === 'minion') return 'anim-float';
      if (enemy.type === 'elite') return 'anim-elite-idle';
      if (enemy.type === 'bonus') return 'animate-bounce'; // Tailwind bounce
      
      return '';
  };

  return (
    <section id="game" className="py-24 px-4 bg-[#0f0720] relative overflow-hidden select-none">
       {/* Background Grid */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="flex justify-center items-center gap-4 mb-4">
             <h2 className="text-4xl md:text-6xl font-orbitron font-black text-white uppercase italic">
            SHADOW <span className="text-huntr-pink">BEAT</span>
            </h2>
            <div className="flex gap-2">
                <button 
                    onClick={() => setShowTutorial(true)}
                    className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    title="Info & Tutorial"
                >
                    <Info size={24} className="text-huntr-blue" />
                </button>
                <button 
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    title={soundEnabled ? "Mute Sound" : "Enable Sound"}
                >
                    {soundEnabled ? <Volume2 size={24} className="text-huntr-blue" /> : <VolumeX size={24} className="text-gray-500" />}
                </button>
            </div>
        </div>
       
        <p className="font-rajdhani text-gray-300 mb-8 text-lg">
            MISI PENYELAMATAN KUE: Hajar Boss Pengacau (Merah) 3x sebelum mereka kabur!
        </p>

        {gameState === 'menu' && (
            <div className="glass-panel p-8 rounded-xl max-w-md mx-auto border-t-4 border-huntr-pink">
                <div className="mb-8">
                    <h3 className="font-orbitron text-xl text-huntr-blue mb-4 flex items-center justify-center gap-2">
                        <Trophy className="text-yellow-400" /> TOP RANK HUNTERS
                    </h3>
                    
                    {isLoadingLeaderboard ? (
                         <div className="flex flex-col items-center justify-center py-6 text-huntr-pink">
                            <Loader2 className="animate-spin mb-2" size={32} />
                            <span className="font-orbitron text-xs animate-pulse">CONNECTING TO DATABASE...</span>
                         </div>
                    ) : (
                        <div className="space-y-2">
                            {leaderboard.length === 0 && <p className="text-gray-500 font-rajdhani">Belum ada data</p>}
                            {leaderboard.map((entry, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded border border-white/10">
                                    <span className="font-orbitron text-sm text-gray-400">#{idx + 1} {entry.name}</span>
                                    <span className="font-rajdhani font-bold text-huntr-pink">{entry.score} PTS</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button 
                    onClick={startGame}
                    className="w-full py-4 bg-huntr-blue text-black font-orbitron font-black text-xl uppercase tracking-widest hover:bg-white hover:scale-105 transition-all skew-x-[-5deg] shadow-[0_0_20px_rgba(56,189,248,0.5)]"
                >
                    <span className="flex items-center justify-center gap-2 skew-x-[5deg]">
                        <Play fill="black" /> START MISSION
                    </span>
                </button>
            </div>
        )}

        {gameState === 'playing' && (
            <div className="max-w-md mx-auto">
                <div className="flex justify-between items-center mb-6 px-4">
                    <div className="text-left">
                        <p className="font-orbitron text-xs text-gray-400">SKOR</p>
                        <p className="font-rajdhani text-3xl font-bold text-huntr-pink">{score}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-orbitron text-xs text-gray-400">WAKTU</p>
                        <p className={`font-rajdhani text-3xl font-bold ${Math.ceil(timeLeft) < 10 ? 'text-red-500 animate-pulse' : 'text-huntr-blue'}`}>
                            {Math.ceil(timeLeft)}s
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 bg-black/40 rounded-xl border border-white/10 backdrop-blur-sm relative">
                    {grid.map((enemy, index) => (
                        <div 
                            key={index}
                            onMouseDown={() => handleHit(index)}
                            onTouchStart={(e) => { e.preventDefault(); handleHit(index); }}
                            className={`
                                aspect-square rounded-lg border-2 relative cursor-pointer transition-all duration-100 overflow-hidden
                                flex items-center justify-center
                                ${!enemy ? 'bg-white/5 border-white/10' : ''}
                                ${enemy?.state === 'attacking' ? 'bg-red-500/50 border-red-500' : ''}
                                ${enemy?.state === 'warning' ? 'bg-yellow-500/20 border-yellow-500' : ''}
                                ${enemy?.type === 'elite' && enemy.state !== 'attacking' ? 'bg-red-900/30 border-red-500' : ''}
                                ${enemy?.type === 'minion' && enemy.state !== 'attacking' ? 'bg-huntr-purple/20 border-huntr-purple' : ''}
                                ${enemy?.type === 'bonus' ? 'bg-huntr-blue/20 border-huntr-blue' : ''}
                            `}
                        >
                            {enemy && (
                                <div className={`relative w-full h-full flex items-center justify-center ${getEnemyAnimationClass(enemy)}`}>
                                    {/* Icon based on type */}
                                    {enemy.type === 'bonus' && <Music size={40} className="text-huntr-blue drop-shadow-[0_0_10px_rgba(56,189,248,1)]" />}
                                    {enemy.type === 'minion' && <Ghost size={40} className="text-huntr-purple drop-shadow-[0_0_10px_rgba(124,58,237,1)]" />}
                                    {enemy.type === 'elite' && <Skull size={44} className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,1)]" />}

                                    {/* Warning Indicator */}
                                    {enemy.state === 'warning' && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                                            <AlertTriangle size={20} className="text-yellow-400 animate-bounce" />
                                        </div>
                                    )}

                                    {/* Elite HP Bar */}
                                    {enemy.type === 'elite' && (
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-gray-700 rounded-full overflow-hidden border border-white/30">
                                            <div 
                                                className="h-full bg-red-500 transition-all duration-200"
                                                style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
                                            />
                                        </div>
                                    )}

                                    {/* Attack Effect Overlay */}
                                    {enemy.state === 'attacking' && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Zap size={60} className="text-yellow-400 animate-ping opacity-80" />
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {/* Empty state crosshair */}
                            {!enemy && (
                                <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
                                    <Crosshair size={40} className="text-white" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex justify-between text-xs font-rajdhani text-gray-400">
                     <span>HINT: Pukul Boss 3x atau dia akan kabur!</span>
                     <span>AWAS: Jangan biarkan monster menyerang!</span>
                </div>
            </div>
        )}

        {gameState === 'gameover' && (
             <div className="glass-panel p-8 rounded-xl max-w-md mx-auto border-t-4 border-red-500">
                <h3 className="font-orbitron text-4xl text-white mb-2">MISSION COMPLETE</h3>
                <p className="font-rajdhani text-gray-400 mb-6">Skor Akhir Kamu</p>
                
                <div className="text-6xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-b from-huntr-pink to-purple-600 mb-8">
                    {score}
                </div>

                <div className="mb-6">
                    <label className="block text-left text-xs font-orbitron text-huntr-blue mb-2">MASUKKAN NAMA AGENT</label>
                    <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="NAMA KAMU..."
                        maxLength={12}
                        disabled={isSavingScore}
                        className="w-full bg-black/50 border border-white/20 p-3 rounded text-white font-rajdhani focus:outline-none focus:border-huntr-blue text-center uppercase text-xl disabled:opacity-50"
                    />
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={startGame}
                        disabled={isSavingScore}
                        className="flex-1 py-3 bg-white/10 border border-white/20 text-white font-orbitron text-sm hover:bg-white/20 rounded disabled:opacity-50"
                    >
                        <RotateCcw className="mx-auto mb-1" size={16} />
                        MAIN LAGI
                    </button>
                    <button 
                        onClick={handleSaveScore}
                        disabled={!playerName || isSavingScore}
                        className="flex-[2] py-3 bg-huntr-pink text-white font-orbitron font-bold text-sm hover:bg-pink-600 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSavingScore ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        {isSavingScore ? 'SAVING...' : 'SIMPAN KE DB'}
                    </button>
                </div>
            </div>
        )}

        {/* TUTORIAL OVERLAY */}
        {showTutorial && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-[#1a0b2e] border border-huntr-blue max-w-sm w-full rounded-2xl p-6 relative shadow-[0_0_50px_rgba(56,189,248,0.3)]">
                    <div className="text-center mb-6">
                        <h3 className="font-orbitron text-2xl text-huntr-pink italic font-black mb-1">TRAINING MANUAL</h3>
                        <p className="font-rajdhani text-gray-400 text-sm uppercase tracking-widest">INSTRUKSI MISI HUNTER</p>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-4 bg-white/5 p-3 rounded-lg border border-white/10">
                            <div className="w-12 h-12 bg-huntr-purple/20 rounded-full flex items-center justify-center text-huntr-purple shrink-0">
                                <MousePointer2 size={24} />
                            </div>
                            <div className="text-left">
                                <p className="font-orbitron text-white text-sm font-bold">KETUK LAWAN</p>
                                <p className="font-rajdhani text-gray-400 text-xs">Tap monster secepatnya untuk menyerang.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white/5 p-3 rounded-lg border border-white/10">
                            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 shrink-0">
                                <AlertTriangle size={24} />
                            </div>
                            <div className="text-left">
                                <p className="font-orbitron text-white text-sm font-bold">HINDARI SERANGAN</p>
                                <p className="font-rajdhani text-gray-400 text-xs">Jika mereka jadi Merah, mereka akan menyerangmu!</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white/5 p-3 rounded-lg border border-white/10">
                            <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center text-yellow-400 shrink-0">
                                <Skull size={24} />
                            </div>
                            <div className="text-left">
                                <p className="font-orbitron text-white text-sm font-bold">BOSS BATTLE</p>
                                <p className="font-rajdhani text-gray-400 text-xs">Boss (Tengkorak) sangat kuat. Pukul 3x!</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleCloseTutorial}
                        className="w-full py-3 bg-huntr-blue text-black font-orbitron font-bold uppercase hover:bg-white transition-colors rounded skew-x-[-5deg]"
                    >
                        <span className="block skew-x-[5deg]">SIAP LAKSANAKAN</span>
                    </button>
                </div>
            </div>
        )}
      </div>
      <style>{`
        .anim-spawn {
            animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .anim-spawn-elite {
            animation: swirl-in 0.6s ease-out forwards;
        }
        
        .anim-float {
            animation: ghost-float 2s ease-in-out infinite;
        }
        .anim-elite-idle {
            animation: elite-pulse 1.5s ease-in-out infinite;
        }
        
        .anim-shake {
            animation: shake 0.4s ease-in-out infinite;
        }
        .anim-glitch {
            animation: glitch 0.3s linear infinite;
        }
        
        .anim-attack-minion {
            animation: attack-lunge 0.3s ease-in forwards;
        }
        .anim-attack-elite {
            animation: attack-slam 0.5s ease-in forwards;
        }

        @keyframes pop-in {
            0% { transform: scale(0); opacity: 0; }
            80% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
        }
        @keyframes swirl-in {
            0% { transform: scale(0) rotate(-180deg); opacity: 0; }
            100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes ghost-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
        }
        @keyframes elite-pulse {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(239,68,68,0.5)); }
            50% { transform: scale(1.05); filter: drop-shadow(0 0 15px rgba(239,68,68,0.8)); }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px) rotate(-5deg); }
            75% { transform: translateX(4px) rotate(5deg); }
        }
        @keyframes glitch {
            0% { transform: translate(0); opacity: 1; }
            20% { transform: translate(-2px, 2px); opacity: 0.8; }
            40% { transform: translate(-2px, -2px); opacity: 1; }
            60% { transform: translate(2px, 2px); opacity: 0.8; }
            80% { transform: translate(2px, -2px); opacity: 1; }
            100% { transform: translate(0); opacity: 1; }
        }
        @keyframes attack-lunge {
            0% { transform: scale(1); }
            50% { transform: scale(1.4) translateY(15px); }
            100% { transform: scale(1); }
        }
        @keyframes attack-slam {
            0% { transform: scale(1); }
            40% { transform: scale(1.6) translateY(-10px); }
            60% { transform: scale(1.6) translateY(20px); }
            100% { transform: scale(1); }
        }
      `}</style>
    </section>
  );
};

export default MiniGame;