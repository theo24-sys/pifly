import { useParams } from 'react-router-dom';
import { GameRoom } from '../shared/GameRoom';
import { questions } from './questions';
import { Button } from '@/shared/ui/Button';

interface QuizState {
  currentQuestion: number;
  playerAScore: number;
  playerBScore: number;
  playerAAnswer: string | null;
  playerBAnswer: string | null;
  timeLeft: number;
  gameOver: boolean;
  answersRevealed: boolean;
}

const initialState: QuizState = {
  currentQuestion: 0,
  playerAScore: 0,
  playerBScore: 0,
  playerAAnswer: null,
  playerBAnswer: null,
  timeLeft: 15,
  gameOver: false,
  answersRevealed: false,
};

export function QuizGame() {
  const { id: roomId } = useParams<{ id: string }>()!;

  return (
    <GameRoom gameId={`quiz-${roomId}`} initialState={initialState} gameType="quiz">
      {(state, { update, reset }) => (
        <div className="min-h-screen bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500 p-6">
          {/* Live Scores */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-3xl font-black text-white drop-shadow-lg">
              You: {state.playerAScore} ❤️
            </div>
            <div className="text-3xl font-black text-white drop-shadow-lg">
              Partner: {state.playerBScore} 💕
            </div>
          </div>

          {!state.gameOver ? (
            <>
              {/* Question */}
              <div className="bg-white/25 backdrop-blur-2xl rounded-3xl p-8 mb-8 text-center shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-lg">
                  Q{state.currentQuestion + 1}: {questions[state.currentQuestion].question}
                </h2>
                <div className={`text-4xl font-black mb-4 ${
                  state.timeLeft > 5 ? 'text-yellow-300' : 'text-red-400 animate-pulse'
                }`}>
                  ⏰ {state.timeLeft}s
                </div>
              </div>

              {/* Answer Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {questions[state.currentQuestion].options.map((option, i) => (
                  <Button
                    key={i}
                    disabled={state.playerAAnswer !== null || state.timeLeft <= 0}
                    onClick={() => update({ playerAAnswer: option })}
                    className="h-20 text-xl shadow-2xl hover:shadow-3xl active:scale-95"
                  >
                    {option}
                  </Button>
                ))}
              </div>

              {/* Results Preview */}
              {state.answersRevealed && (
                <div className="text-center text-2xl font-bold text-white mb-8">
                  {state.playerAAnswer === state.playerBAnswer 
                    ? '💕 PERFECT MATCH! +1 each 💕' 
                    : '💔 Different answers 💔'
                  }
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="text-6xl mb-8 animate-bounce">🏆</div>
              <h1 className="text-5xl font-black text-white mb-8 drop-shadow-2xl">
                Final Score!
              </h1>
              <div className="text-4xl text-white mb-12">
                You: {state.playerAScore} | Partner: {state.playerBScore}
              </div>
              <Button 
                onClick={reset}
                className="text-2xl px-16 py-6 shadow-2xl hover:shadow-3xl"
              >
                Play Again 💕
              </Button>
            </div>
          )}
        </div>
      )}
    </GameRoom>
  );
}