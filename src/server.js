const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(http);

const { PORT } = require('./config');

// Predefined Global Variables
let connections = [];
let users = []; // takes an object => { isOnline: true || isOnline: false, isAdmin: true }
let rooms = []; // takes an object => { maxCapacity: 100 }
let version = "1.0.0";
let ipAddress = "";

(async () => {
    // Setting up our static path
    app.use(express.static(path.join(__dirname, '../static')))

    // Getting our static html
    app.get('/', (req, res, next) => {
        res.sendFile(path.resolve(__dirname, "../static/public/index.html"));
    })

    // Aad IOSocket 
    io.on("connection", (socket) => {
        if (socket.connected) {
            connections.push(socket);
            console.log("Connected: %s sockets connected", connections.length);
        }

        socket.on('disconnect', () => {
            if (socket.disconnected) {
                connections.splice(connections.indexOf(socket), 1);
                console.log("Disconnected: %s sockets disconnected", connections.length);
            }
        })
    });

    // Listen to server port
    http.listen(PORT, () => console.log(`Server started on port ${PORT}`));
})()