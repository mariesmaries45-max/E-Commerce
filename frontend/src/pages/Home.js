import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data } = await axios.get('/api/products/featured');
        setFeaturedProducts(data);
        setLoading(false);
      } catch (err) {
        // Fallback to all products if featured endpoint fails
        try {
          const { data } = await axios.get('/api/products');
          setFeaturedProducts(data.slice(0, 6));
          setLoading(false);
        } catch (error) {
          setError('Failed to load products');
          setLoading(false);
        }
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover the Latest
            <span className="highlight"> Smartphones</span>
          </h1>
          <p className="hero-subtitle">
            Find the perfect mobile phone at unbeatable prices. Free shipping on all orders!
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary btn-large">
              Shop Now
            </Link>
            <Link to="/products" className="btn btn-secondary btn-large">
              View All Products
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-phone-container">
            <img
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"
              alt="Latest Smartphone"
              className="hero-phone"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          <span className="feature-icon">🚚</span>
          <h3>Free Shipping</h3>
          <p>On orders over ₹999</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🔒</span>
          <h3>Secure Payment</h3>
          <p>100% secure transactions</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">↩️</span>
          <h3>Easy Returns</h3>
          <p>7-day return policy</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">💬</span>
          <h3>24/7 Support</h3>
          <p>Dedicated customer service</p>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">Check out our most popular smartphones</p>
        </div>
        
        <div className="product-grid">
          {featuredProducts.map((product) => (
           // In Home.js or Products.js
<ProductCard product={product} key={product._id} />
          ))}
        </div>

        <div className="view-all-container">
          <Link to="/products" className="btn btn-primary btn-large">
            View All Products →
          </Link>
        </div>
      </section>

      {/* Banner Section */}
      <section className="promo-banner">
        <div className="promo-content">
          <h2>New Arrivals!</h2>
          <p>Get up to 20% off on the latest smartphone models</p>
          <Link to="/products" className="btn btn-secondary">
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
