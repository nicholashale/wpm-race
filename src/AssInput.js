import { useAssContext } from "./assState";

export default function AssInput() {
  const [state, dispatch] = useAssContext();

  function handleKeystroke(event) {
    if (!state.startTime) {
      dispatch({ type: "START_ASS" });
    }

    const newTypedText = event.target.value;
    if (newTypedText === state.text[state.position]) {
      dispatch({ type: "CORRECT_WORD" });
    } else {
      dispatch({ type: "TYPED_TEXT", payload: newTypedText });
    }
  }

  return (
    <input
      type="text"
      onChange={handleKeystroke}
      value={state.typedText}
      disabled={state.endTime}
    />
  );
}
