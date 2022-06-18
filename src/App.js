import { useAssReducer, AssContextProvider } from "./assState";
import AssText from "./AssText";
import AssInput from "./AssInput";

function App() {
  const [state, dispatch] = useAssReducer();

  return (
    <AssContextProvider value={[state, dispatch]}>
      <div className="App">
        <AssText />
        <AssInput />
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
