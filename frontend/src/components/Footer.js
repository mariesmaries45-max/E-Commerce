import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">
            <span className="footer-logo">📱</span> Mobile Store
          </h3>
          <p className="footer-description">
            Your one-stop destination for the latest smartphones and mobile accessories at the best prices.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Categories</h4>
          <ul className="footer-links">
            <li><Link to="/products">All Mobiles</Link></li>
            <li><Link to="/products/apple">Apple</Link></li>
            <li><Link to="/products/samsung">Samsung</Link></li>
            <li><Link to="/products/oneplus">OnePlus</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Contact Us</h4>
          <ul className="footer-contact">
            <li>
              📧 <a href="mailto:mariesmaries45@gmail.com">
                mariesmaries45@gmail.com
              </a>
            </li>
            <li>📞 +91 8610172710</li>
            <li>📍 sivakasi, Tamilnadu</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Mobile Store. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
