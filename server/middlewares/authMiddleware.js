const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel.js");

//Protected Routes token base
const requireSignIn = async (req, res, next) => {
    try {
        const decode = JWT.verify(
            req.headers.authorization.split(' ')[1],
            process.env.JWT_SECRET
        );
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
        return res.json({ error: error })
    }
};

module.exports = { requireSignIn }
