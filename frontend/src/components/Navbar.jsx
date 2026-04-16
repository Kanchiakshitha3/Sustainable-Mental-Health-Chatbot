import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, HeartHandshake } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ isDarkMode, toggleTheme }) => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <HeartHandshake className="logo-icon" size={28} />
          <span>AI Mental Health</span>
        </Link>
        
        <div className="navbar-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/chat" 
            className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}
          >
            Chatbot
          </Link>
          
          <button 
            onClick={toggleTheme} 
            className="icon-btn theme-toggle"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
