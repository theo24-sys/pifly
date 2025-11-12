// src/shared/lib/socket.ts
// Cloudflare Workers WebSocket client (no Socket.io)

let socket: WebSocket | null = null;
const listeners = new Map<string, (data: any) => void>();

export const connectSocket = (roomId: string) => {
  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8787';
  socket = new WebSocket(${wsUrl}?roomId=);

  socket.onopen = () => {
    console.log('Connected to WebSocket server');
  };

  socket.onmessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      const handler = listeners.get(data.type);
      if (handler) handler(data);
    } catch (e) {
      console.error('Invalid message:', e);
    }
  };

  socket.onclose = () => {
    console.log('WebSocket closed');
    socket = null;
  };

  socket.onerror = (err) => {
    console.error('WebSocket error:', err);
  };
};

export const useSocket = () => {
  return {
    emit: (type: string, payload: any) => {
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
