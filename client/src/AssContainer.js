import { useAssContext } from "./assState";
import { useAuthContext } from "./authState";

import AssText from "./AssText";
import StatDisplay from "./StatDisplay";
import SaveButton from "./SaveButton";

export default function AssContainer() {
  const [assState, assDispatch] = useAssContext();
  const [authState, authDispatch] = useAuthContext();

  return (
    <div>
      <AssText />
      {assState.endTime && <StatDisplay />}
      {assState.endTime && authState.isAuthed && <SaveButton />}
    </div>
  );
}
