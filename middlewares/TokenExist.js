const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports = function(req, res, next) {
    //Get Token from header
    const token = req.header("token");

    //Check if not token
    if (!token) {
        return res.status(401).json({
            message: "No Token, authorisation denied"
        });
    }

    //verify token
    try {
        const decoded = jwt.verify(token, config.authentification.secret);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({
            message: "Token is not valid"
        });
    }
};
