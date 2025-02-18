import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./Serenity.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseUser, faUser, faStop, faLeaf, faDisease } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
const SerenityChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [selectedBot, setSelectedBot] = useState("RantBot");
  const [showBotDropdown, setShowBotDropdown] = useState(false);
  const typingIntervalRef = useRef(null);
  const navigate = useNavigate();
  // Ensure a unique thread_id persists across one session
  if (!sessionStorage.getItem("thread_id")) {
    sessionStorage.setItem("thread_id", self.crypto.randomUUID());
  }
  const thread_id = sessionStorage.getItem("thread_id");

  const defaultMessages = [
    "How can I manage my stress better?",
    "What can I do to improve my sleep?",
    "How do I handle feeling anxious or overwhelmed?",
    "Can you help me with techniques to stay positive?",
  ];

  useEffect(() => {
    createParticles();
  }, []);

  const sendMessage = async (message) => {
    if (isBotTyping || message.trim() === "") return;

    setShowWelcomeMessage(false);
    setMessages((prev) => [
      ...prev,
      { text: message, type: "user" },
      { text: "", type: "bot", loading: true },
    ]);
    setInput("");
    setIsBotTyping(true);
//https://arogyam-chatbot.onrender.com/chat
    try {
      const response = await fetch("https://arogyam-chatbot-home-remedy.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message, model: selectedBot, thread_id: thread_id }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      simulateTypingEffect(data.response);
    } catch (error) {
      setIsBotTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, something went wrong. Please try again.",
          type: "bot",
        },
      ]);
    }
  };

  const simulateTypingEffect = (responseText) => {
    let currentText = "";
    let index = 0;
    setTimeout(() => {
      typingIntervalRef.current = setInterval(() => {
        if (index < responseText.length) {
          currentText += responseText[index];
          index++;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { text: currentText, type: "bot" };
            return updated;
          });
        } else {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
          setIsBotTyping(false);
        }
      }, 25);
    }, 0);
  };

  const handleStop = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    setIsBotTyping(false);
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
    <div className={styles["serenity-chat"]}>
      <div className={styles.sidebar}>
        <a href="/dashboard">
          <FontAwesomeIcon icon={faHouseUser} />
        </a>
        <a href="/user-profile">
          <FontAwesomeIcon icon={faUser} />
        </a>
        <a href="/user-profile">
          <FontAwesomeIcon icon={faLeaf} />
        </a>
        <a href="/user-profile">
          <FontAwesomeIcon icon={faDisease} />
        </a>
        {/* <a href="#">🛋️</a> */}
      </div>
      <div className={styles["main-content"]}>
        <div className={styles["chat-container"]} id="chat-container">
          {showWelcomeMessage && (
            <div className={styles["welcome-message"]}>
              Welcome to RantBot, I am here for your assistance. 🌸
              <div className={styles["default-messages"]}>
                {defaultMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={styles["default-message"]}
                    onClick={() => sendMessage(msg)}
                  >
                    {msg}
                  </div>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${styles.message} ${styles[`${msg.type}-message`]}`}
            >
              {msg.type === "bot" ? (
                msg.loading ? (
                  <span className={styles["loading-dots"]}>
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                ) : (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                )
              ) : (
                msg.text
              )}
            </div>
          ))}
        </div>
        <div className={styles["input-container"]}>
          <div className={styles["bot-dropdown"]}>
            <div
              className={styles["bot-dropdown-header"]}
              onClick={() => setShowBotDropdown(!showBotDropdown)}
            >
              {selectedBot === "RantBot" && <FontAwesomeIcon icon={faUser} />}
              {selectedBot === "RemediesChatbot" && <FontAwesomeIcon icon={faLeaf} />}
              {/* {selectedBot === "DiseaseChatbot" && <FontAwesomeIcon icon={faDisease} />} */}
              <span className={styles.arrow}>{showBotDropdown ? "▲" : "▼"}</span>
            </div>
            {showBotDropdown && (
              <div className={styles["bot-dropdown-menu"]}>
                <div
                  className={styles["bot-dropdown-item"]}
                  title="RantBot Chatbot"
                  onClick={() => { setSelectedBot("RantBot"); setShowBotDropdown(false); }}
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>RantBot Chatbot</span>
                </div>
                <div
                  className={styles["bot-dropdown-item"]}
                  title="RemediesChatbot"
                  onClick={() => {
                    setSelectedBot("RemediesChatbot");
                    setShowBotDropdown(false);
                    navigate('/remedies-chatbot'); // Add this line to navigate
                  }}
                >
                  <FontAwesomeIcon icon={faLeaf} />
                  <span>RemediesChatbot</span>
                </div>
                <div
                  className={styles["bot-dropdown-item"]}
                  title="DiseaseChatbot"
                  onClick={() => { setSelectedBot("DiseaseChatbot"); setShowBotDropdown(false); }}
                >
                  {/* <FontAwesomeIcon icon={faDisease} /> */}
                  {/* <span>DiseaseChatbot</span> */}
                </div>
              </div>
            )}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Express yourself freely..."
            disabled={isBotTyping}
          />
          <button onClick={() => sendMessage(input)} disabled={isBotTyping}>
            Send
          </button>
          {isBotTyping && (
            <button className={styles["stop-button"]} onClick={handleStop}>
              <FontAwesomeIcon icon={faStop} />
            </button>
          )}
        </div>
      </div>
      <div id="particles"></div>
    </div>
  );
};

export default SerenityChat;