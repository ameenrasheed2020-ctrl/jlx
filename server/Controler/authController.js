const userModel = require("../Models/user")
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    let { Name, email, password, age, phonenumber, profilephoto } = req.body;

    if (req.file && req.file.filename) {
        profilephoto = req.file.filename;
    }

    const existingUser = await userModel.findOne({ email: email });

    if (existingUser) {
        return res.status(400).json({ message: "user is already existed...." })
    } else {

        const hashedpasswrd = await argon2.hash(password);
        const userr = await userModel.create
            ({
                Name,
                email,
                password: hashedpasswrd,
                age,
                phonenumber,
                profilephoto
            })
        console.log("User created successfully:", userr.email);


        res.json({ data: userr, message: "user succesfully added" })
    }




}







const login = async (req, res) => {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required"
            });
        }


        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }


        const isValid = await argon2.verify(user.password, password);

        if (!isValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }


        const token = jwt.sign(
            { userId: user._id },
            process.env.secret_key,
            { expiresIn: "1h" },
        );
        res.json({ token: token, userId: user._id });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};





module.exports = { register, login };
