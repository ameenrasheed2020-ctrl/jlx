const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    Name: { type: String },
    email: { type: String },
    password: { type: String },
    age: { type: Number },
    phonenumber: { type: String },
    profilephoto: { type: String }

});
const userModel = mongoose.model("User", userSchema)
module.exports = userModel;
