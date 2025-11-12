import { Memory } from './types';
import { Lottie } from '@lottiefiles/react-lottie-player';

interface Props {
  memory: Memory;
  onPlay?: () => void;
}

export function MemoryCard({ memory, onPlay }: Props) {
  const isPhoto = memory.type === 'photo';
  const isVoice = memory.type === 'voice';
  const isAI = memory.type === 'ai_summary';

  return (
    <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/30">
      <div className="text-right text-sm text-white/70 mb-2">
        {memory.timestamp.toLocaleString()} • {memory.mood} ✨
      </div>
      
      {isPhoto && (
        <img src={memory.content} alt="Memory" className="w-full h-48 object-cover rounded-2xl mb-4" />
      )}
      
      {isVoice && (
        <div className="w-full h-48 bg-white/30 rounded-2xl flex items-center justify-center mb-4">
          <Lottie 
            loop 
            autoplay 
            src="https://assets5.lottiefiles.com/packages/lf20_voice.json" 
            style={{ width: 100, height: 100 }} 
          />
        </div>
      )}
      
      {isAI && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white mb-4">
          <p className="font-serif italic">{memory.aiSummary}</p>
        </div>
      )}

      <p className="text-white/90 mb-4">{memory.aiSummary || 'Sweet moment captured 💕'}</p>
      
      <Button onClick={onPlay} className="w-full">Relive ✨</Button>
    </div>
  );
}