var fs = require("fs");
const express = require("express");
const app = express();
const https = require("https");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());
var options = {
  key: fs.readFileSync(""),
  cert: fs.readFileSync(""),
  ca: fs.readFileSync(""),
};

const server = https.createServer(options, app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`New user Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User ID ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User has Disconnected", socket.id);
  });
});

server.listen(443, () => {
  console.log("Server running.");
});
