import { Http, WS } from "../deps.ts";
import { IWSHandler } from "../libs/interfaces/ws-handler-interface.ts";

/**
 * WebSocket server module
 */
export class WSocketServerModule {
  private _server?: Http.Server;
  public eventHandler?: IWSHandler;

  /**
   * Start server
   * @param port number Port number
   */
  public async start(
    port: number = 8080,
    isHttps: boolean = false,
  ): Promise<void> {
    if (isHttps) {
      /* TODO: IMPLEMENT HTTPS VERSION */
      this._server = Http.serve(`:${port}`);
    } else {
      this._server = Http.serve(`:${port}`);
    }

    /* Listen loop */
    for await (const req of this._server) {
      const { conn, r: bufReader, w: bufWriter, headers } = req;

      /* Accept client */
      WS.acceptWebSocket({
        conn,
        bufReader,
        bufWriter,
        headers,
      })
        .then(this.handleWs)
        .catch((reason: any) => this.rejectWs(req, reason));
    }
  }

  /**
   * Close
   */
  public async close(): Promise<void> {
    this._server?.close();
  }

  /**
   * Handle websocket connection
   * @param sock WebSocket webSocket object
   */
  private async handleWs(sock: WS.WebSocket): Promise<void> {
    this.eventHandler?.onConnectionAccepted(sock);

    try {
      for await (const ev of sock) {
        this.eventHandler?.onDataReceived(sock, ev);

        if (typeof ev === "string") {
          /* Text data */
          this.eventHandler?.onSocketTextDataReceived(sock, ev);
        } else if (ev instanceof Uint8Array) {
          /* Binary data */
          this.eventHandler?.onSocketBinayDataReceived(sock, ev);
        } else if (WS.isWebSocketPingEvent(ev)) {
          /* Ping */
          const [, body] = ev;
          this.eventHandler?.onSocketPing(sock, body);
        } else if (WS.isWebSocketCloseEvent(ev)) {
          /* close */
          // const { code, reason } = ev;
          this.eventHandler?.onSocketConnectionClosed(sock, ev);
        }
      }
    } catch (err) {
      if (!sock.isClosed) {
        await sock.close(1000)
          .then((data) => this.eventHandler?.onSocketConnectionClosed(sock))
          .catch(
            (reason) =>
              this.eventHandler?.onSocketConnectionError(sock, reason),
          );
      } else {
        this.eventHandler?.onSocketConnectionError(sock, err);
      }
    }
  }

  /**
   * Reject WSclient
   * @param req any
   * @param err any
   */
  private async rejectWs(req: any, reason: any): Promise<void> {
    this.eventHandler?.onConnectionReject(req, reason);

    await req.respond({ status: 400 });
  }
}
