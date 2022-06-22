import { Server } from "socket.io";
import { createServer } from "http";
import randomWords from "random-words";

let roomState = {};

const io = new Server(createServer(), {
  cors: {
    origin: "http://localhost:4000",
  },
});

io.on("connection", (socket) => {
  socket.on("createLobby", (payload, cb) => {
    const lobbyCode = randomWords(1).join("").toUpperCase();
    socket.join(lobbyCode);
    cb({ lobbyCode });
    roomState[lobbyCode] = {
      text: payload.text,
      players: { [socket.id]: { ready: false } },
    };
  });
  socket.on("joinLobby", ({ lobbyCode }, cb) => {
    if (roomState.hasOwnProperty(lobbyCode)) {
      socket.join(lobbyCode);
      roomState[lobbyCode].players[socket.id] = { ready: false };
      cb(roomState[lobbyCode]);
      socket.to(lobbyCode).emit("playerJoined", roomState[lobbyCode].players);
    } else {
      socket.emit("failedJoin");
    }
  });
});

io.listen(3001);
