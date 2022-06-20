import { useState } from "react";
import { useAssReducer, AssContextProvider } from "./assState";
import AssText from "./AssText";
import AssInput from "./AssInput";
import StatDisplay from "./StatDisplay";

function App() {
  const [state, dispatch] = useAssReducer();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  function handleLogin(event) {
    event.preventDefault();

    fetch("/login?" + new URLSearchParams({ username, password }), {
      method: "POST",
    })
      .then((res) => res.json())
      .then(setUser);
  }
  console.log("this is the user:", user);
  return (
    <div className="App">
      <form id="login" onSubmit={handleLogin}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Login!</button>
      </form>

      <AssContextProvider value={[state, dispatch]}>
        <AssText />
        <AssInput />
        {state.endTime && <StatDisplay />}
      </AssContextProvider>
    </div>
  );
}

export default App;
