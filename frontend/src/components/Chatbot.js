import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css'; // Import your CSS for styling
import { FaMicrophone, FaSpinner } from 'react-icons/fa';

const Chatbot = () => {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { user: input, bot: null, timestamp: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post('/api/chatbot', { message: input });
      const botMessage = { user: 'Bot', bot: response.data.reply, timestamp: new Date().toLocaleTimeString() };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { user: 'Bot', bot: 'Error: Unable to get response.', timestamp: new Date().toLocaleTimeString() };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage();
    };
    recognition.start();
  };

  return (
    <div className="chatbot">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.user === 'Bot' ? 'bot' : 'user'}`}>
            <span className="timestamp">{msg.timestamp}</span>
            <p>{msg.user}: {msg.user === 'Bot' ? msg.bot : msg.user}</p>
          </div>
        ))}
        {isTyping && <div className="typing-indicator"><FaSpinner className="spinner" /></div>}
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
        <button onClick={handleVoiceInput}><FaMicrophone /></button>
      </div>
    </div>
  );
};

export default Chatbot;
