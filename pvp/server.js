import { Server } from "socket.io";
import { createServer } from "http";
import randomWords from "random-words";

let roomState = {};

const io = new Server(createServer(), {
  cors: {
    origin: "http://localhost:4000",
  },
});

io.on("connection", (client) => {
  client.on("createLobby", (payload, cb) => {
    const lobbyCode = randomWords(1).join("").toUpperCase();
    client.join(lobbyCode);
    cb({ lobbyCode });
    roomState[lobbyCode] = { text: payload.text };
    //client.to(lobbyCode).emit("setText", { text: payload.text });
  });
  client.on("joinLobby", (payload, cb) => {
    if (roomState.hasOwnProperty(payload.lobbyCode)) {
      client.join(payload.lobbyCode);
      cb({ text: roomState[payload.lobbyCode].text });
    } else {
      client.emit("failedJoin");
    }
  });
});

io.listen(3001);
