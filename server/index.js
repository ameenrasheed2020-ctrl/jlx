const express = require('express')
const path = require("path")
const dotenv = require('dotenv')
const authRouter = require('./Routes/authRouter')
const cors = require('cors')
const connections = require('./config/db')
const userRouter = require('./Routes/userRouter')
const productRouter = require('./Routes/productRouter')
const cartRouter = require('./Routes/cartRouter')
const orderRouter = require('./Routes/orderRouter')
const app = express()

dotenv.config()
connections()
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/product', productRouter)
app.use('/cart', cartRouter)
app.use('/order', orderRouter)





app.listen(6500, () => {
    console.log("Server is running on port 6500");
})
