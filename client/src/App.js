import { useState, useMemo, useEffect } from "react";
import { io } from "socket.io-client";
import { useAssReducer, AssContextProvider } from "./assState";
import { usePvpReducer, PvpContextProvider } from "./pvpState";
import { useAuthReducer, AuthContextProvider } from "./authState";
import AssText from "./AssText";
import StatDisplay from "./StatDisplay";
import SaveButton from "./SaveButton";

function App() {
  const [assState, assDispatch] = useAssReducer();
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authState, authDispatch] = useAuthReducer();
  const [lobbyCodeInput, setLobbyCodeInput] = useState("");
  const [pvpState, pvpDispatch] = usePvpReducer();
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

  function handleLogin(event) {
    event.preventDefault();

    fetch(
      `${process.env.REACT_APP_API_ORIGIN}/api/login?` +
        new URLSearchParams({
          username: usernameInput,
          password: passwordInput,
        }),
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((user) =>
        authDispatch({
          type: "LOGIN",
          payload: { id: user.id, username: user.username },
        })
      );
  }
  console.log(
    "this is the user:",
    authState.username,
    "authstate.id:",
    authState.id
  );

  return (
    <AuthContextProvider value={[authState, authDispatch]}>
      <div className="App">
        <form id="login" onSubmit={handleLogin}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={usernameInput}
            onChange={(e) => {
              e.preventDefault();
              setUsernameInput(e.target.value);
            }}
          />
          <br />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={passwordInput}
            onChange={(e) => {
              e.preventDefault();
              setPasswordInput(e.target.value);
            }}
          />
          <br />
          <button type="submit">Login!</button>
        </form>

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
        <AssContextProvider value={[assState, assDispatch]}>
          <AssText />
          {assState.endTime && <StatDisplay />}
          {assState.endTime && authState.username && <SaveButton />}
        </AssContextProvider>
      </div>
    </AuthContextProvider>
  );
}

export default App;
