import { useState } from "react";
import { useAuthContext } from "./authState";

export default function Auth() {
  const [authState, authDispatch] = useAuthContext();

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

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

  return (
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
  );
}
