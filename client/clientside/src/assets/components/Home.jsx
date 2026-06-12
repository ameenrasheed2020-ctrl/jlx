import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(localStorage.getItem("userId")); // Initialize directly from localStorage
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:6500/product/getproducts");
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                } else {
                    console.error("Failed to fetch products. Status:", response.status);
                    setProducts([]);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem("userId");
        setUserId(null); // Update state to reflect logout
        navigate("/login"); // Navigate to login page after logout
    };

    const categories = [
        "Cars", "Properties", "Mobiles", "Jobs", "Bikes", "Electronics", "Furniture", "Fashion"
    ];

    const getSellerName = (product) => {
        if (product.sellerId && typeof product.sellerId === "object") {
            return product.sellerId.Name || product.sellerId.email || "Seller";
        }

        return "Seller";
    };

    // Filter products based on search query
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.productname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.productdescription.toLowerCase().includes(searchQuery.toLowerCase());

        // Note: Category filtering assumes your product model has a category field. 
        // If not, it currently only filters by search.
        const matchesCategory = selectedCategory === "All" ? true : product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) return <div className="home-loading">Loading products...</div>;

    return (
        <div className="home-container">
            {/* Main Navigation Header */}
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="search-btn">
                            <i className="bi bi-search"></i>
                        </button>
                    </div>

                    <div className="nav-actions">
                        <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Dark/Night Mode">
                            {theme === 'light' ? (
                                <i className="bi bi-sun-fill"></i>
                            ) : theme === 'dark' ? (
                                <i className="bi bi-moon-fill"></i>
                            ) : (
                                <i className="bi bi-moon-stars-fill"></i>
                            )}
                        </button>

                        {userId ? (
                            <div className="user-nav">
                                <span className="nav-link" onClick={() => navigate("/chats")}>Chats</span>
                                <button className="logout-link" onClick={handleLogout}>Logout</button>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
                                <button className="register-btn" onClick={() => navigate("/register")}>Register</button>
                            </div>
                        )}
                        <button className="sell-btn" onClick={() => {
                            if (userId) {
                                navigate("/add-product");
                            } else {
                                alert("Please login to sell items");
                                navigate("/login");
                            }
                        }}>
                            <span>+ SELL</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Category Bar */}
            <div className="category-bar">
                <div className="category-content">
                    <span
                        className={`cat-item ${selectedCategory === "All" ? "bold" : ""}`}
                        onClick={() => setSelectedCategory("All")}
                    >
                        ALL CATEGORIES
                    </span>
                    {categories.map(cat => (
                        <span
                            key={cat}
                            className={`cat-item ${selectedCategory === cat ? "bold" : ""}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </span>
                    ))}
                </div>
            </div>

            {/* Hero Banner Mock */}
            <div className="hero-banner">
                <img src="https://statics.olx.in/external/base/img/hero_bg_in.png" alt="Banner" />
            </div>

            <div className="product-grid">
                <h2 className="grid-title">Fresh recommendations</h2>
                <div className="grid-layout">
                    {filteredProducts.length === 0 ? (
                        <p className="no-results">No products found matching your search.</p>
                    ) : (
                        filteredProducts.map((product) => (
                            <div key={product._id} className="product-card">
                                <Link to={`/product/${product._id}`} className="card-link">
                                    <img
                                        src={product.productimage ? `http://localhost:6500/uploads/profiles/${product.productimage}` : 'https://via.placeholder.com/150'}
                                        alt={product.productname}
                                        className="product-image"
                                    />
                                    <div className="product-info">
                                        <p className="product-price">₹ {product.productprice}</p>
                                        <p className="product-name">{product.productname}</p>
                                        <p className="seller-name">Sold by {getSellerName(product)}</p>
                                        <div className="product-footer">
                                            <span>India</span>
                                            <span>Today</span>
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

export default Home;
