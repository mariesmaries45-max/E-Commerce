import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.token) {
          setError('Please login to view orders');
          setLoading(false);
          return;
        }

        const { data } = await axios.get('/api/orders/myorders', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load orders');
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Spinner />;
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <Link to="/login" className="btn btn-primary">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>My Orders</h1>
        <p>{orders.length} total orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-content">
            <span className="empty-icon">📦</span>
            <h3>No orders yet</h3>
            <p>Start shopping to place your first order!</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <Link key={order._id} to={`/order/${order._id}`} className="order-card">
              <div className="order-header">
                <span className="order-id">#ORDER{order._id.slice(-6)}</span>
                <span className={`order-status ${order.isDelivered ? 'delivered' : order.isPaid ? 'paid' : 'pending'}`}>
                  {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending'}
                </span>
              </div>
              <div className="order-date">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div className="order-items">
                {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
              </div>
              <div className="order-total">
                {Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                }).format(order.totalPrice)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;