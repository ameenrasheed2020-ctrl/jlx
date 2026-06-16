    const mongoose = require("mongoose")

    const connections = async () => {
        try {
            const uri = process.env.MONGO_URI

            if (!uri) {
                throw new Error("MONGO_URI is missing in .env")
            }

            await mongoose.connect(uri)
            console.log("database is working");

        } catch (error) {
            console.log("error :::::",error);
            
        }


        
    }
    module.exports = connections
