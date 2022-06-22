import { createContext, useContext, useReducer } from "react";

export const usePvpReducer = () => useReducer(pvpReducer, initialPvpState);
export const usePvpContext = () => useContext(pvpContext);

const initialPvpState = {
  lobbyCode: null,
  players: null,
};

const pvpContext = createContext();

export const PvpContextProvider = pvpContext.Provider;

function pvpReducer(state, action) {
  switch (action.type) {
    case "SET_PLAYERS":
      return {
        ...state,
        players: action.payload,
      };

    case "SET_LOBBY":
      return {
        ...state,
        lobbyCode: action.payload,
      };
    default:
      return state;
  }
}
