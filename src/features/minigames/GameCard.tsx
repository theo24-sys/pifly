import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';

interface Props {
  id: string;
  title: string;
  desc: string;
  icon: string;
  roomId: string;
}

export function GameCard({ id, title, desc, icon, roomId }: Props) {
  const navigate = useNavigate();

  return (
    <div className="group bg-white/20 backdrop-blur-xl rounded-3xl p-6 hover:bg-white/30 transition-all border border-white/30 hover:border-white/50">
      <div className="text-5xl mb-4 text-center">{icon}</div>
      <h3 className="text-2xl font-bold text-white mb-2 text-center">{title}</h3>
      <p className="text-white/80 mb-6 text-center">{desc}</p>
      <Button 
        onClick={() => navigate(`/room/${roomId}/game/${id}`)}
        className="group-hover:scale-105"
      >
        Play Now ✨
      </Button>
    </div>
  );
}