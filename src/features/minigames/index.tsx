import { useParams } from 'react-router-dom';
import { GameCard } from './GameCard';
import { Button } from '@/shared/ui/Button';

const games = [
  { id: 'quiz', title: '❤️‍🔥 Quiz Battle', desc: 'Who knows me better?', icon: '❤️‍🔥' },
  { id: 'reaction', title: '⚡ Reaction Duel', desc: 'Tap FASTEST!', icon: '⚡' },
  { id: 'story', title: '📖 Emoji Story', desc: 'Build our love story', icon: '📖' },
  { id: 'memory', title: '🧠 Memory Match', desc: 'Flip & match hearts', icon: '🧠' },
  { id: 'hunt', title: '📸 Photo Hunt', desc: 'Real photo challenge', icon: '📸' },
];

export function Minigames() {
  const { id: roomId } = useParams<{ id: string }>()!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 via-pink-400 to-purple-500 p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-white mb-4 drop-shadow-2xl">🎮 Play Together</h1>
        <p className="text-xl text-white/90">Live with your partner 💕</p>
      </div>

      <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
        {games.map((game) => (
          <GameCard key={game.id} {...game} roomId={roomId!} />
        ))}
      </div>
    </div>
  );
}