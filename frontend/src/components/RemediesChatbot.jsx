import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import styles from './RemediesChatbot.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseUser, faUser, faStop, faLeaf, faDisease } from '@fortawesome/free-solid-svg-icons';
import DOMPurify from 'dompurify'; // Add this import for security


const RemediesChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [isBotTyping, setIsBotTyping] = useState(false);
const [typingIntervalRef, setTypingIntervalRef] = useState(null);

  const defaultMessages = [
    "🤒 Fever",
    "🤧 Cold",
    "🤕 Headache",
    "🤢 Nausea"
  ];

  useEffect(() => {
    createParticles();
  }, []);

  const createParticles = () => {
    const container = document.getElementById('particles');
    if (container) {
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = Math.random() * 10 + 5 + 'px';
        particle.style.height = particle.style.width;
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
        container.appendChild(particle);
      }
    }
  };

  const sendMessage = async (message) => {
    if (message.trim()) {
      setShowWelcomeMessage(false);
      setIsBotTyping(true);
      const newMessages = [...messages, { type: 'user', content: message }];
      setMessages(newMessages);
  
      try {
        const response = await fetch('https://arogyam-chatbot-home-remedy.onrender.com/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        const sanitizedHtml = DOMPurify.sanitize(marked.parse(data.response));
        setIsBotTyping(false);
  
        setMessages([
          ...newMessages,
          { 
            type: 'bot', 
            content: sanitizedHtml
          }
        ]);
      } catch (error) {
        console.error('Error:', error);
        setIsBotTyping(false);
        setMessages([
          ...newMessages,
          { 
            type: 'bot', 
            content: 'Sorry, something went wrong. Please try again.'
          }
        ]);
      }

      setInputValue('');
    }
  };
  const handleStop = () => {
    if (typingIntervalRef) {
      clearInterval(typingIntervalRef);
      setTypingIntervalRef(null);
    }
    setIsBotTyping(false);
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
              <a href="/user-profile">
                <FontAwesomeIcon icon={faLeaf} />
              </a>
              <a href="/user-profile">
                <FontAwesomeIcon icon={faDisease} />
              </a>
              {/* <a href="#">🛋️</a> */}
      </div>
      <div className={styles['main-content']}>
        <div className={styles['chat-container']} id="chat-container">
          {showWelcomeMessage && (
            <div className={styles['welcome-message']}>
              Welcome to RemediesChatbot, I am here for your assistance. 🌸
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
            <div key={index} className={`${styles.message} ${msg.type === 'user' ? styles['user-message'] : styles['bot-message']}`}>
              {msg.type === 'bot' && <div className={styles.avatar}>🌼</div>}
              <div className={styles['message-bubble']}>
                    <div dangerouslySetInnerHTML={{ __html: msg.content }} />
              </div>
            </div>
          ))}
        </div>

        <div className={styles['input-container']}>
  <input
    type="text"
    placeholder="Describe how you're feeling... (e.g., sore throat, mild fever)"
    value={inputValue}
    onChange={(e) => setInputValue(e.target.value)}
    onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
    disabled={isBotTyping}
  />
  <button onClick={() => sendMessage(inputValue)} disabled={isBotTyping}>
    Send
  </button>
  {isBotTyping && (
    <button className={styles['stop-button']} onClick={handleStop}>
      <FontAwesomeIcon icon={faStop} />
    </button>
  )}
</div>
      </div>
      <div id="particles"></div>
    </div>
  );
};

export default RemediesChatbot;