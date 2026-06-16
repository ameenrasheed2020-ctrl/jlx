const express = require("express")
const router = express.Router()
const {
    register,
    login,
    requestWhatsappOtp,
    requestWhatsappLoginOtp,
    loginWithWhatsappOtp
} = require("../Controler/authController")




router.post("/register", register)
router.post("/login", login)
router.post("/request-whatsapp-otp", requestWhatsappOtp)
router.post("/request-whatsapp-login-otp", requestWhatsappLoginOtp)
router.post("/login-whatsapp-otp", loginWithWhatsappOtp)



module.exports = router
