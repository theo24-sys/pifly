// src/shared/lib/socket.ts
// Cloudflare Workers WebSocket client (Vite + TypeScript)

let socket: WebSocket | null = null;
const listeners = new Map<string, (data: any) => void>();

export const connectSocket = (roomId: string) => {
  const baseUrl: string = import.meta.env.VITE_WS_URL || 'ws://localhost:8787'; // Ensure type is set
  const url = `${baseUrl}?roomId=${roomId}`;

  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log('[WebSocket] Connected');
  };

  socket.onmessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      const handler = listeners.get(data.type);
      if (handler) handler(data);
    } catch (e) {
      console.error('[WebSocket] Invalid message:', e);
    }
  };

  socket.onclose = () => {
    console.log('[WebSocket] Closed');
    socket = null;
  };

  socket.onerror = (err) => {
    console.error('[WebSocket] Error:', err);
  };
};

export const useSocket = () => {
  return {
    emit: (type: string, payload: any = {}) => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type, ...payload }));
      }
    },
    on: (type: string, callback: (data: any) => void) => {
      listeners.set(type, callback);
    },
    off: (type: string) => {
      listeners.delete(type);
    },
  };
};