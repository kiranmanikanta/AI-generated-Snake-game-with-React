export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
}

export type GameState = 'idle' | 'playing' | 'paused' | 'gameover';

export interface Point {
  x: number;
  y: number;
}
