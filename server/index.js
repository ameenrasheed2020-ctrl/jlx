const express = require('express')
const path = require("path")
const fs = require("fs")
const dotenv = require('dotenv')
const cors = require('cors')
const mongoose = require('mongoose')

dotenv.config()

const connections = require('./config/db')
const authRouter = require('./Routes/authRouter')
const userRouter = require('./Routes/userRouter')
const productRouter = require('./Routes/productRouter')
const cartRouter = require('./Routes/cartRouter')
const orderRouter = require('./Routes/orderRouter')
const chatRouter = require('./Routes/chatRouter')
const app = express()

connections()
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const requireDatabase = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            message: "Database is not connected. Set MONGODB_URI or MONGO_URI correctly.",
        });
    }

    next();
};

app.use('/auth', requireDatabase, authRouter)
app.use('/user', requireDatabase, userRouter)
app.use('/product', requireDatabase, productRouter)
app.use('/cart', requireDatabase, cartRouter)
app.use('/order', requireDatabase, orderRouter)
app.use('/chat', requireDatabase, chatRouter)

const clientDistPath = path.join(__dirname, "..", "client", "clientside", "dist");

if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
    app.use((req, res, next) => {
        if (req.method !== "GET") return next();

        res.sendFile(path.join(clientDistPath, "index.html"));
    });
}



const PORT = process.env.PORT || 6500;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
