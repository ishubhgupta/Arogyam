import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import styles from './Serenity.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseUser } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const SerenityChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);

  const defaultMessages = [
    "What can you do?",
    "Tell me a joke.",
    "How do I get started?",
    "What is your purpose?"
  ];

  useEffect(() => {
    createParticles();
  }, []);

  const sendMessage = async (message) => {
    if (message.trim() === "") return;

    // Hide the welcome message when the user sends a message
    setShowWelcomeMessage(false);

    setMessages((prev) => [...prev, { text: message, type: "user" }]);
    setInput("");

    setIsBotTyping(true);

    setTimeout(async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message: message })
        });

        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        setIsBotTyping(false);
        simulateTypingEffect(data.response);
      } catch (error) {
        setIsBotTyping(false);
        setMessages((prev) => [
          ...prev,
          { text: "Sorry, something went wrong. Please try again.", type: "bot" }
        ]);
      }
    }, 100);
  };

  const simulateTypingEffect = (responseText) => {
    let currentText = "";
    let index = 0;

    setMessages((prev) => [...prev, { text: "", type: "bot" }]);

    const interval = setInterval(() => {
      if (index < responseText.length) {
        currentText += responseText[index];
        index++;

        setMessages((prev) => {
          const updatedMessages = [...prev];
          const lastIndex = updatedMessages.length - 1;

          if (updatedMessages[lastIndex].type === "bot") {
            updatedMessages[lastIndex] = { text: currentText, type: "bot" };
          }

          return updatedMessages;
        });
      } else {
        setIsBotTyping(false);
        clearInterval(interval);
      }
    }, 25);
  };

  const createParticles = () => {
    const container = document.getElementById("particles");
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.width = Math.random() * 10 + 5 + "px";
      particle.style.height = particle.style.width;
      particle.style.left = Math.random() * 100 + "vw";
      particle.style.top = Math.random() * 100 + "vh";
      container.appendChild(particle);
    }
  };

  return (
    <div className={styles['serenity-chat']}>
      <div className={styles.sidebar}>
        <a href="/dashboard">
          <FontAwesomeIcon icon={faHouseUser} />
        </a>
        <a href="/user-profile">
          <FontAwesomeIcon icon={faUser} />
        </a>
        <a href="#">🕊️</a>
        <a href="#">🎵</a>
        <a href="#">🛋️</a>
      </div>
      <div className={styles['main-content']}>
        <div className={styles['chat-container']} id="chat-container">
          {showWelcomeMessage && (
            <div className={styles['welcome-message']}>
              Welcome to RantBot, I am here for your assistance. 🌸
              <div className={styles['default-messages']}>
                {defaultMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={styles['default-message']}
                    onClick={() => sendMessage(msg)}
                  >
                    {msg}
                  </div>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, index) => (
            <div key={index} className={`${styles.message} ${styles[`${msg.type}-message`]}`}>
              {msg.type === "bot" ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          ))}
          {isBotTyping && (
            <div className={`${styles.message} ${styles['bot-message']}`}>
              <div className={styles['typing-indicator']}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>
        <div className={styles['input-container']}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Express yourself freely..."
          />
          <button onClick={() => sendMessage(input)}>Send</button>
        </div>
      </div>
      <div id="particles"></div>
    </div>
  );
};

export default SerenityChat;