import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [
      { sender: 'bot', text: 'Hello. I am here to listen and support you. How are you feeling today?' }
    ];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState('English');
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + " " + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Update locale based on language dropdown
  useEffect(() => {
    if (recognitionRef.current) {
      if (language === 'English') recognitionRef.current.lang = 'en-US';
      if (language === 'Hindi') recognitionRef.current.lang = 'hi-IN';
      if (language === 'Telugu') recognitionRef.current.lang = 'te-IN';
    }
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Speech recognition is not supported in this browser.");
      }
    }
  };

  const speakText = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (language === 'English') utterance.lang = 'en-US';
    if (language === 'Hindi') utterance.lang = 'hi-IN';
    if (language === 'Telugu') utterance.lang = 'te-IN';
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    // Save to local storage whenever messages change
    localStorage.setItem('chatHistory', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const historyForBackend = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg.text, 
          history: historyForBackend,
          language: language 
        })
      });

      const data = await res.json();
      if (data.response) {
        setMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
        speakText(data.response); // Speak out bot response
      } else if (data.error) {
        setMessages(prev => [...prev, { sender: 'bot', text: "I'm sorry, I encountered an error. Please try again." }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'bot', text: "Connection error. Ensure the backend server is running." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container animate-fade-in">
      
      <div className="chat-header">
        <div className="chat-header-info">
          <h2>Support Chat</h2>
          <p>We are here to listen.</p>
        </div>
        
        <div className="chat-controls">
          <select 
            className="language-select" 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="Telugu">Telugu (తెలుగు)</option>
          </select>
          
          <button 
            className="icon-btn voice-toggle"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            title={voiceEnabled ? "Mute Bot Voice" : "Enable Bot Voice"}
          >
            {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </div>

      <div className="chat-window">
        <div className="messages-list">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message-wrapper ${msg.sender === 'user' ? 'user' : 'bot'}`}
            >
              <div className="message-bubble">
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message-wrapper bot">
              <div className="message-bubble typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="chat-input-area">
        <div className="input-wrapper">
          <button 
            className={`mic-btn ${isListening ? 'listening' : ''}`}
            onClick={toggleListening}
            title="Use Voice Input"
          >
            {isListening ? <Mic size={20} className="pulse-anim" /> : <MicOff size={20} />}
          </button>
          
          <textarea
            className="chat-input"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={1}
          />
          
          <button 
            className="btn btn-primary send-btn" 
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default Chat;
