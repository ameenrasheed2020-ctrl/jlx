const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    productname: { type: String },
    productdescription: { type: String },
    productprice: { type: Number },
    productimage: { type: String },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },



})
const productModel = mongoose.model("Product", ProductSchema);
module.exports = productModel;   
