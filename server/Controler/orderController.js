const Order = require("../Models/Order");
const Cart = require("../Models/Cart");

// Place a new order
const placeOrder = async (req, res) => {
    try {
        const { userId, products, shippingAddress, paymentMethod, totalAmount } = req.body;

        const newOrder = await Order.create({
            userId,
            products,
            shippingAddress,
            paymentMethod,
            totalAmount
        });

        // Logical cleanup: Clear the user's cart after placing the order
        await Cart.deleteMany({ userId });

        res.status(201).json({ data: newOrder, message: "Order placed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error placing order", error: error.message });
    }
};

// Get orders for a specific user
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
            .populate("products.productId")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

// Get single order details
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("products.productId userId");
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Error fetching order", error: error.message });
    }
};

// Update order status (for admin use)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus, paymentStatus },
            { new: true }
        );

        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
        res.json({ data: updatedOrder, message: "Order status updated" });
    } catch (error) {
        res.status(500).json({ message: "Error updating order status", error: error.message });
    }
};

module.exports = {
    placeOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus
};