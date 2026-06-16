const Cart = require("../Models/Cart");

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const { userId, productid, quantity, price, productname } = req.body;

        // Check if item already exists in cart for this user
        let cartItem = await Cart.findOne({ userId, productid });

        if (cartItem) {
            // Update existing item quantity
            if (productname) {
                cartItem.productname = productname;
            }
            cartItem.quantity += parseInt(quantity);
            cartItem.totalprice = cartItem.quantity * cartItem.price;
            await cartItem.save();
        } else {
            // Create new cart entry
            cartItem = await Cart.create({
                userId,
                productname,
                productid,
                quantity,
                price,
                totalprice: quantity * price
            });
        }

        res.status(201).json({ data: cartItem, message: "Item added to cart" });
    } catch (error) {
        res.status(500).json({ message: "Error adding to cart", error: error.message });
    }
};

// Get cart items for a specific user
const getCartByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const cartItems = await Cart.find({ userId }).populate("productid");
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart", error: error.message });
    }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
    try {
        const { quantity, price } = req.body;
        const totalprice = quantity * price;

        const updatedItem = await Cart.findByIdAndUpdate(
            req.params.id,
            { quantity, price, totalprice },
            { new: true }
        );

        if (!updatedItem) return res.status(404).json({ message: "Cart item not found" });
        res.json({ data: updatedItem, message: "Cart updated" });
    } catch (error) {
        res.status(500).json({ message: "Error updating cart", error: error.message });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const deletedItem = await Cart.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: "Cart item not found" });
        res.json({ message: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({ message: "Error removing item", error: error.message });
    }
};

module.exports = {
    addToCart,
    getCartByUser,
    updateCartItem,
    removeFromCart
};