const { Server } = require('socket.io');

const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CWD_ORIGIN || 'http://localhost:3000',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('join', (userId) => {
            socket.join(`user-${userId}`);
            console.log(`User ${userId} joined their room`);
        });

        socket.on('sendMessage', (data) => {
            const { receiverId, text, senderId } = data;
            // Emit to the specific receiver
            io.to(`user-${receiverId}`).emit('receiveMessage', {
                senderId,
                text,
                timestamp: new Date()
            });
        });

        // --- WebRTC Signaling ---
        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
            socket.to(roomId).emit('userJoined', socket.id);
        });

        socket.on('signal', (data) => {
            const { to, from, signal } = data;
            io.to(to).emit('signal', { from, signal });
        });

        socket.on('leaveRoom', (roomId) => {
            socket.leave(roomId);
            socket.to(roomId).emit('userLeft', socket.id);
        });

        // --- Project Collaboration ---
        socket.on('joinProject', (projectId) => {
            socket.join(`project-${projectId}`);
            console.log(`User ${socket.id} joined project room: project-${projectId}`);
        });

        socket.on('updateTasks', (data) => {
            const { projectId, tasks } = data;
            socket.to(`project-${projectId}`).emit('tasksUpdated', tasks);
        });

        socket.on('codeChange', (data) => {
            const { projectId, code, file } = data;
            socket.to(`project-${projectId}`).emit('codeUpdated', { code, file });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};

module.exports = initSocket;
