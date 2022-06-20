import classNames from "classnames";
import { useCallback, useEffect } from "react";

import styles from "./AssText.module.css";
import { useAssContext } from "./assState";

const ALPHA_LOWER = "abcdefghijklmnopqrstuvwxyz".split("");

export default function AssText() {
  const [state, dispatch] = useAssContext();
  const handleKeystroke = useCallback(
    (e) => {
      console.log("testing key:", e.key);

      if (e.key === "Escape") {
        dispatch({ type: "RESTART_ASS" });
        return;
      }

      if (ALPHA_LOWER.includes(e.key)) {
        if (!state.startTime) {
          dispatch({ type: "START_ASS" });
        }
        dispatch({ type: "LETTER", payload: e.key });
      }
      if (e.key === " ") {
        dispatch({ type: "SPACE" });
      }
      if (e.key === "Backspace") {
        dispatch({ type: "BACKSPACE" });
      }
    },
    [state, dispatch]
  );

  useEffect(() => {
    document.addEventListener("keyup", handleKeystroke);
    return () => {
      document.removeEventListener("keyup", handleKeystroke);
    };
  }, [handleKeystroke]);

  return (
    <div className={styles.text}>
      {state.text.map((word, wordIndex) => {
        const currentWordIndex = state.typedText.length;
        return (
          <span
            key={wordIndex}
            className={classNames(
              styles.word,
              {
                [styles.active]: currentWordIndex === wordIndex,
              },
              { [styles.future]: wordIndex > currentWordIndex }
            )}
          >
            {word.split("").map((letter, letterIndex) => {
              let typedLetter;
              if (wordIndex < currentWordIndex) {
                typedLetter = state.typedText[wordIndex][letterIndex];
              } else if (wordIndex === currentWordIndex) {
                typedLetter = state.currentWord[letterIndex];
              }
              return (
                <span
                  key={letterIndex}
                  className={classNames(
                    styles.letter,
                    {
                      [styles.correct]: typedLetter && letter === typedLetter,
                    },
                    {
                      [styles.incorrect]: typedLetter && letter !== typedLetter,
                    }
                  )}
                >
                  {letter}
                </span>
              );
            })}
          </span>
        );

        // if (letterIndex < state.position) {
        // return (
        //   <span
        //     key={letterIndex}
        //     className={classNames(
        //       { [styles.letter]: letter !== " " },
        //       { [styles.correct]: letter === state.typedText[letterIndex] },
        //       { [styles.incorrect]: letter !== state.typedText[letterIndex] }
        //     )}
        //   >
        //     {letter}
        //     </span>
        //   );
        // } else {
        //   return (
        //     <span
        //       key={letterIndex}
        //       className={classNames(styles.letter, styles.inactive)}
        //     >
        //       {letter}
        //     </span>
        //   );
        // }
      })}
    </div>
  );
}
