import type { DurableObjectNamespace, DurableObjectState } from "@cloudflare/workers-types";

export interface Env {
  GAME_ROOM: DurableObjectNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const upgrade = request.headers.get("Upgrade");
    if (upgrade !== "websocket") {
      return new Response("WebSocket expected", { status: 400 });
    }

    const url = new URL(request.url);
    const roomId = url.searchParams.get("roomId") || "default";
    const id = env.GAME_ROOM.idFromName(roomId);
    const stub = env.GAME_ROOM.get(id);

    return await stub.fetch(request);
  },
};

export class GameRoom {
  state: DurableObjectState;
  clients = new Set<WebSocket>();

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    const [client, server] = Object.values(new WebSocketPair());
    server.accept();
    this.handleWebSocket(server);
    return new Response(null, { status: 101, webSocket: client });
  }

  handleWebSocket(ws: WebSocket): void {
    this.clients.add(ws);

    ws.addEventListener("message", async (msg) => {
      try {
        const text = await (msg.data as Blob).text();
        const data = JSON.parse(text);

        if (data.type === "updateGameState") {
          await this.state.storage.put(`state-${data.gameId}`, data.state);
          for (const c of this.clients) {
            if (c.readyState === WebSocket.OPEN) {
              c.send(JSON.stringify({ type: "gameStateUpdate", state: data.state }));
            }
          }
        } else if (data.type === "joinGame") {
          const saved = await this.state.storage.get(`state-${data.gameId}`);
          if (saved) ws.send(JSON.stringify({ type: "gameStateUpdate", state: saved }));
        }
      } catch (e) {
        console.error("Parse error:", e);
      }
    });

    ws.addEventListener("close", () => this.clients.delete(ws));
  }
}