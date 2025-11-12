/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WS_URL?: string;
  // Add other VITE_ vars here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
