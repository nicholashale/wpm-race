import { io } from "socket.io-client";
import { useState, useEffect, useMemo } from "react";

import { usePvpContext } from "./pvpState";
import { useAssContext } from "./assState";

export default function Pvp() {
  const [pvpState, pvpDispatch] = usePvpContext();
  const [assState, assDispatch] = useAssContext();

  const [lobbyCodeInput, setLobbyCodeInput] = useState("");

  const socket = useMemo(() => {
    return io(process.env.REACT_APP_PVP_ORIGIN);
  }, []);

  useEffect(() => {
    if (socket) {
      //handle failedJoin event
      socket.on("setText", (payload) => alert(payload.text));
      socket.on("playerJoined", (players) =>
        pvpDispatch({ type: "SET_PLAYERS", payload: players })
      );
    }
  }, [socket, pvpDispatch]);

  function handleCreateLobby() {
    socket.emit("createLobby", { text: assState.text }, (payload) =>
      pvpDispatch({ type: "SET_LOBBY", payload: payload.lobbyCode })
    );
  }

  function handleJoinLobby(e) {
    e.preventDefault();
    socket.emit("joinLobby", { lobbyCode: lobbyCodeInput }, (payload) => {
      assDispatch({ type: "RECEIVED_TEXT", payload: payload.text });
      pvpDispatch({ type: "SET_PLAYERS", payload: payload.players });
    });
  }
  return (
    <div>
      {pvpState.lobbyCode && `Your lobby code is ${pvpState.lobbyCode}`}
      {!pvpState.lobbyCode && (
        <>
          <button onClick={handleCreateLobby}>Create Lobby!</button>
          <form id="join-lobby" onSubmit={handleJoinLobby}>
            <input
              type="text"
              value={lobbyCodeInput}
              onChange={(e) => setLobbyCodeInput(e.target.value)}
            />
            <button type="submit">Join Lobby!</button>
          </form>
        </>
      )}
      {pvpState.players && (
        <p>Players: {Object.keys(pvpState.players).join(", ")}</p>
      )}
    </div>
  );
}
