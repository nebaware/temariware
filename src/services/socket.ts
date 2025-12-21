import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

class SocketService {
    private socket: Socket | null = null;

    connect(userId: string) {
        if (this.socket) return;

        this.socket = io(SOCKET_URL);

        this.socket.on('connect', () => {
            console.log('Connected to socket server');
            this.socket?.emit('join', userId);
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    sendMessage(data: { receiverId: string, text: string, senderId: string }) {
        this.socket?.emit('sendMessage', data);
    }

    onMessage(callback: (message: any) => void) {
        this.socket?.on('receiveMessage', callback);
    }

    offMessage() {
        this.socket?.off('receiveMessage');
    }

    // --- Project Collaboration ---
    joinProject(projectId: string) {
        this.socket?.emit('joinProject', projectId);
    }

    emitTaskUpdate(projectId: string, tasks: any[]) {
        this.socket?.emit('updateTasks', { projectId, tasks });
    }

    onTasksUpdated(handler: (tasks: any[]) => void) {
        this.socket?.on('tasksUpdated', handler);
    }

    emitCodeChange(projectId: string, file: string, code: string) {
        this.socket?.emit('codeChange', { projectId, file, code });
    }

    onCodeUpdated(handler: (data: { code: string, file: string }) => void) {
        this.socket?.on('codeUpdated', handler);
    }
}

export const socketService = new SocketService();
