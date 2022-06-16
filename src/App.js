import "./App.css";
import { useState, useEffect } from "react";
import randomWords from "random-words";

function App() {
  const [text, setText] = useState([]);
  const [position, setPosition] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [hasBegun, setHasBegun] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    setText(randomWords(1000));
  }, []);

  function handleKeystroke(event) {
    if (!hasBegun) {
      setHasBegun(true);
      setTimeout(() => setHasFinished(true), 10 * 1000);
    }

    const newTypedText = event.target.value;
    if (newTypedText === text[position]) {
      setTypedText("");
      setPosition(position + 1);
    } else {
      setTypedText(newTypedText);
    }
  }

  return (
    <div className="App">
      <div>Current word: {text[position]}</div>
      <input
        type="text"
        onChange={handleKeystroke}
        value={typedText}
        disabled={hasFinished}
      />
      {hasFinished && (
        <div>Your typing speed is {position * 6} words per minute!</div>
      )}
    </div>
  );
}

export default App;
