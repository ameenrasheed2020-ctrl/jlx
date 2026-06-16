// Note: Rename this file from )rder.jsx to Order.jsx on your disk
import React, { useState, useEffect } from 'react';
import { apiUrl } from '../../config/api';
import './Order.css';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(apiUrl(`/order/getorders/${userId}`));
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                } else {
                    console.error("Failed to fetch orders");
                    setOrders([]);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    if (loading) return <div className="order-loading">Loading your orders...</div>;
    if (!userId) return <div className="order-error">Please login to view your orders.</div>;

    return (
        <div className="order-container">
            <h1 className="order-header">Your Orders</h1>
            {orders.length === 0 ? (
                <div className="empty-orders">
                    <p>You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <div className="order-summary">
                                <h3>Order #{order._id.substring(0, 8)}...</h3>
                                <p className="order-date">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                                <p className={`order-status ${(order.orderStatus || 'pending').toLowerCase()}`}>
                                    Status: {order.orderStatus || 'Pending'}
                                </p>
                            </div>
                            <div className="order-items">
                                {order.products.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <span>{item.productId?.productname || 'Product ID: ' + (item.productId?._id || item.productId)}</span>
                                        <span>Qty: {item.quantity} | ${item.price}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-footer">
                                <p className="order-total">Total Amount: ${order.totalAmount}</p>
                                <p className="payment-method">Payment: {order.paymentMethod}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Order;
