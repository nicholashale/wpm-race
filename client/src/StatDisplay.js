import { useAssContext } from "./assState";

export default function StatDisplay() {
  const [state, dispatch] = useAssContext();
  const wpm = Math.round(
    state.text.length / ((state.endTime - state.startTime) / (1000 * 60))
  );
  return (
    <div>
      <p>Your typing speed is {wpm} words per minute!</p>
      <p>Your accuracy is {Math.round(state.accuracy * 100)}%!</p>
    </div>
  );
}
