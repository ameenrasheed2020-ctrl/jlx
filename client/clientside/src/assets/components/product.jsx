import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiUrl } from '../../config/api';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(apiUrl(`/product/getproduct/${id}`));
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

    const startChat = async () => {
        if (!userId) {
            alert("Please login first");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(apiUrl("/chat/conversation"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product._id, buyerId: userId }),
            });

            const data = await response.json();
            if (response.ok) {
                navigate(`/chat/${data._id}`);
            } else {
                alert(data.message || "Could not open chat.");
            }
        } catch (error) {
            console.error("Error opening chat:", error);
            alert("An error occurred while opening chat.");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }
        try {
            const response = await fetch(apiUrl(`/product/deleteproduct/${id}`), {
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
                        src={product.productimage ? apiUrl(`/uploads/profiles/${product.productimage}`) : 'https://via.placeholder.com/400'}
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
                        <button className="btn btn-success btn-lg w-100" onClick={startChat}>Chat with Seller</button>
                    )}
                    <button className="btn btn-outline-secondary btn-md w-100 mt-2" onClick={() => navigate("/")}>Back to Home</button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
