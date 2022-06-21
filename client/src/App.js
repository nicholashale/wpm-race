import { useState } from "react";
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
  // const [user, setUser] = useState(null);

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
