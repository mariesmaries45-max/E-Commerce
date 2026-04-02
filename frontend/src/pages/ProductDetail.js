import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import Spinner from '../components/Spinner';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError('Product not found');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) return <Spinner />;

  if (error || !product) {
    return (
      <div className="error-container">
        <h2>Product Not Found</h2>
        <p>{error}</p>
        <Link to="/products" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <span className="current">{product.name}</span>
      </nav>

      <div className="product-detail-container">
        <div className="product-image-section">
          <div className="main-image-container">
            <img
              src={product.image}
              alt={product.name}
              className="main-product-image"
            />
            {product.featured && (
              <span className="detail-featured-badge">Featured</span>
            )}
          </div>
        </div>

        <div className="product-info-section">
          <h1 className="product-detail-name">{product.name}</h1>
          
          <div className="product-meta">
            {product.brand && (
              <span className="product-brand">{product.brand}</span>
            )}
            <div className="product-rating-detail">
              <span className="stars">
                {'★'.repeat(Math.floor(product.rating || 4))}
                {'☆'.repeat(5 - Math.floor(product.rating || 4))}
              </span>
              <span className="rating-text">
                {product.rating || 4} ({product.numReviews || 0} reviews)
              </span>
            </div>
          </div>

          <p className="product-detail-price">{formatPrice(product.price)}</p>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-availability">
            {product.countInStock > 0 ? (
              <span className="in-stock">✓ In Stock ({product.countInStock} available)</span>
            ) : (
              <span className="out-of-stock">✗ Out of Stock</span>
            )}
          </div>

          {product.countInStock > 0 && (
            <div className="add-to-cart-section">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.countInStock, quantity + 1))
                    }
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`add-to-cart-detail-btn ${addedToCart ? 'added' : ''}`}
                disabled={addedToCart}
              >
                {addedToCart ? (
                  <>
                    <span>✓</span> Added to Cart!
                  </>
                ) : (
                  <>
                    <span>🛒</span> Add to Cart
                  </>
                )}
              </button>
            </div>
          )}

          <div className="product-features">
            <div className="feature-item">
              <span className="feature-icon">🚚</span>
              <span>Free Delivery</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">↩️</span>
              <span>7 Days Return</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
