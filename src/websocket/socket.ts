import { Server } from 'socket.io';

const io = new Server();

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

    // Additional event listeners can be added here
});

export default io;