import rw from "random-words";
import { useState } from "react";

import { usePvpContext } from "./pvpState";
import { useAssContext } from "./assState";
import { useAuthContext } from "./authState";

export default function Pvp() {
  const [pvpState, pvpDispatch] = usePvpContext();
  const [assState, assDispatch] = useAssContext();
  const [authState, authDispatch] = useAuthContext();

  const [lobbyCodeInput, setLobbyCodeInput] = useState("");

  function getAnonUsernameIfNecessary() {
    let username = authState.username;
    if (!username) {
      username = `anon-${rw(1).join("")}`;
      authDispatch({
        type: "SET_ANON_USERNAME",
        payload: { username },
      });
    }
    return username;
  }

  function handleCreateLobby() {
    const username = getAnonUsernameIfNecessary();
    pvpState.socket.emit(
      "createLobby",
      { text: assState.text, username },
      (payload) => pvpDispatch({ type: "SET_LOBBY", payload: payload })
    );
  }

  function handleJoinLobby(e) {
    const username = getAnonUsernameIfNecessary();
    e.preventDefault();
    pvpState.socket.emit(
      "joinLobby",
      { lobbyCode: lobbyCodeInput, username },
      (payload) => {
        pvpDispatch({ type: "SET_LOBBY", payload: payload });
        //pvpDispatch({ type: "SET_PLAYERS", payload: payload.players });
        assDispatch({ type: "RECEIVED_TEXT", payload: payload.text });
      }
    );
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
        <>
          <br />
          <span>
            Players:{" "}
            {Object.keys(pvpState.players).map((player, index) =>
              player === pvpState.host ? (
                <strong key={index}>{player} </strong>
              ) : (
                <span key={index}>{player} </span>
              )
            )}
          </span>
        </>
      )}
    </div>
  );
}
