require('dotenv').config()
const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
    const token = req.headers.token;

    // If no token. 
    if (token == null) {
        return res.status(400).json(
            { msg: "no token provided" }
        );
    }

    // Verify token.
    jwt.verify(token, process.env.TOKEN_SIGNATURE, (err, user) => {

        // Incorrect token.
        if (err) {
            return res.status(400).json(
                { msg: "Invalid token." }
            );
        }

        req.user = user;
        next();
    })

}

module.exports = {
    verifyToken
}