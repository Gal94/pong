const api = require('./api');
const server = require('http').createServer(api);
const io = require('socket.io')(server);

const sockets = require('./sockets');

const PORT = process.env.PORT || 3000;
server.listen(PORT);
sockets.listen(io);
