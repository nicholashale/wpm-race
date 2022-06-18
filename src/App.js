import { useAssReducer, AssContextProvider } from "./assState";
import "./App.css";

function App() {
  const [state, dispatch] = useAssReducer();

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
    <AssContextProvider value={[state, dispatch]}>
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
    </AssContextProvider>
  );
}

export default App;
