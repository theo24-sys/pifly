export type GameAction =
  | { type: 'joinGame'; gameId: string }
  | { type: 'updateGameState'; gameId: string; state: any }
  | { type: 'gift'; giftId: string }
  | { type: 'mood'; sentiment: 'positive' | 'neutral' | 'longing' };