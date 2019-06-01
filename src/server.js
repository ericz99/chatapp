const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const bodyParser = require("body-parser");
const io = require("socket.io")(http);
const connectDB = require("./db");
const cors = require("cors");
const uuid = require("uuid/v4");

const { PORT, MONGO_URI } = require("./config");

app.use(cors());

// Predefined Global Variables
let rooms = [];
let connections = [];
let serverNames = [];
let names = [];
let messages = [];
let msg = {};
let version = "1.0.0";

(async () => {
  // Connect to dB
  await connectDB(MONGO_URI);

  // Middlewares
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Aad IOSocket
  io.on("connection", socket => {
    // Create new user
    socket.on("CREATE_NEW_USER", name => {
      serverNames = [...serverNames, { uid: socket.id, name }];
      names = [...names, { uid: socket.id, name }];
      socket.broadcast.emit("UPDATED_USER_LIST", names);
      socket.emit("UPDATED_USER_LIST", names);
    });

    // Get current user settings.
    socket.on("GET_CURRENT_USER", () => {
      const userSettings = names.find(val => val.uid === socket.id);
      socket.emit("SEND_CURRENT_USER_SETTINGS", userSettings);
    });

    // Get all rooms
    socket.on("GET_ALL_ROOM", () => socket.emit("ALL_ROOM", rooms));

    // Get all current users
    socket.on("GET_CURRENT_ONLINE_USER", () =>
      socket.emit("ONLINE_USERS", names)
    );

    // Create a new room
    socket.on("CREATE_NEW_ROOM", roomName => {
      rooms = [...rooms, { uid: uuid(), roomName }];
      socket.broadcast.emit("UPDATED_ROOM_LIST", rooms);
      socket.emit("UPDATED_ROOM_LIST", rooms);
    });

    // Join a room
    socket.on("JOIN_ROOM", roomName => {
      const foundRoom = rooms.find(val => val.roomName == roomName);
      if (foundRoom) {
        socket.join(foundRoom);
        socket.emit("SUCCESS", { room: foundRoom, status: "joined" });
      }
    });

    // Leave a room
    socket.on("LEAVE_ROOM", roomName => {
      const foundRoom = rooms.find(val => val.roomName == roomName);
      if (foundRoom) {
        socket.leave(foundRoom);
        socket.emit("SUCCESS", { roomName, status: "leave" });
      }
    });

    // Sending new message
    socket.on("SEND_MESSAGE", ({ msg, roomName }) => {
      const findRoomId = rooms.find(val => val.roomName === roomName);
      const findUser = names.find(val => val.uid === socket.id);
      if (io.sockets.adapter.rooms[findRoomId]) {
        messages = [
          ...messages,
          { uid: uuid(), msg, room: findRoomId, user: findUser }
        ];

        var keys = Object.keys(socket.rooms);
        for (var i = 0; i < keys.length; i++) {
          socket
            .to(socket.rooms[keys[i]])
            .broadcast.emit("NEW_MESSAGE", messages);
          io.to(socket.rooms[keys[i]]).emit("NEW_MESSAGE", messages);
        }
      }
    });

    // Update all messages if user join a room
    socket.on("UPDATE_MESSAGE", roomName => {
      const findRoom = rooms.find(val => val.roomName === roomName);
      if (io.sockets.adapter.rooms[findRoom]) {
        // send them updated messages
        var keys = Object.keys(socket.rooms);
        for (var i = 0; i < keys.length; i++) {
          socket
            .to(socket.rooms[keys[i]])
            .broadcast.emit("UPDATED_MESSAGE", messages);
          io.to(socket.rooms[keys[i]]).emit("UPDATED_MESSAGE", messages);
        }
      }
    });

    // Track if user is typing
    socket.on("USER_TYPING", name => {
      socket.broadcast.emit("USER_TYPING", name);
    });

    // Disconnect user - from room or closing browser
    socket.on("disconnect", () => {
      serverNames = serverNames.filter(data => data.uid !== socket.id);
      names = serverNames.map(data => data);
      socket.broadcast.emit("UPDATED_USER_LIST", names);
      socket.emit("UPDATED_USER_LIST", names);
    });
  });

  // Main API Routes
  app.use("/api/user", require("./routes/api/UserRoute"));

  // Listen to server port
  http.listen(PORT, () => console.log(`Server started on port ${PORT}`));
})();
