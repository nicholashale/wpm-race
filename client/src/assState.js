import { createContext, useContext, useReducer } from "react";
import randomWords from "random-words";

export const useAssReducer = () => useReducer(assReducer, initialAssState());
export const useAssContext = () => useContext(assContext);

const initialAssState = () => ({
  text: randomWords(50).join(" ").split(""),
  position: 0,
  typedText: [],
  startTime: null,
  endTime: null,
});

const assContext = createContext();
export const AssContextProvider = assContext.Provider;

function assReducer(state, action) {
  switch (action.type) {
    case "START_ASS":
      return { ...state, startTime: Date.now() };

    case "TYPED_LETTER":
      return {
        ...state,
        typedText: [...state.typedText, action.payload],
        position: state.position + 1,
      };

    case "RESTART_ASS":
      return initialAssState();

    default:
      return state;
  }
}
