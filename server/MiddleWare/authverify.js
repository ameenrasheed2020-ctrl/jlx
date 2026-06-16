const jwt = require('jsonwebtoken');
const userModel = require('../Models/user');

const verifytoken = (req, res, next) => {
  console.log("currently working");

  const authheader = req.headers.authorization;
  const secret_key = "ameen";

  console.log("this is :", authheader);

  if (!authheader) {
    return res.status(403).json({ message: "token required" });
  }

  const extractedToken = authheader.split(" ")[1];

  try {
    const decode = jwt.verify(extractedToken, secret_key);

    req.user = decode;
    next();
  } catch (error) {
    res.status(401).json({ message: "token invalid/not verified" });
  }
};









module.exports = { verifytoken };