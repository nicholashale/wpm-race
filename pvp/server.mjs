import { createServer } from "http";

import randomWords from "random-words";
import { Server } from "socket.io";

let roomState = {};

const io = new Server(createServer(), {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
  },
});

io.on("connection", (socket) => {
  socket.on("createLobby", (payload, cb) => {
    const lobbyCode = randomWords(1).join("").toUpperCase();
    socket.join(lobbyCode);
    roomState[lobbyCode] = {
      text: payload.text,
      players: { [payload.username]: {} },
      host: payload.username,
    };
    cb({ ...roomState[lobbyCode], lobbyCode });
  });

  socket.on("joinLobby", ({ lobbyCode, username }, cb) => {
    if (roomState.hasOwnProperty(lobbyCode)) {
      socket.join(lobbyCode);
      roomState[lobbyCode].players[username] = {};
      cb({ ...roomState[lobbyCode], lobbyCode });
      socket.to(lobbyCode).emit("playerJoined", roomState[lobbyCode].players);
    } else {
      socket.emit("failedJoin");
    }
  });
});

io.listen(process.env.PORT);

console.log(`Listening on ${process.env.PORT}`);
