import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const { getCartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">📱</span>
          <span className="logo-text">Mobile Store</span>
        </Link>

        <button className="menu-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </button>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/products" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Products
          </Link>
          <Link to="/cart" className="nav-link cart-link" onClick={() => setIsMenuOpen(false)}>
            <span className="cart-icon">🛒</span>
            Cart
            {getCartCount() > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
          </Link>
          
          {/* Orders link - only visible when user is logged in */}
          {user && (
            <Link to="/orders" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Orders
            </Link>
          )}
          
          {user ? (
            <div className="user-menu">
              <span className="user-name">Hi, {user.name}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="nav-link login-link" onClick={() => setIsMenuOpen(false)}>
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;