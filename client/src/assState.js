import { createContext, useContext, useReducer } from "react";
import randomWords from "random-words";

export const useAssReducer = () => useReducer(assReducer, initialAssState());
export const useAssContext = () => useContext(assContext);

const initialAssState = () => ({
  text: randomWords(10),
  typedText: [],
  startTime: null,
  endTime: null,
  currentWord: [],
  accuracy: null,
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
      if (state.currentWord.length === 0) {
        return state;
      }

      let nextState = {
        ...state,
        typedText: [...state.typedText, state.currentWord.join("")],
        currentWord: [],
      };

      const sampleLength = nextState.text
        .slice(0, nextState.typedText.length)
        .join("").length;
      let accCount = sampleLength;

      nextState.typedText.forEach((word, wordIndex) => {
        const sampleWord = nextState.text[wordIndex];
        word.split("").forEach((letter, letterIndex) => {
          if (letter !== sampleWord[letterIndex]) {
            accCount -= 1;
          }
        });
        if (word.length < sampleWord.length) {
          accCount -= sampleWord.length - word.length;
        }
      });
      nextState.accuracy = accCount / sampleLength;

      if (nextState.typedText.length === nextState.text.length) {
        nextState.endTime = Date.now();
      }

      return nextState;

    case "BACKSPACE":
      return {
        ...state,
        currentWord: state.currentWord.slice(0, state.currentWord.length - 1),
      };

    default:
      return state;
  }
}
