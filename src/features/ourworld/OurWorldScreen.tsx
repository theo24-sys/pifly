import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '@/shared/lib/socket';
import { Button } from '@/shared/ui/Button';
import { Lottie } from '@lottiefiles/react-lottie-player';
import { generateWorldFromVoice } from './geminiService';

interface WorldState {
  background: string;
  animation: string;
  description: string;
  mood: 'happy' | 'romantic' | 'calm' | 'excited';
  giftActive: boolean;
  giftType: 'fireworks' | 'hearts' | null;
}

const initialState: WorldState = {
  background: "bg-gradient-to-br from-pink-400 to-purple-600",
  animation: "https://assets5.lottiefiles.com/packages/lf20_2j0t.json",
  description: "Welcome to Our World",
  mood: 'happy',
  giftActive: false,
  giftType: null,
};

export function OurWorldScreen() {
  const { id: roomId } = useParams<{ id: string }>();
  const socket = useSocket();
  const [state, setState] = useState<WorldState>(initialState);
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);

  // ---------- Socket sync ----------
  useEffect(() => {
    const gameId = `world-${roomId}`;
    socket.emit('joinGame', { gameId, roomId, playerId: socket.id });

    socket.on('gameStateUpdate', (newState: WorldState) => {
      setState(newState);
    });

    return () => {
      socket.emit('leaveGame', { gameId });
      socket.off('gameStateUpdate');
    };
  }, [socket, roomId]);

  // ---------- Voice → AI ----------
  const speakToAI = async () => {
    setIsListening(true);
    setTimeout(() => {
      const scene = generateWorldFromVoice(prompt || 'sunset beach');
      socket.emit('updateGameState', {
        gameId: `world-${roomId}`,
        state: {
          ...state,
          background: scene.bg,
          animation: scene.animation,
          description: scene.description,
          mood: scene.mood,
        },
      });
      setIsListening(false);
      setPrompt('');
    }, 800);
  };

  // ---------- Gift ----------
  const sendGift = (type: 'fireworks' | 'hearts') => {
    socket.emit('updateGameState', {
      gameId: `world-${roomId}`,
      state: { giftActive: true, giftType: type },
    });
    setTimeout(() => {
      socket.emit('updateGameState', {
        gameId: `world-${roomId}`,
        state: { giftActive: false, giftType: null },
      });
    }, 5000);
  };

  // ---------- UI ----------
  return (
    <div className={`min-h-screen ${state.background} relative overflow-hidden transition-all duration-1000`}>
      {/* Background Lottie */}
      <Lottie
        loop
        autoplay
        src={state.animation}
        style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.3 }}
      />

      {/* Gift animations */}
      {state.giftActive && state.giftType === 'fireworks' && (
        <Lottie
          loop={false}
          autoplay
          src="https://assets5.lottiefiles.com/packages/lf20_fireworks.json"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      )}
      {state.giftActive && state.giftType === 'hearts' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-6xl animate-ping"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              Heart
            </div>
          ))}
        </div>
      )}

      {/* Avatars */}
      <div className="absolute top-8 left-8 flex items-center gap-4">
        <div className="w-20 h-20 bg-white/30 backdrop-blur-xl rounded-full flex items-center justify-center text-4xl shadow-2xl">
          {state.mood === 'romantic' ? 'Heart' : 'Smiling Face'}
        </div>
        <div className="text-white font-bold text-xl drop-shadow-lg">You</div>
      </div>

      <div className="absolute top-8 right-8 flex items-center gap-4">
        <div className="w-20 h-20 bg-white/30 backdrop-blur-xl rounded-full flex items-center justify-center text-4xl shadow-2xl">
          {state.mood === 'romantic' ? 'Heart' : 'Smiling Face'}
        </div>
        <div className="text-white font-bold text-xl drop-shadow-lg">Partner</div>
      </div>

      {/* Description */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-5xl font-black text-white drop-shadow-2xl mb-4">
          {state.description}
        </h1>
        <p className="text-2xl text-white/90">Mood: {state.mood}</p>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-6 flex-wrap justify-center">
        <Button
          onClick={speakToAI}
          className={`text-2xl px-12 py-6 ${isListening ? 'animate-pulse' : ''}`}
        >
          {isListening ? 'Listening...' : 'Voice'}
        </Button>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && speakToAI()}
          placeholder="Say: 'sunset beach'..."
          className="px-6 py-4 rounded-full text-xl bg-white/30 backdrop-blur-xl text-white placeholder-white/70 border border-white/50"
        />

        <Button onClick={() => sendGift('fireworks')} className="text-2xl px-8 py-6">
          Fireworks
        </Button>
        <Button onClick={() => sendGift('hearts')} className="text-2xl px-8 py-6">
          Hearts
        </Button>
      </div>

      {/* Quick scene buttons */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-wrap gap-2 justify-center">
        {['sunset beach', 'paris night', 'candle dinner', 'northern lights', 'hot air balloon'].map((s) => (
          <button
            key={s}
            onClick={() => setPrompt(s)}
            className="px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full text-sm text-white border border-white/30"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}