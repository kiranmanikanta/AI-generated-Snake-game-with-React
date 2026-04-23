import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TRACKS } from '../constants';
import { Track } from '../types';

interface MusicPlayerProps {
  currentTrackIndex: number;
  setCurrentTrackIndex: (index: number) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ currentTrackIndex, setCurrentTrackIndex }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  const handleTogglePlay = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    setCurrentTrackIndex((currentTrackIndex + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((currentTrackIndex - 1 + TRACKS.length) % TRACKS.length);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="music-player-hardware" className="hardware-surface rounded-xl p-8 w-full max-w-sm flex flex-col gap-8">
      <audio ref={audioRef} src={currentTrack.url} />
      
      {/* Header Area */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Neural Audio Engine</label>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center neon-glow-cyan">
            <Music className="text-cyan-400 w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTrack.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
              >
                <h3 className="text-white font-black truncate text-base font-display uppercase tracking-tight">{currentTrack.title}</h3>
                <span className="text-cyan-400/60 font-mono uppercase tracking-widest text-[9px]">{currentTrack.artist}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Radial Visualization Mockup or Progress Buffer */}
      <div className="relative aspect-video rounded-lg border border-white/5 bg-black/50 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 atmosphere-bg opacity-30" />
        <div className="relative flex items-center justify-center p-4">
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center animate-[spin_20s_linear_infinite]">
            <div className="w-16 h-16 rounded-full border border-cyan-500/30 flex items-center justify-center">
              <div className="w-1 h-1 bg-cyan-400 rounded-full neon-glow-cyan" />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="text-[10px] font-mono text-cyan-400/80 tracking-widest">{isPlaying ? "SIGNAL_ACTIVE" : "ENGINE_IDLE"}</div>
          </div>
        </div>
      </div>

      {/* Progress & Time */}
      <div className="flex flex-col gap-3">
        <div className="relative h-1 w-full bg-white/5 rounded-full">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)]" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center h-4">
          <span className="text-[10px] font-mono text-white/40 tracking-wider font-bold">{formatTime(audioRef.current?.currentTime || 0)}</span>
          <div className="flex gap-1">
             {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-1 h-1 rounded-full ${i/5 < progress/100 ? 'bg-cyan-500 neon-glow-cyan' : 'bg-white/10'}`} />
             ))}
          </div>
          <span className="text-[10px] font-mono text-white/40 tracking-wider font-bold">{formatTime(audioRef.current?.duration || 0)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-6 px-2">
        <button className="text-white/30 hover:text-white transition-colors group">
          <Volume2 className="w-4 h-4 group-hover:neon-glow-cyan" />
        </button>
        
        <div className="flex items-center gap-6">
          <button onClick={handlePrev} className="text-white/40 hover:text-cyan-400 transition-all active:scale-90">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          
          <button 
            onClick={handleTogglePlay}
            className="w-12 h-12 bg-white text-black rounded flex items-center justify-center transition-all hover:bg-cyan-400 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
          
          <button onClick={handleNext} className="text-white/40 hover:text-cyan-400 transition-all active:scale-90">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>

        <div className="w-4 h-4" />
      </div>

      {/* Minimal Playlist */}
      <div className="flex flex-col gap-2 mt-2">
        <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-black border-b border-white/5 pb-2">Load_Sequence</p>
        <div className="max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
          {TRACKS.map((track, idx) => (
            <button
              key={track.id}
              onClick={() => setCurrentTrackIndex(idx)}
              className={`w-full flex items-center justify-between py-2.5 transition-all text-left border-b border-white/[0.03] group ${idx === currentTrackIndex ? 'text-cyan-400' : 'text-white/40 hover:text-white/60'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-mono opacity-30">0{idx + 1}</span>
                <span className="text-[11px] font-display uppercase tracking-tight font-bold truncate max-w-[140px]">{track.title}</span>
              </div>
              {idx === currentTrackIndex && isPlaying && (
                 <motion.div 
                    animate={{ opacity: [0.4, 1, 0.4] }} 
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-[9px] font-mono font-bold tracking-tighter"
                 >
                    LOCK_IN
                 </motion.div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
