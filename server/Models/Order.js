const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },

            quantity: {
                type: Number,
                required: true,
            },
        },
    ],

    shippingAddress: {
        address: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
    },

    paymentMethod: {
        type: String,
        enum: ["COD", "ONLINE"],
        default: "COD",
    },

    paymentStatus: {
        type: String,
        enum: ["PENDING", "PAID"],
        default: "PENDING",
    },

    orderStatus: {
        type: String,
        enum: [
            "PROCESSING",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
        ],
        default: "PROCESSING",
    },

    totalAmount: {
        type: Number,
        required: true,
    },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", OrderSchema);


