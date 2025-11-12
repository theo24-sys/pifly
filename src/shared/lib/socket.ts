// src/shared/lib/socket.ts
let socket: WebSocket | null = null;
const listeners = new Map<string, (data: any) => void>();

export const connectSocket = (roomId: string): void => {
  const baseUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8787";
  const url = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}roomId=${roomId}`;

  socket = new WebSocket(url);

  socket.onopen = () => console.log("[WS] Connected");
  socket.onmessage = (e: MessageEvent) => {
    try {
      const data = JSON.parse(e.data as string);
      const handler = listeners.get(data.type);
      if (handler) handler(data);
    } catch (err) {
      console.error("[WS] Parse error:", err);
    }
  };
  socket.onclose = () => { console.log("[WS] Closed"); socket = null; };
  socket.onerror = (err) => console.error("[WS] Error:", err);
};

export const useSocket = () => ({
  emit: (type: string, payload: any = {}) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type, ...payload }));
    }
  },
  on: (type: string, cb: (data: any) => void) => listeners.set(type, cb),
  off: (type: string) => listeners.delete(type),
});