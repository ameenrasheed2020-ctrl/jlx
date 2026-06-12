const express = require("express");
const {
    getOrCreateConversation,
    getConversation,
    getUserConversations,
    sendMessage,
    updateDealStatus,
} = require("../Controler/chatController");

const router = express.Router();

router.post("/conversation", getOrCreateConversation);
router.get("/conversation/:id", getConversation);
router.get("/user/:userId", getUserConversations);
router.post("/conversation/:id/messages", sendMessage);
router.patch("/conversation/:id/deal", updateDealStatus);

module.exports = router;
