import { useState } from "react";
import { useAuthContext } from "./authState";

export default function Auth() {
  const [authState, authDispatch] = useAuthContext();

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordConfirmationInput, setPasswordConfirmationInput] =
    useState("");
  const [wantsLogin, setWantsLogin] = useState(false);

  function handleLogin(event) {
    event.preventDefault();

    fetch(
      `${process.env.REACT_APP_API_ORIGIN}/login?` +
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
          type: "AUTH_SUCCESS",
          payload: { id: user.id, username: user.username },
        })
      );
  }

  function handleSignup(event) {
    event.preventDefault();

    fetch(
      `${process.env.REACT_APP_API_ORIGIN}/signup?` +
        new URLSearchParams({
          username: usernameInput,
          password: passwordInput,
          password_confirmation: passwordConfirmationInput,
        }),
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((user) =>
        authDispatch({
          type: "AUTH_SUCCESS",
          payload: { id: user.id, username: user.username },
        })
      );
  }

  const signupForm = (
    <form id="signup" onSubmit={handleSignup}>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        value={usernameInput}
        onChange={(e) => setUsernameInput(e.target.value)}
      />
      <br />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        value={passwordInput}
        onChange={(e) => setPasswordInput(e.target.value)}
      />
      <br />
      <label htmlFor="passwordConfirmation">Password Confirmation:</label>
      <input
        type="password"
        id="passwordConfirmation"
        value={passwordConfirmationInput}
        onChange={(e) => setPasswordConfirmationInput(e.target.value)}
      />
      <br />

      <button type="submit">Sign up!</button>
    </form>
  );

  const loginForm = (
    <form id="login" onSubmit={handleLogin}>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        value={usernameInput}
        onChange={(e) => setUsernameInput(e.target.value)}
      />
      <br />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        value={passwordInput}
        onChange={(e) => setPasswordInput(e.target.value)}
      />
      <br />
      <button type="submit">Sign in!</button>
    </form>
  );

  return (
    <div id="auth-form">
      {authState.username ? (
        <p>Welcome {authState.username}!</p>
      ) : (
        <>
          <button onClick={() => setWantsLogin(!wantsLogin)}>
            {wantsLogin
              ? "New user? Click here to sign up."
              : "Already have an account? Click here to login."}
          </button>
          {wantsLogin ? loginForm : signupForm}
        </>
      )}
    </div>
  );
}
