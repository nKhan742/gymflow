import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { logger } from '../logger/winston.logger.js';

interface IClientInfo {
  ws: WebSocket;
  userId?: string;
  email?: string;
  role?: string;
}

const clients = new Set<IClientInfo>();

export function initWebSocketServer(httpServer: HttpServer): WebSocketServer {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req: any) => {
    const clientInfo: IClientInfo = { ws };
    clients.add(clientInfo);
    logger.info(`[WebSocket] New client connected from ${req?.socket?.remoteAddress}. Total active: ${clients.size}`);

    ws.on('message', (messageRaw: string) => {
      try {
        const payload = JSON.parse(messageRaw.toString());
        if (payload.type === 'auth') {
          clientInfo.userId = payload.userId ? String(payload.userId) : undefined;
          clientInfo.email = payload.email ? String(payload.email).toLowerCase().trim() : undefined;
          clientInfo.role = payload.role ? String(payload.role).toUpperCase().trim() : undefined;
          logger.info(`[WebSocket] Client authenticated: user=${clientInfo.userId || clientInfo.email} role=${clientInfo.role}`);
          ws.send(JSON.stringify({ type: 'authenticated', success: true }));
        } else if (payload.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong' }));
        } else if (payload.type === 'notify_user') {
          sendRealtimeNotification({
            targetUserId: payload.targetUserId,
            targetRole: payload.targetRole,
            title: payload.title,
            message: payload.message,
            type: payload.notificationType || 'info',
            sound: true,
            metadata: payload.metadata,
          });
        }
      } catch (err: any) {
        logger.warn('[WebSocket] Error parsing message:', err);
      }
    });

    ws.on('close', () => {
      clients.delete(clientInfo);
      logger.info(`[WebSocket] Client disconnected. Total active: ${clients.size}`);
    });

    ws.on('error', (err: any) => {
      logger.warn('[WebSocket] Socket error:', err);
      clients.delete(clientInfo);
    });

    ws.send(JSON.stringify({
      type: 'connected',
      message: 'Connected to GymFlow Real-Time Enterprise Event Gateway',
      timestamp: new Date().toISOString(),
    }));
  });

  logger.info('[WebSocket] Enterprise Event Gateway initialized on /ws');
  return wss;
}

export interface IRealtimeNotificationPayload {
  targetUserId?: string;
  targetRole?: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  sound?: boolean;
  metadata?: Record<string, any>;
  timestamp?: string;
}

export function sendRealtimeNotification(payload: IRealtimeNotificationPayload): void {
  const normTargetUserId = payload.targetUserId ? String(payload.targetUserId) : undefined;
  const normTargetRole = payload.targetRole ? String(payload.targetRole).toUpperCase().trim() : undefined;
  const outbound = JSON.stringify({
    type: 'notification',
    title: payload.title,
    message: payload.message,
    notificationType: payload.type || 'info',
    sound: payload.sound !== false,
    metadata: payload.metadata || {},
    timestamp: payload.timestamp || new Date().toISOString(),
  });

  let deliveredCount = 0;

  for (const client of clients) {
    if (client.ws.readyState !== WebSocket.OPEN) continue;

    let shouldDeliver = false;
    if (!normTargetUserId && !normTargetRole) {
      shouldDeliver = true;
    } else {
      if (normTargetUserId && (client.userId === normTargetUserId || client.email === normTargetUserId.toLowerCase())) {
        shouldDeliver = true;
      }
      if (normTargetRole && client.role === normTargetRole) {
        shouldDeliver = true;
      }
    }

    if (shouldDeliver) {
      try {
        client.ws.send(outbound);
        deliveredCount++;
      } catch (err) {
        logger.warn('[WebSocket] Error sending notification to client:', err);
      }
    }
  }

  logger.info(`[WebSocket] Dispatched real-time notification: "${payload.title}" to ${deliveredCount} client(s)`);
}