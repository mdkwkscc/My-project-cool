const express = require('express');
const http = require('http');
const { createBareServer } = require('@titaniumnetwork-dev/ultraviolet');

const app = express();
const server = http.createServer(app);
const bare = createBareServer('/bare/');

// Serve the frontend files (the proxy interface)
app.use(express.static(__dirname + '/public'));

server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Your private proxy is running on port ${PORT}`);
});
