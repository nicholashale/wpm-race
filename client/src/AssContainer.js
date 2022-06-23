import { useAssContext } from "./assState";
import { useAuthContext } from "./authState";

import AssText from "./AssText";
import StatDisplay from "./StatDisplay";
import SaveButton from "./SaveButton";
import styles from "./AssContainer.module.css";

export default function AssContainer() {
  const [assState, assDispatch] = useAssContext();
  const [authState, authDispatch] = useAuthContext();

  return (
    <div id={styles.assContainer}>
      <AssText />
      {assState.endTime && <StatDisplay />}
      {assState.endTime && authState.isAuthed && <SaveButton />}
    </div>
  );
}
