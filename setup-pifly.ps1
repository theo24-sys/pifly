Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "Starting fresh Pifly restructure..." -ForegroundColor Cyan

# ---------- Backup ----------
Write-Host "Backing up package.json, vite.config.ts, .env* ..."
New-Item -ItemType Directory -Force -Path .backup | Out-Null
Copy-Item -Path package.json -Destination .backup\ -ErrorAction SilentlyContinue
Copy-Item -Path vite.config.ts -Destination .backup\ -ErrorAction SilentlyContinue
Get-ChildItem -Path . -Filter ".env*" | Copy-Item -Destination .backup\ -ErrorAction SilentlyContinue

# ---------- Remove old source ----------
Write-Host "Removing old source files..."
Remove-Item -Recurse -Force src, components, services, App.tsx, index.tsx, constants.ts, types.ts -ErrorAction SilentlyContinue

# ---------- Create folders ----------
Write-Host "Creating src/ folder tree..."
$folders = @(
    "src/app",
    "src/features/auth/hooks",
    "src/features/room",
    "src/features/chat",
    "src/features/gifts",
    "src/features/memories",
    "src/features/minigames/shared",
    "src/features/minigames/CoupleQuizGame",
    "src/features/minigames/EmojiStoryGame",
    "src/features/minigames/MemoryMatchGame",
    "src/features/minigames/QuickReactionGame",
    "src/features/minigames/ScavengerHuntGame",
    "src/shared/ui",
    "src/shared/lib",
    "src/shared/hooks",
    "src/services",
    "src/assets/icons",
    "src/assets/lottie",
    "src/assets/images",
    "src/types"
)
foreach ($f in $folders) { New-Item -ItemType Directory -Force -Path $f | Out-Null }

# ---------- Helper ----------
function Write-File {
    param([string]$Path, [string]$Content)
    $full = Join-Path $PWD $Path
    [IO.File]::WriteAllText($full, $Content, [Text.UTF8Encoding]::new($false))
}

# src/main.tsx
Write-File "src/main.tsx" @"
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
"@

# src/App.tsx
Write-File "src/App.tsx" @"
import { BrowserRouter } from 'react-router-dom';
import { RoutesConfig } from './app/routes';
import { SocketProvider } from '@/shared/lib/socket';

export function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <RoutesConfig />
      </SocketProvider>
    </BrowserRouter>
  );
}
"@

# src/app/routes.tsx
Write-File "src/app/routes.tsx" @"
import { Routes, Route } from 'react-router-dom';
import { LoginScreen } from '@/features/auth/LoginScreen';
import { RoomScreen } from '@/features/room/RoomScreen';

export function RoutesConfig() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/room/:id" element={<RoomScreen />} />
      <Route path="*" element={<div className="p-8 text-2xl">404 - Not Found</div>} />
    </Routes>
  );
}
"@

# src/features/auth/LoginScreen.tsx
Write-File "src/features/auth/LoginScreen.tsx" @"
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
"@

# src/features/room/RoomScreen.tsx
Write-File "src/features/room/RoomScreen.tsx" @"
export function RoomScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-t from-indigo-500 to-pink-500 p-6">
      <h1 className="text-3xl font-bold text-white text-center">Shared Romantic Room</h1>
      <p className="text-white text-center mt-4">Minigames, chat, gifts coming soon!</p>
    </div>
  );
}
"@

# src/shared/ui/Button.tsx
Write-File "src/shared/ui/Button.tsx" @"
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
"@

# src/shared/lib/utils.ts
Write-File "src/shared/lib/utils.ts" @"
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}
"@

# src/shared/lib/socket.ts
Write-File "src/shared/lib/socket.ts" @"
import { createContext, useContext, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io(import.meta.env.VITE_SOCKET_URL || 'ws://localhost:3001', {
  transports: ['websocket'],
  autoConnect: true,
});

socket.on('connect', () => console.log('Connected to server'));
socket.on('disconnect', () => console.log('Disconnected'));

const SocketContext = createContext<Socket>(socket);

export const SocketProvider = ({ children }: { children: ReactNode }) => (
  <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
);

export const useSocket = () => useContext(SocketContext);
"@

# src/types/socket.ts
Write-File "src/types/socket.ts" @"
export type GameAction =
  | { type: 'joinGame'; gameId: string }
  | { type: 'updateGameState'; gameId: string; state: any }
  | { type: 'gift'; giftId: string }
  | { type: 'mood'; sentiment: 'positive' | 'neutral' | 'longing' };
"@

# src/index.css
Write-File "src/index.css" @"
@tailwind base;
@tailwind components;
@tailwind utilities;

* { touch-action: manipulation; }
body { margin: 0; font-family: system-ui; -webkit-font-smoothing: antialiased; }
"@

# public/index.html
New-Item -ItemType Directory -Force -Path public | Out-Null
Write-File "public/index.html" @"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pifly - Romantic Multiplayer</title>
    <link rel="manifest" href="/manifest.json" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
"@

# vite.config.ts
Write-File "vite.config.ts" @"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
"@

# tsconfig.json
Write-File "tsconfig.json" @"
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
"@

# tsconfig.node.json
Write-File "tsconfig.node.json" @"
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
"@

# ---------- npm scripts ----------
$pkgPath = "package.json"
if (Test-Path $pkgPath) {
    $pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
    $scripts = if ($pkg.PSObject.Properties.Name -contains "scripts") { $pkg.scripts } else { @{} }
    $changed = $false
    if (-not $scripts.dev)    { $scripts | Add-Member -MemberType NoteProperty -Name dev    -Value "vite" -Force; $changed = $true }
    if (-not $scripts.build)  { $scripts | Add-Member -MemberType NoteProperty -Name build  -Value "vite build" -Force; $changed = $true }
    if (-not $scripts.preview){ $scripts | Add-Member -MemberType NoteProperty -Name preview -Value "vite preview" -Force; $changed = $true }
    if ($changed) {
        $pkg | Add-Member -MemberType NoteProperty -Name scripts -Value $scripts -Force
        $pkg | ConvertTo-Json -Depth 10 | Set-Content $pkgPath
        Write-Host "Added dev/build/preview scripts to package.json"
    }
}

# ---------- Tailwind ----------
Write-Host "Installing Tailwind CSS..." -ForegroundColor Green
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

Write-File "tailwind.config.js" @"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
"@

Write-Host "`nDONE! Project is clean and ready." -ForegroundColor Cyan
Write-Host "`nRun:`n   npm install`n   npm run dev`n"
