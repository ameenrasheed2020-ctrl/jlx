const mongoose = require("mongoose");

const whatsappOtpSchema = mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        index: true
    },
    purpose: {
        type: String,
        enum: ["register", "login"],
        default: "register",
        index: true
    },
    otpHash: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }
    },
    attempts: {
        type: Number,
        default: 0
    },
    verified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("WhatsappOtp", whatsappOtpSchema);
