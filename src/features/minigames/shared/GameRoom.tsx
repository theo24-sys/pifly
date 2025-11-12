import { useEffect, useRef, useState } from 'react';
import { useSocket } from '@/shared/lib/socket';
import { useParams } from 'react-router-dom';

interface GameState {
  [key: string]: any;
}

interface Props<T extends GameState> {
  children: (state: T, actions: { update: (patch: Partial<T>) => void; reset: () => void }) => JSX.Element;
  initialState: T;
  gameType: string;
}

export function GameRoom<T extends GameState>({ children, initialState, gameType }: Props<T>) {
  const socket = useSocket();
  const { id: roomId } = useParams<{ id: string }>()!;
  const [gameId] = useState(`${gameType}-${roomId}`);
  const stateRef = useRef(initialState);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    socket.emit('joinGame', { gameId, roomId, playerId: socket.id });

    const handleStateUpdate = (newState: T) => {
      stateRef.current = { ...stateRef.current, ...newState };
      setIsReady(true);
    };

    socket.on('gameStateUpdate', handleStateUpdate as any);
    socket.on(`${gameId}-reset`, () => stateRef.current = initialState);

    return () => {
      socket.off('gameStateUpdate', handleStateUpdate as any);
      socket.emit('leaveGame', { gameId });
    };
  }, [socket, gameId, roomId]);

  const updateState = (patch: Partial<T>) => {
    const newState = { ...stateRef.current, ...patch, updatedBy: socket.id };
    stateRef.current = newState;
    socket.emit('updateGameState', { gameId, state: newState });
  };

  const reset = () => socket.emit('resetGame', { gameId });

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
        <div className="text-4xl animate-spin">💕</div>
      </div>
    );
  }

  return children(stateRef.current as T, { update: updateState, reset });
}