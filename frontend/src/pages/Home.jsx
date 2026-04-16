import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, HeartHandshake, MessageCircleHeart } from 'lucide-react';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container animate-fade-in">
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="icon-wrapper">
            <HeartHandshake size={64} className="hero-icon" />
          </div>
          <h1 className="hero-title">AI Mental Health Chatbot</h1>
          <p className="hero-description">
            This project provides emotional support using Artificial Intelligence and Natural Language Processing. 
            A safe space to reflect, converse, and find calm.
          </p>
          <button 
            className="btn btn-primary cta-btn" 
            onClick={() => navigate('/chat')}
          >
            <MessageCircleHeart size={20} />
            Start Chat
          </button>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="disclaimer-section">
        <div className="disclaimer-card">
          <div className="disclaimer-header">
            <ShieldAlert className="disclaimer-icon" size={24} />
            <h2>Important Disclaimer</h2>
          </div>
          <ul className="disclaimer-list">
            <li><strong>Not Medical Advice:</strong> This chatbot is not a replacement for professional medical advice, diagnosis, or therapy.</li>
            <li><strong>Privacy & Safety:</strong> Do not share personal, sensitive, or confidential information (like financial details, addresses, or raw medical records).</li>
            <li><strong>Emergency Support:</strong> If you are in crisis, experiencing severe distress, or having thoughts of self-harm, please contact a mental health professional or emergency hotline immediately.</li>
          </ul>
        </div>
      </section>

    </div>
  );
};

export default Home;
