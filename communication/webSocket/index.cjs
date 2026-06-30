const express = require('express');
const { createServer } = require('node:http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.emit('your id', socket.id); //Sent the client its own socket ID
// Listened for incoming chat message events:
// If the client includes a recipientId, the server sends the message only to that recipient.
// Otherwise, the message is sent to everyone.
  socket.on('chat message', (data) => {
    const message = typeof data === 'string' ? data : data?.message;
    const recipientId = typeof data === 'string' ? '' : data?.recipientId;

    if (recipientId) {
      // send the message to one specific connected client whose socket ID is recipientId.
      socket.to(recipientId).emit('chat message', {
        from: socket.id,
        message
      });
// sends the message back to the sender only.
      socket.emit('chat message', {
        from: 'You',
        to: recipientId,
        message
      });
    } else {
      io.emit('chat message', {
        from: socket.id,
        message
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
// This makes the app run and available in the browser.
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


  

