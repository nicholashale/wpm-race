import { createServer } from "http";

import pokemon from "pokemon";
import { Server } from "socket.io";

let roomState = {};

const io = new Server(createServer(), {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
  },
});

io.on("connection", (socket) => {
  socket.on("createLobby", (payload, cb) => {
    const lobbyCode = pokemon.random().toUpperCase();
    socket.join(lobbyCode);
    roomState[lobbyCode] = {
      text: payload.text,
      players: { [payload.username]: { absPosition: 0 } },
      host: payload.username,
    };
    cb({ ...roomState[lobbyCode], lobbyCode });
  });

  socket.on("joinLobby", ({ lobbyCode, username }, cb) => {
    if (roomState.hasOwnProperty(lobbyCode)) {
      socket.join(lobbyCode);
      roomState[lobbyCode].players[username] = { absPosition: 0 };
      cb({ ...roomState[lobbyCode], lobbyCode });
      socket.to(lobbyCode).emit("playerJoined", roomState[lobbyCode].players);
    } else {
      socket.emit("failedJoin");
    }
  });

  socket.on("assProgress", ({ absPosition, lobbyCode, username }) => {
    roomState[lobbyCode].players[username].absPosition = absPosition;
    socket.to(lobbyCode).emit("assProgress", roomState[lobbyCode].players);
  });
});

io.listen(process.env.PORT);

console.log(`Listening on ${process.env.PORT}`);
