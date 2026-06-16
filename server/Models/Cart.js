const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({

    userId: { type: String },
    productid: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productname: { type: String },
    quantity: { type: Number },
    price: { type: Number },
    totalprice: { type: Number },

}, { timestamps: true })
module.exports = mongoose.model("Cart", CartSchema);