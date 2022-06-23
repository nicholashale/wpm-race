import { useCallback, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

import { useAssReducer, AssContextProvider } from "./assState";
import { usePvpReducer, PvpContextProvider } from "./pvpState";
import { useAuthReducer, AuthContextProvider } from "./authState";

import AssContainer from "./AssContainer";
import Auth from "./Auth";
import Pvp from "./Pvp";
import styles from "./App.module.css";

const ALPHA_LOWER = "abcdefghijklmnopqrstuvwxyz".split("");

function App() {
  const [assState, assDispatch] = useAssReducer();
  const [authState, authDispatch] = useAuthReducer();
  const [pvpState, pvpDispatch] = usePvpReducer();

  const socket = useMemo(() => {
    return io(process.env.REACT_APP_PVP_ORIGIN);
  }, []);

  useEffect(() => {
    if (socket) {
      pvpDispatch({ type: "SET_SOCKET", payload: socket });
      //handle failedJoin event
      socket.on("setText", (payload) => alert(payload.text));
      socket.on("playerJoined", (players) =>
        pvpDispatch({ type: "SET_PLAYERS", payload: players })
      );
      socket.on("assProgress", (players) =>
        pvpDispatch({ type: "SET_PLAYERS", payload: players })
      );
    }
  }, [socket, pvpDispatch]);

  const handleKeystroke = useCallback(
    (e) => {
      if (!assState.isFocused) {
        return;
      }

      if (e.key === "Escape") {
        assDispatch({ type: "RESTART_ASS" });
        return;
      }

      if (ALPHA_LOWER.includes(e.key)) {
        if (!assState.startTime) {
          assDispatch({ type: "START_ASS" });
        }
        assDispatch({ type: "LETTER", payload: e.key });
      }
      if (e.key === " ") {
        assDispatch({ type: "SPACE" });
      }
      if (e.key === "Backspace") {
        assDispatch({ type: "BACKSPACE" });
      }
      if (pvpState.lobbyCode) {
        socket.emit("assProgress", {
          absPosition: assState.absPosition + 1,
          lobbyCode: pvpState.lobbyCode,
          username: authState.username,
        });
      }
    },
    [assState, assDispatch, socket, pvpState, authState]
  );

  useEffect(() => {
    document.addEventListener("keyup", handleKeystroke);
    return () => {
      document.removeEventListener("keyup", handleKeystroke);
    };
  }, [handleKeystroke]);

  return (
    <AuthContextProvider value={[authState, authDispatch]}>
      <AssContextProvider value={[assState, assDispatch]}>
        <PvpContextProvider value={[pvpState, pvpDispatch]}>
          <div id={styles.app}>
            <Auth />
            <Pvp />
            <AssContainer />
          </div>
        </PvpContextProvider>
      </AssContextProvider>
    </AuthContextProvider>
  );
}

export default App;
