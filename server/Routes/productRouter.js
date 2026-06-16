const express = require("express")
const router = express.Router()
const { createProduct, getAllProducts, getProductById, getProductsByUser, updateProduct, deleteProduct } = require("../Controler/productController")
const { upload } = require("../config/multer")

router.post("/createproduct", upload.single('productimage'), createProduct)
router.get("/getproducts", getAllProducts)
router.get("/user/:userId", getProductsByUser)
router.get("/getproduct/:id", getProductById)
router.put("/updateproduct/:id", upload.single('productimage'), updateProduct)
router.delete("/deleteproduct/:id", deleteProduct)
module.exports = router
