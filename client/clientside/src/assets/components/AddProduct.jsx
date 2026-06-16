import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../config/api';
import './AddProduct.css';

const AddProduct = () => {
    const [productname, setProductName] = useState('');
    const [productdescription, setProductDescription] = useState('');
    const [productprice, setProductPrice] = useState('');
    const [productimage, setProductImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert('You must be logged in to add a product.');
            navigate('/login');
        }
    }, [navigate]);

    // Cleanup the object URL to avoid memory leaks
    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProductImage(file);
        if (file) setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userId = localStorage.getItem("userId");

        if (!userId) {
            alert('You must be logged in to add a product.');
            navigate('/login');
            setLoading(false);
            return;
        }

        if (!productname || !productdescription || !productprice || !productimage) {
            alert('Please fill in all fields and select an image.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('productname', productname);
        formData.append('productdescription', productdescription);
        formData.append('productprice', productprice);
        formData.append('productimage', productimage); // Append the file itself

        try {
            const response = await fetch(apiUrl('/product/createproduct'), {
                method: 'POST',
                body: formData, // FormData is automatically set with correct Content-Type header
            });

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                if (response.ok) {
                    alert('Product added successfully!');
                    setProductName('');
                    setProductDescription('');
                    setProductPrice('');
                    setProductImage(null);
                    navigate('/');
                } else {
                    alert('Failed to add product: ' + (data.message || 'Server error'));
                    console.error('Error response:', data);
                }
            } else {
                const textError = await response.text();
                console.error('Received non-JSON response:', textError);
                alert('Server error: The server returned an unexpected format (possibly a crash).');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Network error: Could not connect to the server. Ensure your backend is running and configured with Multer to handle file uploads.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-product-container">
            <div className="add-product-card">
                <h2 className="add-product-title">Add New Product</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="productname">Product Name</label>
                        <input
                            type="text"
                            id="productname"
                            value={productname}
                            onChange={(e) => setProductName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="productdescription">Description</label>
                        <textarea
                            id="productdescription"
                            value={productdescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="productprice">Price</label>
                        <input
                            type="number"
                            id="productprice"
                            value={productprice}
                            onChange={(e) => setProductPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="productimage">Product Image</label>
                        <input type="file" id="productimage" onChange={handleImageChange} accept="image/*" required />
                        {imagePreview && (
                            <div className="image-preview-container mt-2">
                                <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', height: '150px', borderRadius: '8px' }} />
                            </div>
                        )}
                    </div>
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Adding Product...' : 'Add Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
