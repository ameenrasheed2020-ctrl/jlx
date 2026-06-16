import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiUrl } from '../../config/api';
import './AddProduct.css'; // Reusing the same CSS as AddProduct

const EditProduct = () => {
    const { id } = useParams(); // Get product ID from URL
    const [productname, setProductName] = useState('');
    const [productdescription, setProductDescription] = useState('');
    const [productprice, setProductPrice] = useState('');
    const [productimage, setProductImage] = useState(null); // For new image upload
    const [existingImage, setExistingImage] = useState(''); // To display current image
    const [imagePreview, setImagePreview] = useState(null); // For new image preview
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Cleanup the object URL to avoid memory leaks
    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(apiUrl(`/product/getproduct/${id}`));
                if (response.ok) {
                    const data = await response.json();
                    setProductName(data.productname);
                    setProductDescription(data.productdescription);
                    setProductPrice(data.productprice);
                    setExistingImage(data.productimage); // Set existing image
                } else {
                    alert("Product not found or failed to fetch.");
                    navigate('/');
                }
            } catch (error) {
                console.error("Error fetching product for edit:", error);
                alert("An error occurred while fetching product details.");
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProductImage(file);
        if (file) setImagePreview(URL.createObjectURL(file));
        else setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userId = localStorage.getItem("userId");

        if (!userId) {
            alert('You must be logged in to edit a product.');
            navigate('/login');
            setLoading(false);
            return;
        }

        if (!productname || !productdescription || !productprice) {
            alert('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('userId', userId); // Assuming userId is needed for update authorization
        formData.append('productname', productname);
        formData.append('productdescription', productdescription);
        formData.append('productprice', productprice);
        if (productimage) { // Only append new image if selected
            formData.append('productimage', productimage);
        }

        try {
            const response = await fetch(apiUrl(`/product/updateproduct/${id}`), {
                method: 'PUT', // Use PUT for updates
                body: formData,
            });

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                if (response.ok) {
                    alert('Product updated successfully!');
                    navigate(`/product/${id}`); // Go back to product details page
                } else {
                    alert('Failed to update product: ' + (data.message || 'Server error'));
                    console.error('Error response:', data);
                }
            } else {
                const textError = await response.text();
                console.error('Received non-JSON response:', textError);
                alert('Server error: The server returned an unexpected format (possibly a crash).');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Network error: Could not connect to the server. Ensure your backend is running and configured with Multer for updates.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="add-product-container"><div className="add-product-card">Loading product for edit...</div></div>;

    return (
        <div className="add-product-container">
            <div className="add-product-card">
                <h2 className="add-product-title">Edit Product</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="productname">Product Name</label>
                        <input type="text" id="productname" value={productname} onChange={(e) => setProductName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="productdescription">Description</label>
                        <textarea id="productdescription" value={productdescription} onChange={(e) => setProductDescription(e.target.value)} required></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="productprice">Price</label>
                        <input type="number" id="productprice" value={productprice} onChange={(e) => setProductPrice(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="productimage">Product Image</label>
                        <input type="file" id="productimage" onChange={handleImageChange} accept="image/*" />
                        {(imagePreview || existingImage) && (
                            <div className="image-preview-container mt-2">
                                <img src={imagePreview || apiUrl(`/uploads/profiles/${existingImage}`)} alt="Product" style={{ maxWidth: '100%', height: '150px', borderRadius: '8px' }} />
                            </div>
                        )}
                    </div>
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Updating Product...' : 'Update Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
