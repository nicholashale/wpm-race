import { Server } from "socket.io";
import { createServer } from "http";
import randomWords from "random-words";

const io = new Server(createServer(), {
  cors: {
    origin: "http://localhost:4000",
  },
});

io.on("connection", (client) => {
  client.on("createLobby", (payload) => {
    const lobbyCode = randomWords(1).join("").toUpperCase();
    client.join(lobbyCode);
    client.emit("createdLobby", { lobbyCode });
    client.to(lobbyCode).emit("setText", { text: payload.text });
  });
});

io.listen(3001);
