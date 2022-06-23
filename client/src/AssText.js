import classNames from "classnames";
import { useEffect, useRef } from "react";

import styles from "./AssText.module.css";
import { useAssContext } from "./assState";
import { useAuthContext } from "./authState";
import { usePvpContext } from "./pvpState";

export default function AssText() {
  const [assState, assDispatch] = useAssContext();
  const [pvpState, pvpDispatch] = usePvpContext();
  const [authState, authDispatch] = useAuthContext();
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) =>
      assDispatch({
        type: "SET_FOCUSED",
        payload: ref?.current.contains(e.target),
      });

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [ref, assDispatch]);

  let absIndex = 0;
  const ghostCursors = Object.keys(pvpState.players ?? [])
    .filter((username) => username !== authState.username)
    .map((username) => pvpState.players[username].absPosition);
  return (
    <div ref={ref} autoFocus id={styles.text}>
      {assState.text
        .map((word) => `${word} `)
        .map((word, wordIndex) => {
          const currentWordIndex = assState.typedText.length;

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
                if (letterIndex === word.length - 1) {
                  typedLetter = null;
                } else if (wordIndex < currentWordIndex) {
                  typedLetter = assState.typedText[wordIndex][letterIndex];
                } else if (wordIndex === currentWordIndex) {
                  typedLetter = assState.currentWord[letterIndex];
                }
                absIndex += 1;
                return (
                  <span
                    key={letterIndex}
                    className={classNames(
                      styles.letter,
                      {
                        [styles.correct]: typedLetter && letter === typedLetter,
                      },
                      {
                        [styles.incorrect]:
                          typedLetter && letter !== typedLetter,
                      },
                      {
                        [styles.cursor]: absIndex === assState.absPosition,
                      },
                      { [styles.space]: typedLetter === null },
                      { [styles.ghostCursor]: ghostCursors.includes(absIndex) }
                    )}
                  >
                    {letter === " " ? "a" : letter}
                  </span>
                );
              })}
            </span>
          );
        })}
    </div>
  );
}
