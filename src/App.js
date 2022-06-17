import "./App.css";
import { useState, useEffect } from "react";
import randomWords from "random-words";

function App() {
  const [text, setText] = useState([]);
  const [position, setPosition] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    setText(randomWords(10));
  }, []);

  function handleKeystroke(event) {
    if (!startTime) {
      setStartTime(Date.now());
    }

    const newTypedText = event.target.value;
    if (newTypedText === text[position]) {
      setTypedText("");
      setPosition(position + 1);
      if (position === text.length - 2) {
        setEndTime(Date.now());
      }
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
        disabled={endTime}
      />
      {endTime && (
        <div>
          Your typing speed is{" "}
          {Math.round(text.length / ((endTime - startTime) / (1000 * 60)))}{" "}
          words per minute!
        </div>
      )}
    </div>
  );
}

export default App;
