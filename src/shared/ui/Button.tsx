import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ children, className, variant = 'primary', ...props }: Props) {
  const base = 'w-full py-4 rounded-full font-bold text-lg transition-all active:scale-95';
  const primary = 'bg-white text-purple-600';
  const secondary = 'bg-white/20 text-white backdrop-blur-xl';
  const final = cn(base, variant === 'primary' ? primary : secondary, className);
  return <button className={final} {...props}>{children}</button>;
}