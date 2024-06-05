const { Server } = require('socket.io');
const http = require('http');
const app = require('../../app');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    },
});

io.listen(2999);

module.exports = io;
