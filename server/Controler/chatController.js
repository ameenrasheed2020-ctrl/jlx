const Chat = require("../Models/Chat");
const Product = require("../Models/Product");
const mongoose = require("mongoose");

const populateChat = (query) =>
    query
        .populate("productId", "productname productprice productimage")
        .populate("buyerId", "Name email")
        .populate("sellerId", "Name email phonenumber")
        .populate("messages.senderId", "Name email");

const getOrCreateConversation = async (req, res) => {
    try {
        const { productId, buyerId } = req.body;

        if (!productId || !buyerId) {
            return res.status(400).json({ message: "productId and buyerId are required" });
        }

        if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(buyerId)) {
            return res.status(400).json({ message: "Valid productId and buyerId are required" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let sellerId = product.sellerId || product.userId;
        if (!sellerId) {
            return res.status(400).json({ message: "Seller details are missing for this product" });
        }

        if (!mongoose.Types.ObjectId.isValid(sellerId)) {
            return res.status(400).json({ message: "Seller details are invalid for this product" });
        }

        if (!product.sellerId && product.userId) {
            product.sellerId = product.userId;
            await product.save();
            sellerId = product.sellerId;
        }

        if (sellerId.toString() === buyerId.toString()) {
            return res.status(400).json({ message: "You cannot chat with yourself about your own product" });
        }

        let chat = await Chat.findOne({ productId, buyerId, sellerId });
        if (!chat) {
            chat = await Chat.create({ productId, buyerId, sellerId, messages: [] });
        }

        const populatedChat = await populateChat(Chat.findById(chat._id));
        res.json(populatedChat);
    } catch (error) {
        res.status(500).json({ message: "Error opening chat", error: error.message });
    }
};

const getConversation = async (req, res) => {
    try {
        const chat = await populateChat(Chat.findById(req.params.id));
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: "Error fetching chat", error: error.message });
    }
};

const getUserConversations = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Valid userId is required" });
        }

        const chats = await populateChat(
            Chat.find({
                $or: [{ buyerId: userId }, { sellerId: userId }],
            }).sort({ updatedAt: -1 })
        );

        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: "Error fetching chats", error: error.message });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { senderId, text } = req.body;

        if (!senderId || !text || !text.trim()) {
            return res.status(400).json({ message: "senderId and message text are required" });
        }

        const chat = await Chat.findById(req.params.id);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        const isParticipant =
            chat.buyerId.toString() === senderId.toString() ||
            chat.sellerId.toString() === senderId.toString();

        if (!isParticipant) {
            return res.status(403).json({ message: "You are not part of this chat" });
        }

        chat.messages.push({ senderId, text: text.trim() });
        await chat.save();

        const populatedChat = await populateChat(Chat.findById(chat._id));
        res.json(populatedChat);
    } catch (error) {
        res.status(500).json({ message: "Error sending message", error: error.message });
    }
};

const updateDealStatus = async (req, res) => {
    try {
        const { dealStatus } = req.body;
        const allowedStatuses = ["chatting", "deal_made", "cancelled"];

        if (!allowedStatuses.includes(dealStatus)) {
            return res.status(400).json({ message: "Invalid deal status" });
        }

        const chat = await Chat.findById(req.params.id);

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        chat.dealStatus = dealStatus;
        await chat.save();

        if (dealStatus === "deal_made") {
            await Product.findByIdAndDelete(chat.productId);
        }

        const populatedChat = await populateChat(Chat.findById(chat._id));
        res.json(populatedChat);
    } catch (error) {
        res.status(500).json({ message: "Error updating deal status", error: error.message });
    }
};

module.exports = {
    getOrCreateConversation,
    getConversation,
    getUserConversations,
    sendMessage,
    updateDealStatus,
};
