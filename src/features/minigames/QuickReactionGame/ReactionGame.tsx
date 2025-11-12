import { GameRoom } from '../shared/GameRoom';
import { Button } from '@/shared/ui/Button';

interface ReactionState {
  round: number;
  playerAWins: number;
  playerBWins: number;
  lastTap: number | null;
  ready: boolean;
  gameOver: boolean;
}

const initialState: ReactionState = {
  round: 1,
  playerAWins: 0,
  playerBWins: 0,
  lastTap: null,
  ready: false,
  gameOver: false,
};

export function ReactionGame() {
  return (
    <GameRoom initialState={initialState} gameType="reaction">
      {(state, { update, reset }) => (
        <div className="min-h-screen bg-gradient-to-r from-orange-400 via-red-400 to-pink-500 flex flex-col items-center justify-center p-8 text-center">
          <div className="text-6xl mb-12 animate-bounce drop-shadow-2xl">⚡</div>
          
          {!state.ready ? (
            <div className="space-y-8">
              <h1 className="text-5xl font-black text-white mb-8 drop-shadow-2xl">⚡ REACTION DUEL ⚡</h1>
              <div className="text-3xl font-bold text-white/90">
                Best of 10 • Round {state.round}
              </div>
              <div className="text-4xl text-white/80 mb-12">
                You: {state.playerAWins} | Partner: {state.playerBWins}
              </div>
              <Button 
                onClick={() => update({ ready: true })}
                className="text-3xl px-16 py-8 shadow-2xl hover:shadow-3xl"
              >
                READY? 👊
              </Button>
            </div>
          ) : (
            <>
              <div className={`text-6xl mb-8 ${
                state.lastTap ? 'animate-ping' : 'animate-pulse'
              }`}>
                {state.lastTap ? '💥' : '🚀'}
              </div>
              
              <div className="text-4xl font-black text-white drop-shadow-2xl mb-12">
                TAP FASTEST!
              </div>

              <div 
                className={`w-72 h-72 sm:w-80 sm:h-80 rounded-3xl flex items-center justify-center shadow-2xl transition-all cursor-pointer active:scale-95 ${
                  state.lastTap 
                    ? 'bg-green-400 animate-bounce' 
                    : 'bg-white/30 hover:bg-white/50 backdrop-blur-xl'
                }`}
                onClick={() => {
                  update({
                    lastTap: Date.now(),
                    ...(Math.random() > 0.5 ? { playerAWins: state.playerAWins + 1 } : { playerBWins: state.playerBWins + 1 }),
                    round: state.round + 1,
                    ready: false,
                    ...(state.round + 1 >= 10 && { gameOver: true })
                  });
                }}
              >
                <span className="text-5xl font-black text-white drop-shadow-lg">TAP!</span>
              </div>
            </>
          )}

          {state.gameOver && (
            <div className="mt-16 text-center">
              <h2 className="text-6xl font-black text-white mb-8 drop-shadow-2xl">🏆 WINNER!</h2>
              <Button 
                onClick={reset}
                className="text-2xl px-16 py-8 shadow-2xl hover:shadow-3xl mt-8"
              >
                Rematch ⚡
              </Button>
            </div>
          )}
        </div>
      )}
    </GameRoom>
  );
}