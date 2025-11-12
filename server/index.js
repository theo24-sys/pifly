// server/index.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Add new socket event
socket.on('generateSummary', async ({ content, callback }) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(`Romantic summary: ${content}`);
    socket.emit(callback, result.response.text());
  } catch (error) {
    socket.emit(callback, 'Sweet memory forever 💕');
  }
});

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store game states per room
const gameStates = new Map(); // roomId -> { gameType: state }
const roomConnections = new Map(); // roomId -> Set<socket.id>

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // === JOIN ROOM & GAME ===
  socket.on('joinGame', ({ gameId, roomId, playerId }) => {
    socket.join(roomId);
    socket.join(gameId);

    if (!roomConnections.has(roomId)) roomConnections.set(roomId, new Set());
    roomConnections.get(roomId).add(socket.id);

    // Initialize game state if not exists
    if (!gameStates.has(gameId)) {
      gameStates.set(gameId, { players: {}, updatedAt: Date.now() });
    }

    const state = gameStates.get(gameId);
    state.players[playerId] = { id: playerId, online: true };

    // Broadcast updated state
    io.to(gameId).emit('gameStateUpdate', state);
    console.log(`Player ${playerId} joined ${gameId}`);
  });

  // === UPDATE GAME STATE ===
  socket.on('updateGameState', ({ gameId, state }) => {
    if (gameStates.has(gameId)) {
      const merged = { ...gameStates.get(gameId), ...state, updatedAt: Date.now() };
      gameStates.set(gameId, merged);
      io.to(gameId).emit('gameStateUpdate', merged);
    }
  });

  // === RESET GAME ===
  socket.on('resetGame', ({ gameId }) => {
    if (gameStates.has(gameId)) {
      const oldState = gameStates.get(gameId);
      const resetState = { players: oldState.players, updatedAt: Date.now() };
      gameStates.set(gameId, resetState);
      io.to(gameId).emit('gameStateUpdate', resetState);
    }
  });

  // === LEAVE GAME ===
  socket.on('leaveGame', ({ gameId }) => {
    if (gameStates.has(gameId)) {
      const state = gameStates.get(gameId);
      delete state.players[socket.id];
      if (Object.keys(state.players).length === 0) {
        gameStates.delete(gameId);
      } else {
        io.to(gameId).emit('gameStateUpdate', state);
      }
    }
    socket.leave(gameId);
  });

  // === DISCONNECT ===
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Clean up all rooms this socket was in
    for (const [roomId, connections] of roomConnections.entries()) {
      if (connections.has(socket.id)) {
        connections.delete(socket.id);
        if (connections.size === 0) roomConnections.delete(roomId);
      }
    }
  });
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'Pifly Server LIVE', 
    timestamp: new Date().toISOString(),
    activeRooms: gameStates.size
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Pifly Multiplayer Server running on port ${PORT}`);
  console.log(`Deployed at: https://your-app.vercel.app`);
});