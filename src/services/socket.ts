// Mock Socket Service to prevent errors
class SocketService {
    connect(userId: string) {
        // Mock implementation - do nothing
    }

    disconnect() {
        // Mock implementation - do nothing
    }

    sendMessage(data: { receiverId: string, text: string, senderId: string }) {
        // Mock implementation - do nothing
    }

    onMessage(callback: (message: any) => void) {
        // Mock implementation - do nothing
    }

    offMessage() {
        // Mock implementation - do nothing
    }

    joinProject(projectId: string) {
        // Mock implementation - do nothing
    }

    emitTaskUpdate(projectId: string, tasks: any[]) {
        // Mock implementation - do nothing
    }

    onTasksUpdated(handler: (tasks: any[]) => void) {
        // Mock implementation - do nothing
    }

    emitCodeChange(projectId: string, file: string, code: string) {
        // Mock implementation - do nothing
    }

    onCodeUpdated(handler: (data: { code: string, file: string }) => void) {
        // Mock implementation - do nothing
    }
}

export const socketService = new SocketService();