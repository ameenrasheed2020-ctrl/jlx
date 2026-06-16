import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:6500/product/getproduct/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                } else {
                    setProduct(null);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product:", error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = async () => {
        if (!userId) {
            alert("Please login first");
            navigate("/login");
            return;
        }
        try {
            const response = await fetch("http://localhost:6500/cart/addcart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    productid: product._id,
                    productname: product.productname,
                    quantity: 1,
                    price: product.productprice
                })
            });

            if (response.ok) {
                alert("Product added to cart!");
                navigate("/cart");
            } else {
                const errorData = await response.json();
                alert("Failed to add product to cart: " + (errorData.message || "Server error"));
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("An error occurred while adding the product to the cart.");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:6500/product/deleteproduct/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                alert("Product deleted successfully!");
                navigate("/"); // Navigate to home page after deletion
            } else {
                const errorData = await response.json();
                alert("Failed to delete product: " + (errorData.message || "Server error"));
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("An error occurred while deleting the product.");
        }
    };

    const isOwner = userId && product && product.userId === userId; // Assuming product has a userId field
    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <img
                        src={product.productimage ? `http://localhost:6500/uploads/profiles/${product.productimage}` : 'https://via.placeholder.com/400'}
                        alt={product.productname}
                        className="img-fluid rounded shadow"
                    />
                </div>
                <div className="col-md-6">
                    <h1 className="display-4">{product.productname}</h1>
                    <p className="lead text-muted">{product.productdescription}</p>
                    <h3 className="text-success mb-4">Price: ${product.productprice}</h3>
                    {isOwner ? (
                        <>
                            <button className="btn btn-warning btn-lg w-100 mb-2" onClick={() => navigate(`/edit-product/${product._id}`)}>Edit Product</button>
                            <button className="btn btn-danger btn-lg w-100" onClick={handleDelete}>Delete Product</button>
                        </>
                    ) : (
                        <button className="btn btn-primary btn-lg w-100" onClick={addToCart}>Add to Cart</button>
                    )}
                    <button className="btn btn-outline-secondary btn-md w-100 mt-2" onClick={() => navigate("/")}>Back to Home</button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;