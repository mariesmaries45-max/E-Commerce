import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import Spinner from '../components/Spinner';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
    paymentMethod: 'cod', // cod = Cash on Delivery
  });

  const { address, city, postalCode, country, phone, paymentMethod } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderItems = cartItems.map((item) => ({
        ...item,
        product: item._id,
      }));

      const taxPrice = getCartTotal() * 0.18;
      const shippingPrice = getCartTotal() > 1000 ? 0 : 99;
      const totalPrice = getCartTotal() + taxPrice + shippingPrice;

      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems,
          shippingAddress: {
            address,
            city,
            postalCode,
            country,
            phone,
          },
          paymentMethod,
          taxPrice: taxPrice.toFixed(2),
          shippingPrice,
          totalPrice: totalPrice.toFixed(2),
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`,
          },
        }
      );

      clearCart();
      setOrderCreated(true);
      localStorage.removeItem('cart');
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (orderCreated) {
    return (
      <div className="success-container">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your order. We'll send you a confirmation email shortly.</p>
          <Link to="/orders" className="btn btn-primary">
            View Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>Review your order and complete payment</p>
      </div>

      <div className="checkout-container">
        <div className="checkout-form">
          <h3>Shipping Address</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Address</label>
              <input
                type="text"
                name="address"
                value={address}
                onChange={handleChange}
                placeholder="House number, street, locality"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={country}
                onChange={handleChange}
                placeholder="India"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={handleChange}
                placeholder="+91 1234567890"
                required
              />
            </div>

            <h3>Payment Method</h3>
            <div className="payment-methods">
              <label className="payment-method">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={handleChange}
                />
                <div>
                  <span className="method-title">Cash on Delivery</span>
                  <p>Pay when your order is delivered</p>
                </div>
              </label>
              <label className="payment-method">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  onChange={handleChange}
                />
                <div>
                  <span className="method-title">Credit/Debit Card</span>
                  <p>Pay securely with card</p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="place-order-btn"
              disabled={loading || cartItems.length === 0}
            >
              {loading ? <Spinner /> : 'Place Order'}
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item._id} className="summary-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <span>{item.quantity} × {formatPrice(item.price)}</span>
                </div>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(getCartTotal())}</span>
            </div>
            <div className="summary-row">
              <span>Tax (18%)</span>
              <span>{formatPrice(getCartTotal() * 0.18)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{getCartTotal() > 1000 ? 'FREE' : formatPrice(99)}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>{formatPrice(getCartTotal() * 1.18 + (getCartTotal() > 1000 ? 0 : 99))}</span>
            </div>
          </div>
          <Link to="/cart" className="back-to-cart">
            ← Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Checkout;