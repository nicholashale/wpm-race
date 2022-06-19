import { useAssContext } from "./assState";

export default function StatDisplay() {
  const [state, dispatch] = useAssContext();
  return (
    <div>
      Your typing speed is{" "}
      {Math.round(
        state.text.length / ((state.endTime - state.startTime) / (1000 * 60))
      )}{" "}
      words per minute!
    </div>
  );
}
