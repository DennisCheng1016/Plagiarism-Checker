const User = require("../models/user");

async function verifyAdmin(req, res, next) {
    if (req.user.role !== "admin")
        return res.status(401).json({msg: "you are not administrator!"});
    next();
}

module.exports = {verifyAdmin}
