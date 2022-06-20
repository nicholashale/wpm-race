import { useCallback, useEffect } from "react";
import { useAssContext } from "./assState";

export default function AssInput() {
  const [state, dispatch] = useAssContext();

  const handleKeystroke = useCallback(
    (e) => {
      if (e.key === "Escape") {
        dispatch({ type: "RESTART_ASS" });
      }
    },
    [dispatch]
  );

  useEffect(() => {
    document.addEventListener("keyup", handleKeystroke);
    return () => {
      document.removeEventListener("keyup", handleKeystroke);
    };
  }, [handleKeystroke]);

  function handleTypedInput(event) {
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
      onChange={handleTypedInput}
      value={state.typedText}
      disabled={state.endTime}
    />
  );
}
