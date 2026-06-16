const mongoose = require("mongoose");

mongoose.set("bufferCommands", false);

const connections = async () => {
    try {
        const uri =
            process.env.MONGODB_URI ||
            process.env.MONGO_URI ||
            (process.env.NODE_ENV === "production" ? "" : "mongodb://127.0.0.1:27017/express_project");

        if (!uri) {
            throw new Error("MONGODB_URI or MONGO_URI is required");
        }

        if (process.env.NODE_ENV === "production" && /(?:127\.0\.0\.1|localhost)/i.test(uri)) {
            throw new Error("Production MongoDB URI cannot point to localhost. Use MongoDB Atlas.");
        }

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("database is working");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
    }
};

module.exports = connections;
