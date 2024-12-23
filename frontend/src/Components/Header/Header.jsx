import React, { useState } from 'react';
import { Menu, X, BarChart, Contact, LogIn } from 'lucide-react';
import './Header.css';
import logo from "../../assests/images/logo.png"
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      
      <div className="header-container">
        {/* Logo and Title */}
        <a href="/">
        <div className="logo-section">
          <img 
            src={logo}
            alt="Bail Reckoner Logo" 
            className="logo"
          />
          <h1 className="title">Bail Reckoner</h1>
        </div>
        </a>
        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <div className="nav-links">
            <a href="#analytics" className="nav-link">
              <BarChart size={18} />
              <span>Analytics</span>
            </a>
            <a href="#footer" className="nav-link">
              <Contact size={18} />
              <span>Contact</span>
            </a>
          </div>
          <div className="auth-buttons">
            <a href="/login"><button className="login-btn">Login</button></a>
            <a href="/signup"><button className="signup-btn">Sign Up</button></a>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="mobile-menu-toggle">
          <button onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-nav">
            <a href="#analytics" className="mobile-nav-link">
              <BarChart size={18} />
              <span>Analytics</span>
            </a>
            <a href="/contact" className="mobile-nav-link">
              <Contact size={18} />
              <span>Contact</span>
            </a>
            <div className="mobile-auth-buttons">
              <button className="mobile-login-btn">Login</button>
              <button className="mobile-signup-btn">Sign Up</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;