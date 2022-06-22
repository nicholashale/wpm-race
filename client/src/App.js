import { useState, useMemo, useEffect } from "react";
import { io } from "socket.io-client";
import { useAssReducer, AssContextProvider } from "./assState";
import { useAuthReducer, AuthContextProvider } from "./authState";
import AssText from "./AssText";
import StatDisplay from "./StatDisplay";
import SaveButton from "./SaveButton";

function App() {
  const [assState, assDispatch] = useAssReducer();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authState, authDispatch] = useAuthReducer();
  const [lobbyCode, setLobbyCode] = useState(null);
  const [lobbyCodeInput, setLobbyCodeInput] = useState("");
  const socket = useMemo(() => io("http://localhost:3001"), []);

  useEffect(() => {
    if (socket) {
      //handle failedJoin event
      socket.on("setText", (payload) => alert(payload.text));
    }
  }, [socket]);

  function handleCreateLobby() {
    socket.emit("createLobby", { text: assState.text }, (payload) =>
      setLobbyCode(payload.lobbyCode)
    );
  }

  function handleJoinLobby(e) {
    e.preventDefault();
    socket.emit("joinLobby", { lobbyCode: lobbyCodeInput }, (payload) => {
      console.log("joined lobby");
      assDispatch({ type: "RECEIVED_TEXT", payload: payload.text });
    });
  }

  function handleLogin(event) {
    event.preventDefault();

    fetch("/api/login?" + new URLSearchParams({ username, password }), {
      method: "POST",
    })
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
            value={username}
            onChange={(e) => {
              e.preventDefault();
              setUsername(e.target.value);
            }}
          />
          <br />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              e.preventDefault();
              setPassword(e.target.value);
            }}
          />
          <br />
          <button type="submit">Login!</button>
        </form>

        <div>
          {lobbyCode && `Your lobby code is ${lobbyCode}`}
          {!lobbyCode && (
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
