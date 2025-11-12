import { Button } from '@/shared/ui/Button';

export function LoginScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center p-6">
      <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Welcome to Pifly</h1>
        <Button onClick={() => alert('Login coming soon!')}>Sign In with Google</Button>
      </div>
    </div>
  );
}