import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '@/shared/lib/socket';
import { Memory } from './types';
import { MemoryCard } from './MemoryCard';
import { VoiceRecorder } from './VoiceRecorder';
import { PhotoUploader } from './PhotoUploader';
import { generateSummary } from './geminiService';  // Real Gemini

const initialMemories: Memory[] = [];  // Load from storage

export function MemoryCapsule() {
  const { id: roomId } = useParams<{ id: string }>();
  const socket = useSocket();
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const gameId = `memories-${roomId}`;
    socket.emit('joinGame', { gameId, roomId, playerId: socket.id });

    socket.on('gameStateUpdate', (newState: { memories: Memory[] }) => {
      setMemories(newState.memories || []);
    });

    return () => socket.emit('leaveGame', { gameId });
  }, [socket, roomId]);

  const addMemory = async (memory: Omit<Memory, 'id' | 'aiSummary'>) => {
    setUploading(true);
    const id = crypto.randomUUID();
    const newMemory: Memory = { ...memory, id, timestamp: new Date() };
    
    // Generate AI summary with real Gemini
    const aiSummary = await generateSummary(memory.content);
    newMemory.aiSummary = aiSummary;

    socket.emit('updateGameState', {
      gameId: `memories-${roomId}`,
      state: { memories: [...memories, newMemory] }
    });
    setUploading(false);
  };

  const handleVoiceRecord = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    addMemory({ type: 'voice', content: url, mood: 'romantic', generatedBy: 'userA' });
  };

  const handlePhotoUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    addMemory({ type: 'photo', content: url, mood: 'happy', generatedBy: 'userA' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-white mb-4 drop-shadow-2xl">🕊️ Memory Capsule</h1>
        <p className="text-xl text-white/90">Our shared moments 💕</p>
      </div>

      {/* Add New Memory */}
      <div className="max-w-2xl mx-auto mb-12 space-y-6">
        <PhotoUploader onUpload={handlePhotoUpload} />
        <VoiceRecorder onRecord={handleVoiceRecord} />
        {uploading && <div className="text-center text-white animate-pulse">Generating AI magic...</div>}
      </div>

      {/* Timeline */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {memories.map((memory) => (
          <MemoryCard key={memory.id} memory={memory} />
        ))}
        {memories.length === 0 && (
          <div className="text-center text-white/70 py-20">
            <div className="text-6xl mb-4">💭</div>
            <p>Create your first memory together!</p>
          </div>
        )}
      </div>
    </div>
  );
}