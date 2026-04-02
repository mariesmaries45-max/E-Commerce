import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {product.featured && <span className="featured-badge">Featured</span>}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-rating">
          <span className="stars">{'★'.repeat(Math.floor(product.rating || 4))}</span>
          <span className="rating-count">({product.numReviews || 0})</span>
        </div>
        
        <p className="product-price">{formatPrice(product.price)}</p>
        
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          <span className="cart-icon">🛒</span>
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
