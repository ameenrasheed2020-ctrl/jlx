const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

const chatSchema = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        dealStatus: {
            type: String,
            enum: ["chatting", "deal_made", "cancelled"],
            default: "chatting",
        },
        messages: [messageSchema],
    },
    { timestamps: true }
);

chatSchema.index({ productId: 1, buyerId: 1, sellerId: 1 }, { unique: true });

module.exports = mongoose.model("Chat", chatSchema);
