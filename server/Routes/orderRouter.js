const express = require("express")
const router = express.Router()
const { placeOrder, getUserOrders, getOrderById, updateOrderStatus } = require("../Controler/orderController")
router.post("/placeorder", placeOrder)
router.get("/getorders/:userId", getUserOrders)
router.get("/getorder/:id", getOrderById)
router.put("/updateorder/:id", updateOrderStatus)
module.exports = router 