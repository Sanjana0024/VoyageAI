import { useEffect, useState } from "react";

function TypingMessage({ text, speed = 20 }) {

  const [displayText, setDisplayText] = useState("");

  useEffect(() => {

    let index = 0;

    setDisplayText("");

    const timer = setInterval(() => {

      setDisplayText(text.slice(0, index + 1));

      index++;

      if (index >= text.length) {
        clearInterval(timer);
      }

    }, speed);

    return () => clearInterval(timer);

  }, [text, speed]);

  return (
    <p className="whitespace-pre-wrap text-gray-700">
      {displayText}
    </p>
  );
}

export default TypingMessage;