declare module 'ws' {
  export class WebSocketServer {
    constructor(options?: any);
    on(event: string, listener: (...args: any[]) => void): this;
    close(cb?: () => void): void;
  }
  export class WebSocket {
    static readonly OPEN: number;
    static readonly CLOSED: number;
    static readonly CLOSING: number;
    static readonly CONNECTING: number;
    readyState: number;
    send(data: any, cb?: (err?: any) => void): void;
    close(code?: number, data?: string): void;
    on(event: string, listener: (...args: any[]) => void): this;
  }
}