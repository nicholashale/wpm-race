import "./App.css";
import { useReducer } from "react";
import randomWords from "random-words";

const initialAssState = {
  text: randomWords(10),
  position: 0,
  typedText: "",
  startTime: null,
  endTime: null,
};

function assReducer(currentState, action) {
  switch (action.type) {
    case "START_ASS":
      return { ...currentState, startTime: Date.now() };
    case "CORRECT_WORD":
      const position = currentState.position + 1;
      if (position === currentState.text.length - 1) {
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
    default:
      return currentState;
  }
}

function App() {
  const [state, dispatch] = useReducer(assReducer, initialAssState);

  const currentWord = state.text[state.position];

  function handleKeystroke(event) {
    if (!state.startTime) {
      dispatch({ type: "START_ASS" });
    }

    const newTypedText = event.target.value;
    if (newTypedText === currentWord) {
      dispatch({ type: "CORRECT_WORD" });
    } else {
      dispatch({ type: "TYPED_TEXT", payload: newTypedText });
    }
  }

  return (
    <div className="App">
      <div>Current word: {currentWord}</div>
      <input
        type="text"
        onChange={handleKeystroke}
        value={state.typedText}
        disabled={state.endTime}
      />
      {state.endTime && (
        <div>
          Your typing speed is{" "}
          {Math.round(
            state.text.length /
              ((state.endTime - state.startTime) / (1000 * 60))
          )}{" "}
          words per minute!
        </div>
      )}
    </div>
  );
}

export default App;
