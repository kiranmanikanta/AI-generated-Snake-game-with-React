import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Headphones, Terminal, Trophy } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  return (
    <div id="app-root" className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 overflow-x-hidden font-sans atmosphere-bg">
      {/* Decorative Atmosphere Layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5" />
        <div className="absolute top-0 left-[20%] w-[1px] h-full bg-white/5" />
        <div className="absolute top-0 right-[20%] w-[1px] h-full bg-white/5" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 py-12 lg:py-20 flex flex-col gap-12 lg:gap-20">
        {/* Editorial Header (Recipe 2 inspiration) */}
        <header id="main-header" className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-cyan-500/10 border border-cyan-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse neon-glow-cyan" />
                <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-cyan-400">Live_Capture</span>
              </div>
              <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">S_ID: NEON_004</span>
            </div>
            
            <h1 id="app-title" className="text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.8] font-display text-glitch">
              NEON<br />
              <span className="text-cyan-500">BEATS+</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-row lg:flex-col items-center lg:items-end gap-10 lg:gap-6"
          >
            <div className="flex flex-col lg:items-end gap-1">
              <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 font-black">Score_Buffer</label>
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-pink-500 neon-glow-cyan" />
                <span id="score-display" className="text-5xl lg:text-6xl font-mono font-black text-pink-500 tracking-tighter leading-none">
                  {score.toString().padStart(4, '0')}
                </span>
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-end gap-1">
                <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/20">Active_Link</label>
                <div className="flex gap-1.5">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className={`w-3 h-1 rounded-sm ${i < 6 ? 'bg-cyan-500/40' : 'bg-white/5'}`} />
                    ))}
                </div>
            </div>
          </motion.div>
        </header>

        {/* Technical Data Grid Layout (Recipe 1 inspiration) */}
        <main id="app-content" className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* LEFT: Game Controls & Info */}
          <div className="lg:col-span-3 flex flex-col gap-10">
            <div className="flex flex-col gap-6">
                 <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-white/40" />
                    <h3 className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-white/60">Instructions</h3>
                 </div>
                 <div className="space-y-4">
                    {[
                        { key: '↑/↓/←/→', desc: 'Vector Control' },
                        { key: 'Yellow_ORB', desc: 'Core Expansion' },
                        { key: 'Self_HIT', desc: 'Fatal Termination' }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col gap-1 border-l border-white/10 pl-3">
                            <span className="text-[11px] font-mono font-black text-white uppercase">{item.key}</span>
                            <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">{item.desc}</span>
                        </div>
                    ))}
                 </div>
            </div>

            <div className="hardware-surface rounded-lg p-5 flex flex-col gap-4">
                <h4 className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-cyan-400">System_Metrics</h4>
                <div className="space-y-3">
                   {[
                      { label: 'Latency', val: '008MS' },
                      { label: 'Uptime', val: '100%' },
                      { label: 'Sync', val: 'SOLID' }
                   ].map((m, i) => (
                      <div key={i} className="flex justify-between items-center bg-white/[0.02] p-2 rounded">
                         <span className="text-[9px] font-mono text-white/30 uppercase">{m.label}</span>
                         <span className="text-[10px] font-mono text-white/80 font-bold">{m.val}</span>
                      </div>
                   ))}
                </div>
            </div>
          </div>

          {/* CENTER: Game Console */}
          <section id="game-section" className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping opacity-40" />
                <h2 className="text-[10px] font-mono uppercase tracking-[0.4em] font-black text-white/60">G_MODULE: NEON_CORE_v4.2</h2>
              </div>
              <span className="text-[9px] font-mono text-white/20">RC: 0x01FAC2</span>
            </div>
            
            <SnakeGame onScoreChange={setScore} />
            
            <div className="mt-4 flex gap-4 overflow-x-auto pb-2 no-scrollbar">
               {['#DEEP_DIVE', '#CYBER_PULSE', '#SIGNAL_SYNC'].map((tag, i) => (
                  <span key={i} className="whitespace-nowrap px-3 py-1 rounded-full border border-white/5 text-[9px] font-mono text-white/40 uppercase tracking-widest">
                    {tag}
                  </span>
               ))}
            </div>
          </section>

          {/* RIGHT: Audio Deck */}
          <aside id="audio-deck" className="lg:col-span-3 flex flex-col gap-6">
             <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-white/40" />
                <h3 className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-white/60">Neural_Deck</h3>
             </div>
             
             <MusicPlayer 
                currentTrackIndex={currentTrackIndex} 
                setCurrentTrackIndex={setCurrentTrackIndex} 
              />
          </aside>

        </main>

        <footer id="main-footer" className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-10">
              <p className="text-[9px] text-white/20 font-mono uppercase tracking-[0.3em]">© 2026 NEON_CORE_SYSTEMS</p>
              <div className="hidden md:flex gap-1">
                 {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-1 h-3 bg-white/5 skew-x-12" />
                 ))}
              </div>
          </div>
          
          <div className="flex gap-8 items-center">
            <span className="text-[9px] font-mono text-white/30 hover:text-cyan-500 cursor-pointer transition-colors uppercase tracking-widest">Data_Safety</span>
            <span className="text-[9px] font-mono text-white/30 hover:text-cyan-500 cursor-pointer transition-colors uppercase tracking-widest">Kernel_Info</span>
            <div className="w-10 h-10 rounded border border-white/5 flex items-center justify-center group cursor-pointer hover:border-cyan-500/40 transition-colors">
                <div className="w-1.5 h-1.5 bg-white/10 group-hover:bg-cyan-500 group-hover:neon-glow-cyan" />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

