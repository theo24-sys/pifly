import { GameRoom } from '../shared/GameRoom';
import { Button } from '@/shared/ui/Button';

interface HuntState {
  currentChallenge: number;
  playerASubmitted: boolean;
  playerBSubmitted: boolean;
  playerAPhoto: string | null;
  playerBPhoto: string | null;
  scores: { playerA: number; playerB: number };
  gameOver: boolean;
}

const initialState: HuntState = {
  currentChallenge: 0,
  playerASubmitted: false,
  playerBSubmitted: false,
  playerAPhoto: null,
  playerBPhoto: null,
  scores: { playerA: 0, playerB: 0 },
  gameOver: false,
};

const challenges = [
  "Something red ❤️",
  "Your favorite snack 🍫", 
  "A cozy corner 🛋️",
  "Something that makes you smile 😊",
  "Our favorite color 💕"
];

export function PhotoHunt() {
  return (
    <GameRoom initialState={initialState} gameType="hunt">
      {(state, { update }) => (
        <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-500 p-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-white mb-6 drop-shadow-2xl">📸 Photo Hunt</h1>
            <div className="text-3xl text-white/90 mb-8">
              Challenge {state.currentChallenge + 1}/5: "{challenges[state.currentChallenge]}"
            </div>
            <div className="flex justify-center gap-8 text-2xl mb-8">
              <span>You: {state.scores.playerA} ❤️</span>
              <span>Partner: {state.scores.playerB} 💕</span>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Player A Photo */}
            <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Your Photo</h3>
              {state.playerAPhoto ? (
                <img src={state.playerAPhoto} alt="Your photo" className="w-64 h-64 object-cover rounded-2xl mx-auto shadow-2xl" />
              ) : (
                <div className="w-64 h-64 bg-white/30 rounded-2xl flex items-center justify-center mx-auto text-4xl">
                  📷
                </div>
              )}
              {!state.playerASubmitted && (
                <Button 
                  onClick={() => {
                    // Simulate photo upload
                    update({ 
                      playerASubmitted: true, 
                      playerAPhoto: 'https://via.placeholder.com/256x256/ff69b4/ffffff?text=❤️' 
                    });
                  }}
                  className="mt-6 text-xl"
                >
                  Take Photo 📸
                </Button>
              )}
            </div>

            {/* Player B Photo */}
            <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Partner's Photo</h3>
              {state.playerBPhoto ? (
                <img src={state.playerBPhoto} alt="Partner photo" className="w-64 h-64 object-cover rounded-2xl mx-auto shadow-2xl" />
              ) : (
                <div className="w-64 h-64 bg-white/30 rounded-2xl flex items-center justify-center mx-auto text-4xl">
                  ⏳ Waiting...
                </div>
              )}
            </div>

            {state.playerASubmitted && state.playerBSubmitted && (
              <div className="text-center">
                <Button 
                  onClick={() => update({
                    currentChallenge: state.currentChallenge + 1,
                    playerASubmitted: false,
                    playerBSubmitted: false,
                    playerAPhoto: null,
                    playerBPhoto: null,
                    ...(state.currentChallenge + 1 >= 5 && { gameOver: true })
                  })}
                  className="text-2xl px-16 py-6 shadow-2xl"
                >
                  Next Challenge ➡️
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </GameRoom>
  );
}