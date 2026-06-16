import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiUrl } from '../../config/api';

const Checkout = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [address, setAddress] = useState("");
    const userId = localStorage.getItem("userId");

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!state || !state.items) return;

        try {
            const response = await fetch(apiUrl("/order/placeorder"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    products: state.items.map(item => ({
                        productId: item.productid?._id || item.productid, // Handle populated object or string ID
                        productname: item.productname || item.productid?.productname,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    shippingAddress: address,
                    paymentMethod: "COD",
                    totalAmount: state.total
                })
            });

            if (response.ok) {
                alert("Order Placed Successfully!");
                navigate("/orders");
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!state || !state.items) {
        return (
            <div className="container mt-5">
                <h2>Checkout</h2>
                <p>No items found for checkout. Please return to your cart.</p>
                <button className="btn btn-secondary" onClick={() => navigate("/cart")}>Back to Cart</button>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2>Checkout</h2>
            <div className="row">
                <div className="col-md-8">
                    <form onSubmit={handlePlaceOrder}>
                        <div className="mb-3">
                            <label className="form-label">Shipping Address</label>
                            <textarea
                                className="form-control"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Payment Method</label>
                            <input className="form-control" value="Cash on Delivery" disabled />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Place Order</button>
                    </form>
                </div>
                <div className="col-md-4">
                    <div className="card p-3">
                        <h4>Order Summary</h4>
                        <hr />
                        {state?.items?.map(item => (
                            <div key={item._id} className="d-flex justify-content-between mb-2">
                                <span>{item.productname || item.productid?.productname || 'Item'} (x{item.quantity})</span>
                                <span>${item.totalprice}</span>
                            </div>
                        ))}
                        <hr />
                        <h5>Total: ${state?.total}</h5>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
