import { createContext, useContext, useReducer } from "react";

export const useAuthReducer = () => useReducer(authReducer, initialAuthState);
export const useAuthContext = () => useContext(authContext);

const initialAuthState = {
  id: null,
  username: null,
};

const authContext = createContext();
export const AuthContextProvider = authContext.Provider;

function authReducer(state, action) {
  switch (action.type) {
    case "AUTH_SUCCESS":
      return {
        ...state,
        id: action.payload.id,
        username: action.payload.username,
      };

    default:
      return state;
  }
}
