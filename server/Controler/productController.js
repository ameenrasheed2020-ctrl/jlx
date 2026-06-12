const Product = require("../Models/Product");
const mongoose = require("mongoose");

// Create a new product
const createProduct = async (req, res) => {
    try {
        const { productname, productdescription, productprice, userId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Valid seller userId is required" });
        }

        const productimage = req.file ? req.file.filename : ""; // Extract filename from Multer
        const newProduct = await Product.create({
            productname,
            productdescription,
            productprice,
            productimage: productimage,
            sellerId: userId,
            userId
        });
        res.status(201).json({ data: newProduct, message: "Product created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error: error.message });
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("sellerId", "Name email phonenumber");
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};

// Get single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("sellerId", "Name email phonenumber");
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (updateData.userId && mongoose.Types.ObjectId.isValid(updateData.userId)) {
            updateData.sellerId = updateData.userId;
        }

        if (req.file) {
            updateData.productimage = req.file.filename;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
        res.json({ data: updatedProduct, message: "Product updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
