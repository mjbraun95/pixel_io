const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

io.on('connection', socket => {
    console.log('New player connected');

    socket.on('disconnect', () => {
        console.log('Player disconnected');
    });

    // Add more socket event listeners for game logic
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
