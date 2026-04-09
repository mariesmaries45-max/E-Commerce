import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import Spinner from '../components/Spinner';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
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
    paymentMethod: 'cod',
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

      await axios.post(
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
          <p>Thank you for your order.</p>
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
      </div>

      <div className="checkout-container">
        <div className="checkout-form">
          <h3>Shipping Address</h3>

          <form onSubmit={handleSubmit}>
            {/* Address */}
            <div className="form-group">
              <label>Full Address</label>
              <input
                type="text"
                name="address"
                value={address}
                onChange={handleChange}
                required
              />
            </div>

            {/* City + Pincode */}
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={city}
                  onChange={handleChange}
                  list="tn-districts"
                  placeholder="Select district"
                  required
                />
                <datalist id="tn-districts">
                  <option value="Ariyalur" />
                  <option value="Chengalpattu" />
                  <option value="Chennai" />
                  <option value="Coimbatore" />
                  <option value="Cuddalore" />
                  <option value="Dharmapuri" />
                  <option value="Dindigul" />
                  <option value="Erode" />
                  <option value="Kallakurichi" />
                  <option value="Kanchipuram" />
                  <option value="Kanyakumari" />
                  <option value="Karur" />
                  <option value="Krishnagiri" />
                  <option value="Madurai" />
                  <option value="Mayiladuthurai" />
                  <option value="Nagapattinam" />
                  <option value="Namakkal" />
                  <option value="Nilgiris" />
                  <option value="Perambalur" />
                  <option value="Pudukkottai" />
                  <option value="Ramanathapuram" />
                  <option value="Ranipet" />
                  <option value="Salem" />
                  <option value="Sivaganga" />
                  <option value="Tenkasi" />
                  <option value="Thanjavur" />
                  <option value="Theni" />
                  <option value="Thoothukudi" />
                  <option value="Tiruchirappalli" />
                  <option value="Tirunelveli" />
                  <option value="Tirupathur" />
                  <option value="Tiruppur" />
                  <option value="Tiruvallur" />
                  <option value="Tiruvannamalai" />
                  <option value="Tiruvarur" />
                  <option value="Vellore" />
                  <option value="Viluppuram" />
                  <option value="Virudhunagar" />

                </datalist>
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

            {/* Country */}
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={country}
                onChange={handleChange}
                list="countries"
                placeholder="Select Country"
                required
              />
              <datalist id="countries">
                <option value="India" />
                <option value="United States" />
                <option value="United Kingdom" />
                <option value="Canada" />
                <option value="Australia" />
                <option value="Germany" />
                <option value="France" />
                <option value="Italy" />
                <option value="Spain" />
                <option value="Brazil" />
                <option value="China" />
                <option value="Japan" />
                <option value="South Korea" />
                <option value="Singapore" />
                <option value="Malaysia" />
                <option value="Thailand" />
                <option value="UAE" />
                <option value="Saudi Arabia" />
                <option value="South Africa" />
                <option value="New Zealand" />
                <option value="Netherlands" />
                <option value="Switzerland" />
                <option value="Sweden" />
                <option value="Norway" />
                <option value="Denmark" />
                <option value="Finland" />
                <option value="Russia" />
                <option value="Mexico" />
                <option value="Indonesia" />
                <option value="Philippines" />
                <option value="Vietnam" />
                <option value="Turkey" />
                <option value="Argentina" />
                <option value="Pakistan" />
                <option value="Bangladesh" />
                <option value="Sri Lanka" />
                <option value="Nepal" />
              </datalist>
            </div>

            {/* Phone with flags */}
            <div className="form-group">
              <label>Phone Number</label>
              <PhoneInput
                country={'in'}
                value={phone}
                onChange={(phone) =>
                  setFormData({ ...formData, phone })
                }
                inputStyle={{ width: '100%' }}
                enableSearch={true}
              />
            </div>

            {/* Payment */}
            <h3>Payment Method</h3>

            <div className="payment-methods">

              {/* COD */}
              <label className={`payment-method ${paymentMethod === 'cod' ? 'active' : ''}`}>
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
             {/* Card Payment */}
              <label className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={handleChange}
                />
                <div>
                  <span className="method-title">Credit / Debit Card</span>
                  <p>Pay securely with card</p>
                </div>
              </label>

            </div>

            {/* Card Form */}
            {paymentMethod === 'card' && (
              <div className="card-form">
                <input type="text" placeholder="Card Number" required />
                <input type="text" placeholder="MM/YY" required />
                <input type="text" placeholder="CVV" required />
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              className="place-order-btn"
              disabled={loading || cartItems.length === 0}
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>
        {/* Order Summary */}
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