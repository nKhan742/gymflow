import { playNotificationSound } from './soundNotification';
import { toast } from 'sonner';
import { invalidateApiCache } from '../api/liveApiCache';

export interface IRealtimeEvent {
  type?: 'notification' | 'notify_user';
  title: string;
  message: string;
  notificationType?: 'info' | 'success' | 'warning' | 'error';
  sound?: boolean;
  targetUserId?: string;
  targetRole?: string;
  metadata?: Record<string, any>;
  timestamp?: string;
}

type NotificationListener = (event: IRealtimeEvent) => void;

class RealtimeNotificationService {
  private socket: WebSocket | null = null;
  private channel: BroadcastChannel | null = null;
  private listeners: Set<NotificationListener> = new Set();
  private reconnectTimeout: any = null;
  private isConnecting = false;
  private currentUser: { id?: string; email?: string; role?: string } | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('gymflow_realtime_events');
      this.channel.onmessage = (e) => {
        if (e.data && e.data.type === 'notification') {
          this.handleIncomingNotification(e.data, false);
        }
      };
    }
  }

  public connect(user: { id?: string; email?: string; role?: string } | null) {
    this.currentUser = user;
    if (!user) {
      this.disconnect();
      return;
    }

    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      this.authenticateSocket();
      return;
    }

    this.initSocket();
  }

  public disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.socket) {
      try {
        this.socket.close();
      } catch {}
      this.socket = null;
    }
  }

  private initSocket() {
    if (this.isConnecting) return;
    this.isConnecting = true;

    try {
      const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
      const wsHost = isHttps
        ? 'wss://gymflow-api-2jdh.onrender.com/ws'
        : 'ws://localhost:5000/ws';

      this.socket = new WebSocket(wsHost);

      this.socket.onopen = () => {
        this.isConnecting = false;
        this.authenticateSocket();
      };

      this.socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'notification') {
            this.handleIncomingNotification(payload, true);
          }
        } catch {}
      };

      this.socket.onclose = () => {
        this.isConnecting = false;
        this.socket = null;
        // Reconnect after 8 seconds
        if (this.currentUser) {
          this.reconnectTimeout = setTimeout(() => this.initSocket(), 8000);
        }
      };

      this.socket.onerror = () => {
        this.isConnecting = false;
      };
    } catch {
      this.isConnecting = false;
    }
  }

  private authenticateSocket() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN && this.currentUser) {
      this.socket.send(
        JSON.stringify({
          type: 'auth',
          userId: this.currentUser.id,
          email: this.currentUser.email,
          role: this.currentUser.role,
        })
      );
    }
  }

  public handleIncomingNotification(event: IRealtimeEvent, broadcastLocally: boolean) {
    // Check if event targets this user
    const curUserId = this.currentUser?.id;
    const curEmail = this.currentUser?.email?.toLowerCase().trim();
    const curRole = this.currentUser?.role?.toUpperCase().trim();

    let matches = false;
    if (!event.targetUserId && !event.targetRole) {
      matches = true;
    } else {
      if (event.targetUserId && (event.targetUserId === curUserId || event.targetUserId.toLowerCase() === curEmail)) {
        matches = true;
      }
      if (event.targetRole && event.targetRole.toUpperCase() === curRole) {
        matches = true;
      }
    }

    if (!matches) return;

    // 1. Play synthesized chime
    if (event.sound !== false) {
      playNotificationSound();
    }

    // 2. Display toast notification
    const title = event.title || 'System Notification';
    const message = event.message || '';
    if (event.notificationType === 'success') {
      toast.success(title, { description: message, duration: 6000 });
    } else if (event.notificationType === 'error') {
      toast.error(title, { description: message, duration: 6000 });
    } else if (event.notificationType === 'warning') {
      toast.warning(title, { description: message, duration: 6000 });
    } else {
      toast.info(title, { description: message, duration: 6000 });
    }

    // 3. Invalidate relevant caches if metadata specifies resource
    if (event.metadata?.resource) {
      invalidateApiCache(event.metadata.resource);
    }

    // 4. Update and synchronize permissions dynamically in real-time
    try {
      import('../store/authStore').then(({ useAuthStore }) => {
        const store = useAuthStore.getState();
        if (event.metadata?.permissions && Array.isArray(event.metadata.permissions)) {
          store.updateUserPermissions(event.metadata.permissions);
        }
        store.refreshPermissions();
      });
    } catch {}

    // 4. Notify registered listeners (e.g. AppLayout notification bell)
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch {}
    });

    // 5. Broadcast to other open tabs in the browser
    if (broadcastLocally && this.channel) {
      try {
        this.channel.postMessage(event);
      } catch {}
    }
  }

  public subscribe(listener: NotificationListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public dispatchNotification(event: Omit<IRealtimeEvent, 'type'>) {
    const fullEvent: IRealtimeEvent = {
      ...event,
      type: 'notification',
      timestamp: new Date().toISOString(),
    };

    // 1. Send through WebSocket if connected
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          ...fullEvent,
          type: 'notify_user',
        })
      );
    }

    // 2. Broadcast to other tabs
    if (this.channel) {
      try {
        this.channel.postMessage(fullEvent);
      } catch {}
    }

    // 3. Deliver to local active tab
    this.handleIncomingNotification(fullEvent, false);
  }
}

export const realtimeService = new RealtimeNotificationService();