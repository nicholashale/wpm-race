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
  accuracy: null,
  absPosition: 0,
  isFocused: false,
});

const assContext = createContext();
export const AssContextProvider = assContext.Provider;

function calcAbsPos(nextState) {
  const wordsTyped = nextState.typedText.length;
  const words = [
    ...nextState.text.slice(0, wordsTyped),
    nextState.currentWord.join(""),
  ];
  return words.join(" ").length;
}

function assReducer(state, action) {
  switch (action.type) {
    case "START_ASS": {
      return { ...state, startTime: Date.now() };
    }

    case "RESTART_ASS": {
      return initialAssState();
    }

    case "LETTER": {
      const nextState = {
        ...state,
        currentWord: [...state.currentWord, action.payload],
      };
      nextState.absPosition = calcAbsPos(nextState);
      return nextState;
    }

    case "SPACE": {
      if (state.currentWord.length === 0) {
        return state;
      }

      let nextState = {
        ...state,
        typedText: [...state.typedText, state.currentWord.join("")],
        currentWord: [],
      };

      nextState.absPosition = calcAbsPos(nextState);

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
    }

    case "BACKSPACE": {
      const nextState = {
        ...state,
        currentWord: state.currentWord.slice(0, state.currentWord.length - 1),
      };
      nextState.absPosition = calcAbsPos(nextState);
      return nextState;
    }

    case "RECEIVED_TEXT": {
      return {
        ...initialAssState(),
        text: action.payload,
      };
    }

    case "SET_FOCUSED": {
      return {
        ...state,
        isFocused: action.payload,
      };
    }

    default: {
      return state;
    }
  }
}
