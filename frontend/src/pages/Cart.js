import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Razorpay Payment Function
  const handlePayment = () => {
    const options = {
      key: "YOUR_RAZORPAY_KEY", // Replace with Razorpay Key
      amount: getCartTotal() * 1.18 * 100, // amount in paise
      currency: "INR",
      name: "Mobile Store",
      description: "Order Payment",
      handler: function (response) {
        alert("Payment Successful 🎉");
        console.log("Payment ID:", response.razorpay_payment_id);
        clearCart();
      },
      prefill: {
        name: "Customer",
        email: "customer@email.com",
        contact: "9999999999"
      },
      theme: {
        color: "#3399cc"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <span className="empty-cart-icon">🛒</span>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="page-title">Shopping Cart</h1>
        <p className="cart-item-count">{cartItems.length} items</p>
      </div>

      <div className="cart-layout">
        <div className="cart-items-section">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="cart-item-details">
                  <Link to={`/product/${item._id}`} className="cart-item-name">
                    {item.name}
                  </Link>
                  {item.brand && (
                    <p className="cart-item-brand">{item.brand}</p>
                  )}
                  <p className="cart-item-price">{formatPrice(item.price)}</p>
                </div>

                <div className="cart-item-quantity">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="qty-btn"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-total">
                  <p className="item-total">{formatPrice(item.price * item.quantity)}</p>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="remove-btn"
                  title="Remove item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button onClick={clearCart} className="clear-cart-btn">
            Clear Cart
          </button>
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
            <span>{formatPrice(getCartTotal())}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span className="free-shipping">FREE</span>
          </div>

          <div className="summary-row">
            <span>Tax (18% GST)</span>
            <span>{formatPrice(getCartTotal() * 0.18)}</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row total-row">
            <span>Total</span>
            <span>{formatPrice(getCartTotal() * 1.18)}</span>
          </div>

          {/* Main Checkout Button - Added Here */}
          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout →
          </Link>

          <Link to="/products" className="continue-shopping">
            ← Continue Shopping
          </Link>

          <div className="payment-info">
            <p>Secure Payment Methods</p>
            <div className="payment-icons">
              <span>💳</span>
              <span>🏦</span>
              <span>📱</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;