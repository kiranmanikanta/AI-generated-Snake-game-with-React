import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, TICK_RATE } from '../constants';
import { Point, GameState } from '../types';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameState('gameover');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Eaten food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood, onScoreChange]);

  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(moveSnake, TICK_RATE);
      return () => clearInterval(interval);
    }
  }, [gameState, moveSnake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear background with semi-transparency for trail effect (Recipe 7 vibe)
    ctx.fillStyle = 'rgba(12, 13, 15, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines - Recipe 1 style (Visible grid structure)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }

    // Draw snake segments
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      const alpha = Math.max(0.2, 1 - (index / snake.length));
      
      ctx.shadowBlur = isHead ? 25 : 10;
      ctx.shadowColor = isHead ? '#ec4899' : `rgba(6, 182, 212, ${alpha})`;
      
      // Use "Hardware" style rects
      ctx.fillStyle = isHead ? '#ec4899' : `rgba(6, 182, 212, ${alpha})`;
      
      const padding = isHead ? 1 : 2 + (index * 0.1);
      const size = cellSize - padding * 2;
      
      // Draw rounded head
      if (isHead) {
          ctx.beginPath();
          ctx.roundRect(
              segment.x * cellSize + padding,
              segment.y * cellSize + padding,
              size,
              size,
              4
          );
          ctx.fill();
      } else {
          ctx.fillRect(
              segment.x * cellSize + padding,
              segment.y * cellSize + padding,
              size,
              size
          );
      }
    });

    // Draw food with a "pulse" glow
    const pulse = Math.sin(Date.now() / 150) * 5 + 15;
    ctx.shadowBlur = pulse;
    ctx.shadowColor = '#fbbf24';
    ctx.fillStyle = '#fbbf24';
    const foodPadding = 5;
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 2 - foodPadding,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Reset shadow for next frame
    ctx.shadowBlur = 0;
  }, [snake, food]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    onScoreChange(0);
    setGameState('playing');
  };

  return (
    <div id="game-mainframe" className="relative hardware-surface rounded-xl overflow-hidden group">
      {/* Corner Brackets (Hardware Aesthatic) */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/10" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/10" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/10" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/10" />

      <canvas
        ref={canvasRef}
        id="game-canvas"
        width={400}
        height={400}
        className="w-full aspect-square block"
      />

      <AnimatePresence>
        {gameState !== 'playing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center backdrop-blur-md"
          >
            <div className="flex flex-col items-center text-center gap-6 max-w-[80%]">
                <div className="w-12 h-1 bg-cyan-500 mb-2 neon-glow-cyan" />
                <h2 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter font-display text-glitch leading-none">
                    {gameState === 'idle' ? 'INIT_SEQUENCE' : 'FATAL_CORE_EXIT'}
                </h2>
                
                {gameState === 'gameover' && (
                <div className="flex flex-col gap-1 items-center">
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] font-black">Score_Dump</p>
                    <p className="text-5xl font-mono text-pink-500 font-black tracking-tighter drop-shadow-lg">{score.toString().padStart(4, '0')}</p>
                </div>
                )}
                
                <button
                    id="btn-play-game"
                    onClick={startGame}
                    className="mt-4 px-12 py-4 bg-white text-black font-black uppercase tracking-[0.2em] font-mono text-xs hover:bg-cyan-500 transition-all active:scale-95 flex items-center gap-3 group"
                >
                    <div className="w-2 h-2 bg-black rounded-full group-hover:bg-white animate-pulse" />
                    {gameState === 'idle' ? 'LINK_START' : 'RELOAD_KERNEL'}
                </button>
                
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em] font-medium border-t border-white/5 pt-4">
                    Neural Control Interface: [ARR_KEYS]
                </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
