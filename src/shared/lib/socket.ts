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
  <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>.Provider>
);

export const useSocket = () => useContext(SocketContext);

// Use Cloudflare Workers WebSocket
const wsUrl = import.meta.env.VITE_WS_URL || 'wss://pifly-sockets.youraccount.workers.dev/socket';
let socket: WebSocket;

const connectSocket = () => {
  socket = new WebSocket(wsUrl + '?roomId=' + roomId);  // Append roomId to URL
  socket.onopen = () => console.log('Connected to Workers WebSocket');
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'gameStateUpdate') {
      // Update state (e.g., Zustand)
    }
  };
};

export const useSocket = () => ({
  emit: (type: string, payload: any) => socket.send(JSON.stringify({ type, ...payload })),
  on: (type: string, callback: (data: any) => void) => { /* Handle */ },
});
