import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiUrl } from '../../config/api';
import './Home.css';

const MyAds = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyAds = async () => {
            if (!userId) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(apiUrl(`/product/user/${userId}`));
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error("Error fetching ads:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyAds();
    }, [navigate, userId]);

    if (loading) return <div className="home-loading">Loading your ads...</div>;

    return (
        <div className="home-container">
            <nav className="jlx-navbar">
                <div className="navbar-content">
                    <div className="jlx-logo" onClick={() => navigate("/")}>JLX</div>
                    <div className="nav-actions">
                        <span className="nav-link" onClick={() => navigate("/chats")}>Chats</span>
                        <button className="sell-btn" onClick={() => navigate("/add-product")}>+ SELL</button>
                    </div>
                </div>
            </nav>

            <div className="product-grid">
                <h2 className="grid-title">My Ads</h2>
                <div className="grid-layout">
                    {products.length === 0 ? (
                        <p className="no-results">You have not posted any ads yet.</p>
                    ) : (
                        products.map((product) => (
                            <div key={product._id} className="product-card">
                                <Link to={`/product/${product._id}`} className="card-link">
                                    <img
                                        src={product.productimage ? apiUrl(`/uploads/profiles/${product.productimage}`) : 'https://via.placeholder.com/150'}
                                        alt={product.productname}
                                        className="product-image"
                                    />
                                    <div className="product-info">
                                        <p className="product-price">Rs. {product.productprice}</p>
                                        <p className="product-name">{product.productname}</p>
                                        <div className="product-footer">
                                            <span>Your ad</span>
                                            <span>Active</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyAds;
