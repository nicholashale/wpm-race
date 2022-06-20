import { createContext, useContext, useReducer } from "react";
import randomWords from "random-words";

export const useAssReducer = () => useReducer(assReducer, initialAssState());
export const useAssContext = () => useContext(assContext);

const initialAssState = () => ({
  text: randomWords(50),
  position: 0,
  typedText: "",
  startTime: null,
  endTime: null,
});

const assContext = createContext();
export const AssContextProvider = assContext.Provider;

function assReducer(currentState, action) {
  switch (action.type) {
    case "START_ASS":
      return { ...currentState, startTime: Date.now() };

    case "CORRECT_WORD":
      const position = currentState.position + 1;
      if (position === currentState.text.length) {
        return {
          ...currentState,
          endTime: Date.now(),
          typedText: "",
          position,
        };
      } else {
        return { ...currentState, typedText: "", position };
      }

    case "TYPED_TEXT":
      return { ...currentState, typedText: action.payload };

    case "RESTART_ASS":
      return initialAssState();

    default:
      return currentState;
  }
}
