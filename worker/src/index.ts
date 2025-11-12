export interface Env {
  GAME_ROOM: DurableObjectNamespace;
}

export default {
  async fetch(request: Request, env: Env) {
    const upgrade = request.headers.get("Upgrade");
    if (upgrade !== "websocket") return new Response("WebSocket expected", { status: 400 });

    const url = new URL(request.url);
    const roomId = url.searchParams.get("roomId") || "default";
    const id = env.GAME_ROOM.idFromName(roomId);
    const obj = env.GAME_ROOM.get(id);

    const [client, server] = Object.values(new WebSocketPair());
    server.accept();
    await obj.handleWebSocket(server);

    return new Response(null, { status: 101, webSocket: client });
  }
};

export class GameRoom {
  state: DurableObjectState;
  clients = new Set<WebSocket>();

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async handleWebSocket(ws: WebSocket) {
    this.clients.add(ws);
    ws.addEventListener("message", async (msg) => {
      try {
        const data = JSON.parse(await msg.data.text());
        if (data.type === "updateGameState") {
          await this.state.storage.put(`state-${data.gameId}`, data.state);
          for (const c of this.clients) {
            if (c.readyState === WebSocket.OPEN) {
              c.send(JSON.stringify({ type: "gameStateUpdate", state: data.state }));
            }
          }
        }
      } catch (e) { console.error(e); }
    });
    ws.addEventListener("close", () => this.clients.delete(ws));
  }
}
