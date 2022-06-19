import { useAssReducer, AssContextProvider } from "./assState";
import AssText from "./AssText";
import AssInput from "./AssInput";
import StatDisplay from "./StatDisplay";

function App() {
  const [state, dispatch] = useAssReducer();

  return (
    <AssContextProvider value={[state, dispatch]}>
      <div className="App">
        <AssText />
        <AssInput />
        {state.endTime && <StatDisplay />}
      </div>
    </AssContextProvider>
  );
}

export default App;
