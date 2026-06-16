import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { apiUrl } from "../../config/api";
import "./cart.css";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        document.body.className = `${theme}-mode`;
    }, [theme]);

    const toggleTheme = () => {
        const themes = ["light", "dark", "night"];
        const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
        const newTheme = themes[nextIndex];
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    // Fetch Cart
    const fetchCart = async () => {
        try {
            const res = await axios.get(
                apiUrl(`/cart/getcart/${userId}`)
            );

            setCartItems(res.data || []);
        } catch (error) {
            console.error("Error fetching cart:", error);
            setCartItems([]);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchCart();
        }
    }, []);

    // Navigation Logout
    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        navigate("/login");
    };

    // Update Quantity
    const updateQuantity = async (id, quantity, price) => {
        if (quantity < 1) return;

        try {
            await axios.put(
                apiUrl(`/cart/updatecart/${id}`),
                {
                    quantity,
                    price,
                }
            );

            fetchCart();
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    // Remove Item
    const removeItem = async (id) => {
        try {
            await axios.delete(
                apiUrl(`/cart/deletecart/${id}`)
            );

            fetchCart();
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    // Total Price
    const total = cartItems.reduce(
        (sum, item) => sum + item.totalprice,
        0
    );

    // Checkout
    const checkout = () => {
        navigate("/checkout", {
            state: { items: cartItems, total },
        });
    };

    if (!userId) {
        return <h2>Please login first</h2>;
    }

    return (
        <div className="home-container">
            {/* Main Navigation Header matching Home.jsx */}
            <nav className="jlx-navbar">
                <div className="navbar-content">
                    <div className="jlx-logo" onClick={() => navigate("/")}>JLX</div>

                    <div className="location-search">
                        <i className="bi bi-search"></i>
                        <input type="text" placeholder="India" defaultValue="India" />
                    </div>

                    <div className="main-search">
                        <input
                            type="text"
                            placeholder="Find Cars, Mobile Phones and more..."
                            disabled
                        />
                        <button className="search-btn">
                            <i className="bi bi-search"></i>
                        </button>
                    </div>

                    <div className="nav-actions">
                        <button className="theme-toggle-btn" onClick={toggleTheme}>
                            {theme === 'light' ? (
                                <i className="bi bi-sun-fill"></i>
                            ) : theme === 'dark' ? (
                                <i className="bi bi-moon-fill"></i>
                            ) : (
                                <i className="bi bi-moon-stars-fill"></i>
                            )}
                        </button>

                        <div className="user-nav">
                            <span className="nav-link" onClick={() => navigate("/orders")}>Orders</span>
                            <span className="nav-link" onClick={() => navigate("/cart")}>Cart</span>
                            <button className="logout-link" onClick={handleLogout}>Logout</button>
                        </div>
                        <button className="sell-btn" onClick={() => navigate("/add-product")}>
                            <span>+ SELL</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Category Bar matching Home.jsx */}
            <div className="category-bar">
                <div className="category-content">
                    <span className="cat-item" onClick={() => navigate("/")}>ALL CATEGORIES</span>
                    {["Cars", "Properties", "Mobiles", "Jobs", "Bikes", "Electronics", "Furniture", "Fashion"].map(cat => (
                        <span key={cat} className="cat-item" onClick={() => navigate("/")}>{cat}</span>
                    ))}
                </div>
            </div>

            <div className="cart-container container mt-5">
                <h1 className="mb-4">Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-5">
                        <h3 className="text-muted">Your cart is empty</h3>
                        <button className="btn btn-outline-secondary mt-3" onClick={() => navigate("/")}>Continue Shopping</button>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-md-8">
                            {cartItems.map((item) => (
                                <div key={item._id} className="card mb-3 shadow-sm border-0">
                                    <div className="card-body d-flex align-items-center">
                                        <div className="ms-3 flex-grow-1">
                                            <h5 className="mb-1">
                                                {item.productname || item.productid?.productname}
                                            </h5>
                                            <p className="text-success fw-bold mb-2">₹{item.price}</p>
                                            <div className="d-flex align-items-center">
                                                <div className="btn-group btn-group-sm border">
                                                    <button
                                                        className="btn btn-light"
                                                        onClick={() => updateQuantity(item._id, item.quantity - 1, item.price)}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-3 d-flex align-items-center">{item.quantity}</span>
                                                    <button
                                                        className="btn btn-light"
                                                        onClick={() => updateQuantity(item._id, item.quantity + 1, item.price)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    className="btn btn-link text-danger ms-auto text-decoration-none"
                                                    onClick={() => removeItem(item._id)}
                                                >
                                                    <i className="bi bi-trash"></i> Remove
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-end ms-4">
                                            <p className="small text-muted mb-0">Subtotal</p>
                                            <p className="fw-bold mb-0">₹{item.totalprice}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="col-md-4">
                            <div className="card shadow-sm border-0 p-4">
                                <h4 className="mb-4">Order Summary</h4>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Items ({cartItems.length})</span>
                                    <span>₹{total}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-4 fw-bold border-top pt-2">
                                    <span>Total Amount</span>
                                    <span className="text-success">₹{total}</span>
                                </div>
                                <button className="btn btn-primary btn-lg w-100 mb-3" onClick={checkout}>
                                    Proceed to Checkout
                                </button>
                                <button className="btn btn-outline-secondary w-100" onClick={() => navigate("/")}>
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
