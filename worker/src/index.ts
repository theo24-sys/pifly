// worker/src/index.ts – WebSocket + Durable Objects for Pifly rooms
export interface Env {
  GAME_ROOM: DurableObjectNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
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
  state: DurableObjectState;
  wsClients = new Set<WebSocket>();

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async handleWebSocket(ws: WebSocket, roomId: string): Promise<void> {
    this.wsClients.add(ws);

    ws.addEventListener('message', async (event) => {
      try {
        const msg = JSON.parse(await event.data.text());
        if (msg.type === 'updateGameState') {
          // Update room state (persistent via Durable Objects)
          await this.state.storage.put(`state-${msg.gameId}`, msg.state);
          // Broadcast
          for (const client of this.wsClients) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: 'gameStateUpdate', state: msg.state }));
            }
          }
        } else if (msg.type === 'joinGame') {
          const state = await this.state.storage.get(`state-${msg.gameId}`) || {};
          ws.send(JSON.stringify({ type: 'gameStateUpdate', state }));
        }
      } catch (err) {
        console.error('Message error:', err);
      }
    });

    ws.addEventListener('close', () => {
      this.wsClients.delete(ws);
    });
  }
}