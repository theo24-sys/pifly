import { GameRoom } from '../shared/GameRoom';
import { Button } from '@/shared/ui/Button';

interface StoryState {
  story: string[];
  currentTurn: 'playerA' | 'playerB';
  round: number;
  gameOver: boolean;
}

const initialState: StoryState = {
  story: [],
  currentTurn: 'playerA',
  round: 0,
  gameOver: false,
};

const emojiOptions = [
  '❤️', '💕', '😘', '🌹', '🌙', '⭐', '🎂', '🍕', '🎡', '🏖️',
  '✈️', '💍', '🎁', '🌳', '☕', '🎬', '🎶', '💃', '🕺', '🏠'
];

export function StoryGame() {
  return (
    <GameRoom initialState={initialState} gameType="story">
      {(state, { update }) => (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-white mb-6 drop-shadow-2xl">📖 Our Love Story</h1>
            <div className="text-3xl mb-8 flex flex-wrap justify-center gap-4 animate-pulse">
              {state.story.map((emoji, i) => (
                <span key={i} className="text-4xl animate-bounce">{emoji}</span>
              ))}
            </div>
            <div className={`text-2xl px-6 py-3 rounded-full font-bold ${
              state.currentTurn === 'playerA'
                ? 'bg-green-400 text-green-900 shadow-lg'
                : 'bg-gray-400 text-gray-900 shadow-lg'
            }`}>
              {state.currentTurn === 'playerA' ? 'Your turn! ✨' : "Partner's turn... ⏳"}
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 max-w-4xl mx-auto p-6 bg-white/10 backdrop-blur-xl rounded-3xl">
            {emojiOptions.map((emoji) => (
              <Button
                key={emoji}
                disabled={state.currentTurn !== 'playerA' || state.gameOver}
                onClick={() => {
                  update({
                    story: [...state.story, emoji],
                    currentTurn: 'playerB' as const,
                    round: state.round + 1,
                    ...(state.round + 1 >= 20 && { gameOver: true })
                  });
                }}
                className="h-20 w-full text-3xl hover:scale-110 active:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {emoji}
              </Button>
            ))}
          </div>

          {state.gameOver && (
            <div className="text-center mt-12">
              <h2 className="text-4xl font-black text-white mb-8 drop-shadow-2xl">💕 Story Complete! 💕</h2>
              <Button className="text-2xl px-12 py-6 shadow-2xl hover:shadow-3xl">
                Share Our Story ✨
              </Button>
            </div>
          )}
        </div>
      )}
    </GameRoom>
  );
}