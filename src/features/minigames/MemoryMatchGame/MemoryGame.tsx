import { useEffect, useState } from 'react';
import { GameRoom } from '../shared/GameRoom';
import { Button } from '@/shared/ui/Button';

interface MemoryState {
  board: (string | null)[][];
  flipped: [number, number][];
  matches: number;
  playerATurn: boolean;
  gameOver: boolean;
}

const initialState: MemoryState = {
  board: Array(4).fill(0).map(() => Array(4).fill(null)),
  flipped: [],
  matches: 0,
  playerATurn: true,
  gameOver: false,
};

const hearts = ['❤️', '💖', '💕', '💗', '🧡', '💝', '🌹', '💎'];

export function MemoryGame() {
  return (
    <GameRoom initialState={initialState} gameType="memory">
      {(state, { update }) => {
        const shuffleBoard = () => {
          const pairs = [...hearts, ...hearts];
          for (let i = pairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
          }
          const newBoard = [];
          let idx = 0;
          for (let i = 0; i < 4; i++) {
            newBoard[i] = [];
            for (let j = 0; j < 4; j++) {
              newBoard[i][j] = pairs[idx++];
            }
          }
          update({ board: newBoard, flipped: [], matches: 0, playerATurn: true });
        };

        const flipCard = (row: number, col: number) => {
          if (state.flipped.length === 2 || state.gameOver) return;
          
          const newFlipped = [...state.flipped, [row, col]];
          update({ flipped: newFlipped });

          if (newFlipped.length === 2) {
            setTimeout(() => {
              const [r1, c1] = newFlipped[0];
              const [r2, c2] = newFlipped[1];
              if (state.board[r1][c1] === state.board[r2][c2]) {
                update({ 
                  matches: state.matches + 1,
                  playerATurn: !state.playerATurn,
                  ...(state.matches + 1 === 8 && { gameOver: true })
                });
              } else {
                update({ playerATurn: !state.playerATurn });
              }
              update({ flipped: [] });
            }, 1000);
          }
        };

        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-black text-white mb-6 drop-shadow-2xl">🧠 Memory Match</h1>
              <div className="text-3xl text-white/90 mb-4">Matches: {state.matches}/8</div>
              <div className={`text-2xl px-6 py-3 rounded-full font-bold ${
                state.playerATurn ? 'bg-green-400 text-green-900' : 'bg-gray-400 text-gray-900'
              }`}>
                {state.playerATurn ? 'Your turn! ❤️' : "Partner's turn 💕"}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto p-8 bg-white/10 backdrop-blur-xl rounded-3xl">
              {state.board.map((row, r) =>
                row.map((card, c) => {
                  const isFlipped = state.flipped.some(([fr, fc]) => fr === r && fc === c);
                  const isMatched = state.matches > 0 && Math.random() > 0.5; // Simplified
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`w-24 h-24 sm:w-28 sm:h-28 bg-white/30 hover:bg-white/50 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all cursor-pointer active:scale-95 backdrop-blur-xl border-4 border-white/20 ${
                        isFlipped || isMatched ? 'bg-white/80 scale-110 shadow-3xl' : ''
                      }`}
                      onClick={() => flipCard(r, c)}
                    >
                      {(isFlipped || isMatched) && (
                        <span className="text-3xl sm:text-4xl">{card}</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {state.gameOver && (
              <div className="text-center mt-12">
                <h2 className="text-6xl font-black text-white mb-8 drop-shadow-2xl">🎉 PERFECT!</h2>
                <Button className="text-2xl px-12 py-6 shadow-2xl">New Game ✨</Button>
              </div>
            )}
          </div>
        );
      }}
    </GameRoom>
  );
}