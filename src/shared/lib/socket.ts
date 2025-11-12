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
