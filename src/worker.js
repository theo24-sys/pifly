// src/worker.js – WebSocket + Durable Objects for Rooms
export default {
  async fetch(request, env, ctx) {
    const upgradeHeader = request.headers.get('Upgrade');
    if (upgradeHeader !== 'websocket') {
      return new Response('Expected WebSocket', { status: 400 });
    }
    const url = new URL(request.url);
    const roomId = url.searchParams.get('roomId') || 'default';
    const id = env.GAME_ROOM.idFromName(roomId);
    const obj = env.GAME_ROOM.get(id);
    const [client, server] = Object.values(new WebSocketPair());
    server.accept();
    obj.handleWebSocket(server, roomId);
    return new Response(null, { status: 101, webSocket: client });
  },
};

export class GameRoom {
  constructor(state, env) {
    this.state = state;
    this.wsClients = new Set();
  }

  handleWebSocket(ws, roomId) {
    this.wsClients.add(ws);
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'updateGameState') {
        // Update room state
        this.state[msg.gameId] = { ...this.state[msg.gameId], ...msg.state };
        // Broadcast
        for (const client of this.wsClients) {
          client.send(JSON.stringify({ type: 'gameStateUpdate', state: this.state[msg.gameId] }));
        }
      }
    });
    ws.addEventListener('close', () => this.wsClients.delete(ws));
  }
}