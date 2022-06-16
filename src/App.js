import "./App.css";
import { useState, useEffect } from "react";
import randomWords from "random-words";

const wordsMax = 250;
const timeLimit = 60;

function App() {
  const [text, setText] = useState([]);
  const [position, setPosition] = useState(0);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    setText(randomWords(wordsMax));
  }, []);

  function handleKeystroke(event) {
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
      <div>
        {/* Text: {text.join(", ")} <br /> */}
        Current word: {text[position]}
      </div>
      <input type="text" onChange={handleKeystroke} value={typedText} />
    </div>
  );
}

export default App;
