import { useAssContext } from "./assState";
import { useAuthContext } from "./authState";

export default function SaveButton() {
  const [assState, assDispatch] = useAssContext();
  const [authState, authDispatch] = useAuthContext();
  function handleClick() {
    fetch(
      `${process.env.REACT_APP_API_ORIGIN}/races?` +
        new URLSearchParams({ text: assState.text.join(" ") }),
      {
        method: "POST",
      }
    )
      .then((res) => res.json())
      .then((race) => {
        fetch(
          `${process.env.REACT_APP_API_ORIGIN}/reports?` +
            new URLSearchParams({
              user_id: authState.id,
              race_id: race.id,
              accuracy_percent: assState.accuracy,
              time_ms: assState.endTime - assState.startTime,
              place: null,
            }),
          { method: "POST" }
        );
      });
  }
  return <button onClick={handleClick}>Click to save your race stats!</button>;
}
