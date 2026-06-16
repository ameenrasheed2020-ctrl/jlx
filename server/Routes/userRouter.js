const express = require("express")
const { getuser, getuserbyid, deleteuserbyid, edituserbyid, uploadprofilephoto, getLoggedInUser } = require("../Controler/userController")
const router = express.Router()
const { verifytoken } = require("../MiddleWare/authverify")
const { upload } = require("../config/multer")

router.get("/getuser", getuser)
router.get("/getuser/:id", getuserbyid)
router.get("/me", verifytoken, getLoggedInUser)
router.delete("/deleteuser/:id", deleteuserbyid)
router.put("/updateuser/:id", edituserbyid)
router.post("/uploadphoto", verifytoken, upload.single('profilephoto'), uploadprofilephoto)

module.exports = router