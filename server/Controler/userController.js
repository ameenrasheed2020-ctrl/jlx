const userModel = require("../Models/user")
const argon2 = require('argon2')

const getLoggedInUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const getuser = async (req, res) => {
    try {
        const userdetails = await userModel.find().select("-password");
        res.json(userdetails);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
const getuserbyid = async (req, res) => {
    const kkk = await userModel.findById(req.params.id)
    res.json(kkk)

}
const deleteuserbyid = async (req, res) => {
    const kkk = await userModel.findByIdAndDelete(req.params.id)
    console.log(kkk)
    res.json("succesfully deleted")
}



const edituserbyid = async (req, res) => {

    try {
        const { Name, email, password, age, phonenumber } = req.body;
        const userId = req.params.id;
        let updateFields = { Name, email, age, phonenumber };
        if (password) {
            updateFields.password = await argon2.hash(password);
        }

        const edit = await userModel.findByIdAndUpdate(userId, updateFields, { new: true });
        res.json({ data: edit, message: "succcessfully " })
    } catch (error) {
        console.log("edit error : ", error);

    }
}





const uploadprofilephoto = async (req, res) => {
    console.log("form backend end point ", req.body)
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }


        // console.log("bbb :",req.file.filename);/


        const user = await userModel.findByIdAndUpdate(
            req.user.userId,
            { profilephoto: `/uploads/profiles/${req.file.filename}` },
            { new: true }
        )


        res.json({
            message: "Profile photo uploaded successfully",
            user
        });

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Failed to upload profile photo" });
    }
};


module.exports = { getuser, getuserbyid, deleteuserbyid, edituserbyid, uploadprofilephoto, getLoggedInUser };
