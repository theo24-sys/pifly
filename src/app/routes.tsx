import { Routes, Route } from 'react-router-dom';
import { LoginScreen } from '@/features/auth/LoginScreen';
import { RoomScreen } from '@/features/room/RoomScreen';
import { Minigames } from '@/features/minigames';
import { QuizGame } from '@/features/minigames/CoupleQuizGame/QuizGame';
import { StoryGame } from '@/features/minigames/EmojiStoryGame/StoryGame';
import { ReactionGame } from '@/features/minigames/QuickReactionGame/ReactionGame';
import { MemoryGame } from '@/features/minigames/MemoryMatchGame/MemoryGame';
import { PhotoHunt } from '@/features/minigames/ScavengerHuntGame/PhotoHunt';
import { OurWorldScreen } from '@/features/ourworld/OurWorldScreen';
import { MemoryCapsule } from '@/features/memories/MemoryCapsule';

export function RoutesConfig() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/room/:id" element={<RoomScreen />} />
      <Route path="/room/:id/games" element={<Minigames />} />
      <Route path="/room/:id/game/quiz" element={<QuizGame />} />
      <Route path="/room/:id/game/story" element={<StoryGame />} />
      <Route path="/room/:id/game/reaction" element={<ReactionGame />} />
      <Route path="/room/:id/game/memory" element={<MemoryGame />} />
      <Route path="/room/:id/game/hunt" element={<PhotoHunt />} />
      <Route path="/room/:id/world" element={<OurWorldScreen />} />
      <Route path="/room/:id/memories" element={<MemoryCapsule />} />
      <Route path="*" element={<div className="p-8 text-2xl">404 – Not Found</div>} />
    </Routes>
  );
}