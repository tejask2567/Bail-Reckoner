import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-left">
            <h3 style={{ textAlign: 'left' }}>Bail Services</h3>
            <ul style={{ textAlign: 'left' }}>
              <li>
                <strong>Easy-to-use search tool:</strong> 
              </li>
              <li>
                <strong>Informative resources:</strong> 
              </li>
              <li>
                <strong>Secure online payments:</strong> 
              </li>
              <li>
                <strong>24/7 support:</strong> 
              </li>
            </ul>
          </div>

          <div className="footer-right">
            <div className="contact-section">
              <h3>Contact Us</h3>
              <div className="contact-item">
                <span>📍 123 Bail Street, Legal City, State 12345</span>
              </div>
              <div className="contact-item">
                <span>📞 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <span>✉️ contact@bailservices.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Bail Services. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
