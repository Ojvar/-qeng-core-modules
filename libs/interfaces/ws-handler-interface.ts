import { Http, WS } from "../../deps.ts";

/**
 * WebSocket handler interface
 */
export interface IWSHandler {
  onConnectionAccepted(socket: WS.WebSocket): Promise<void>;

  onSocketConnectionClosed(
    socket: WS.WebSocket,
    resson?: WS.WebSocketEvent,
  ): Promise<void>;

  onSocketPing(
    socket: WS.WebSocket,
    data: Uint8Array,
  ): Promise<void>;

  onSocketBinayDataReceived(
    socket: WS.WebSocket,
    data: Uint8Array,
  ): Promise<void>;

  onSocketTextDataReceived(
    socket: WS.WebSocket,
    data: string,
  ): Promise<void>;

  onSocketConnectionError(socket: WS.WebSocket, reason: any): Promise<void>;

  onConnectionReject(req: Http.ServerRequest, reason: any): Promise<void>;

  onDataReceived(socket: WS.WebSocket, data: WS.WebSocketEvent): Promise<void>;
}
