// Mock RealTime Service to prevent errors
class RealTimeService {
  connect(userId: string) {
    // Mock implementation - do nothing
  }

  disconnect() {
    // Mock implementation - do nothing
  }

  on(event: string, callback: Function) {
    // Mock implementation - do nothing
  }

  off(event: string, callback: Function) {
    // Mock implementation - do nothing
  }

  sendMessage(receiverId: string, message: string) {
    // Mock implementation - do nothing
  }

  joinJobRoom(jobId: string) {
    // Mock implementation - do nothing
  }

  leaveJobRoom(jobId: string) {
    // Mock implementation - do nothing
  }
}

export const realTimeService = new RealTimeService();