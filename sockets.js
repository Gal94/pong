const listen = (io) => {
    let readyPlayerCount = 0;

    const pongNamespace = io.of('/pong');

    pongNamespace.on('connection', (socket) => {
        console.log('a user connected', socket.id);
        let room = 'room' + Math.floor(+readyPlayerCount / 2);

        // Tracks player ready
        socket.on('ready', () => {
            socket.join(room);
            console.log('Player ready', socket.id);
            readyPlayerCount++;

            if (readyPlayerCount === 2) {
                // 2nd player will be the referee
                pongNamespace.in(room).emit('startGame', socket.id);
            }
        });

        // Transfers paddle location
        socket.on('paddleMove', (paddleData) => {
            socket.to(room).emit('paddleMove', paddleData);
        });

        // Transfers ball location and game score
        socket.on('ballMove', (ballData) => {
            socket.to(room).emit('ballData', ballData);
        });

        // Disconnect from game
        socket.on('disconnect', (reason) => {
            console.log('here');
            readyPlayerCount--;
            if (readyPlayerCount < 0) {
                readyPlayerCount = 0;
            }
            console.log(`Client with ${socket.id} disconnected: ${reason}`);
            socket.leave(room);
        });
    });
};

module.exports = {
    listen,
};
