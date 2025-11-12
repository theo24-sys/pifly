import { Link, useParams } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';

export function RoomScreen() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black text-white text-center mb-12 drop-shadow-2xl">
          💕 Welcome to Our Room 💕
        </h1>
        <Link to={`/room/${id}/memories`}>
  <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-12 text-center hover:bg-white/30 transition-all border-4 border-white/30 hover:border-white/50 group">
    <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">🕊️</div>
    <h2 className="text-3xl font-bold text-white mb-4">Memory Capsule</h2>
    <p className="text-xl text-white/90">Photos, voices, AI magic</p>
  </div>
</Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Link to={`/room/${id}/games`}>
            <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-12 text-center hover:bg-white/30 transition-all border-4 border-white/30 hover:border-white/50 group">
              <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">🎮</div>
              <h2 className="text-3xl font-bold text-white mb-4">Play Minigames</h2>
              <p className="text-xl text-white/90">Live multiplayer fun!</p>
            </div>
          </Link>
          <Link to={`/room/${id}/world`}>
  <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-12 text-center hover:bg-white/30 transition-all border-4 border-white/30 hover:border-white/50 group">
    <div className="text-7xl mb-6 group-hover:scale-110 transition-transform">World</div>
    <h2 className="text-3xl font-bold text-white mb-4">Our World</h2>
    <p className="text-xl text-white/90">Voice-to-AI universe</p>
  </div>
</Link>
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-12 text-center hover:bg-white/30 transition-all border-4 border-white/30 hover:border-white/50">
            <div className="text-7xl mb-6 animate-pulse">💝</div>
            <h2 className="text-3xl font-bold text-white mb-4">Coming Soon</h2>
            <p className="text-xl text-white/90">Chat • Gifts • Memories</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-2xl text-white/80 mb-8">Ready to play together? ✨</p>
          <Link to={`/room/${id}/games`}>
            <Button className="text-2xl px-20 py-8 shadow-2xl hover:shadow-3xl">
              Start Games 💕
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}