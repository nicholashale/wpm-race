import { useAssContext } from "./assState";
import { useAuthContext } from "./authState";

import AssText from "./AssText";
import StatDisplay from "./StatDisplay";
import SaveButton from "./SaveButton";

export default function Ass() {
  const [assState, assDispatch] = useAssContext();
  const [authState, authDispatch] = useAuthContext();

  return (
    <div>
      <AssText />
      {assState.endTime && <StatDisplay />}
      {assState.endTime && authState.username && <SaveButton />}
    </div>
  );
}
