import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import './OrderDetail.css'; // ✅ CSS IMPORT

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));

        const { data } = await axios.get(`/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        setOrder(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <Spinner />;

  if (!order) {
    return (
      <div className="order-detail-page">
        <h2>Order not found</h2>
        <Link to="/orders" className="back-to-cart">
          Back to Orders
        </Link>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="order-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/orders">Orders</Link> / Order #{order._id.slice(-6)}
      </div>

      <div className="order-detail-container">

        {/* Order Info */}
        <div className="order-info">
          <div className="order-header">
            <h2>Order #{order._id.slice(-6)}</h2>
            <span
              className={`status-badge ${
                order.isDelivered
                  ? 'delivered'
                  : order.isPaid
                  ? 'paid'
                  : 'pending'
              }`}
            >
              {order.isDelivered
                ? 'Delivered'
                : order.isPaid
                ? 'Paid'
                : 'Pending'}
            </span>
          </div>

          <div className="order-meta">
            <div className="meta-item">
              <span>Date</span>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="meta-item">
              <span>Payment</span>
              <span>{order.isPaid ? 'Paid' : 'Pending'}</span>
            </div>
            <div className="meta-item">
              <span>Delivery</span>
              <span>{order.isDelivered ? 'Delivered' : 'Pending'}</span>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="order-items-section">
          <h3>Order Items</h3>
          {order.orderItems.map((item) => (
            <div key={item._id} className="order-item">
              <img src={item.image} alt={item.name} />
              <div>
                <h4>{item.name}</h4>
                <p>Qty: {item.quantity}</p>
              </div>
              <div className="item-price">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Address */}
        <div className="order-address">
          <h3>Shipping Address</h3>
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city} - {order.shippingAddress.postalCode}
          </p>
          <p>{order.shippingAddress.country}</p>
          <p>Phone: {order.shippingAddress.phone}</p>
        </div>

        {/* Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>
              {formatPrice(
                order.totalPrice -
                  order.taxPrice -
                  order.shippingPrice
              )}
            </span>
          </div>

          <div className="summary-row">
            <span>Tax (18%)</span>
            <span>{formatPrice(order.taxPrice)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>
              {order.shippingPrice === 0
                ? 'FREE'
                : formatPrice(order.shippingPrice)}
            </span>
          </div>

          <div className="row">
            <span>Total  </span>
            <span>{formatPrice(order.totalPrice)}</span>
          </div>

          {/* Button */}
          <Link to="/cart" className="back-to-cart">
            ← Back to Cart
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderDetail;