    const mongoose = require("mongoose")

    const connections = async () => {
        try {
            const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

            if (!uri) {
                throw new Error("MONGODB_URI or MONGO_URI is missing in server/.env");
            }

            await mongoose.connect(uri)
            console.log("database is working");

        } catch (error) {
            console.log("database connection error :::::", error.message);
            
        }


        
    }
    module.exports = connections
