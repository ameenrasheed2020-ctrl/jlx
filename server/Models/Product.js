const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    productname: { type: String },
    productdescription: { type: String },
    productprice: { type: Number },
    productimage: { type: String },



})
const productModel = mongoose.model("Product", ProductSchema);
module.exports = productModel;   