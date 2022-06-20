import { createContext, useContext, useReducer } from "react";
import randomWords from "random-words";

export const useAssReducer = () => useReducer(assReducer, initialAssState());
export const useAssContext = () => useContext(assContext);

const initialAssState = () => ({
  text: randomWords(50),
  typedText: [],
  startTime: null,
  endTime: null,
  currentWord: [],
});

const assContext = createContext();
export const AssContextProvider = assContext.Provider;

function assReducer(state, action) {
  switch (action.type) {
    case "START_ASS":
      return { ...state, startTime: Date.now() };

    case "RESTART_ASS":
      return initialAssState();

    case "LETTER":
      return {
        ...state,
        currentWord: [...state.currentWord, action.payload],
      };

    case "SPACE":
      if (state.currentWord.length > 0) {
        return {
          ...state,
          typedText: [...state.typedText, state.currentWord.join("")],
          currentWord: [],
        };
      } else {
        return state;
      }

    case "BACKSPACE":
      return {
        ...state,
        currentWord: state.currentWord.slice(0, state.currentWord.length - 1),
      };

    default:
      return state;
  }
}
