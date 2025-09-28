// socket/chat.js - Socket.io chat handler for mentorship sessions
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join chat room for mentorship session
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
      // Notify others in room
      socket.to(roomId).emit('userJoined', { userId: socket.id, message: 'A user joined the chat' });
    });

    // Send chat message
    socket.on('sendMessage', (data) => {
      const { roomId, message, senderId, senderName } = data;
      const timestamp = new Date().toISOString();
      
      // Broadcast to room
      io.to(roomId).emit('receiveMessage', {
        roomId,
        message,
        senderId,
        senderName,
        timestamp
      });

      console.log(`Message sent in room ${roomId}: ${message}`);
    });

    // Leave room
    socket.on('leaveRoom', (roomId) => {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${roomId}`);
      socket.to(roomId).emit('userLeft', { userId: socket.id, message: 'A user left the chat' });
    });

    // Typing indicator
    socket.on('typing', (data) => {
      socket.to(data.roomId).emit('userTyping', { userId: socket.id, isTyping: data.isTyping });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      // Notify rooms if needed
    });
  });
};
