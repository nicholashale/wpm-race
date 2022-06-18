import classNames from "classnames";

import styles from "./AssText.module.css";
import { useAssContext } from "./assState";

export default function AssText() {
  const [state, dispatch] = useAssContext();
  return (
    <div className={styles.text}>
      {state.text.map((word, wordIndex) => {
        return (
          <span
            className={classNames(styles.word, {
              [styles.correct]: state.position > wordIndex,
            })}
          >
            {word.split("").map((letter) => (
              <span className={styles.letter}>{letter}</span>
            ))}
          </span>
        );
      })}
    </div>
  );
}
