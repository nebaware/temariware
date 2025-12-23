import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../config';

class RealTimeService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(userId: string) {
    if (this.socket?.connected) return;

    this.socket = io(API_BASE_URL, {
      auth: {
        token: localStorage.getItem('tm_token')
      }
    });

    this.socket.on('connect', () => {
      console.log('🔗 Connected to real-time server');
      this.socket?.emit('join-user-room', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from real-time server');
    });

    // Listen for real-time events
    this.socket.on('notification', (data) => {
      this.emit('notification', data);
    });

    this.socket.on('job-update', (data) => {
      this.emit('job-update', data);
    });

    this.socket.on('wallet-update', (data) => {
      this.emit('wallet-update', data);
    });

    this.socket.on('message', (data) => {
      this.emit('message', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  // Send real-time events
  sendMessage(receiverId: string, message: string) {
    this.socket?.emit('send-message', { receiverId, message });
  }

  joinJobRoom(jobId: string) {
    this.socket?.emit('join-job-room', jobId);
  }

  leaveJobRoom(jobId: string) {
    this.socket?.emit('leave-job-room', jobId);
  }
}

export const realTimeService = new RealTimeService();