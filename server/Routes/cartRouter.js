const express = require("express")
const router = express.Router()
const { addToCart, getCartByUser, updateCartItem, removeFromCart } = require("../Controler/cartController")
router.post("/addcart", addToCart)
router.get("/getcart/:userId", getCartByUser)
router.put("/updatecart/:id", updateCartItem)
router.delete("/deletecart/:id", removeFromCart)
module.exports = router