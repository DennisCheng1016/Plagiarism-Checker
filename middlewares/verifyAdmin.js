const User = require("../models/user");

async function verifyToken(req, res, next) {
    const user = await User.findOne({email: req.email});
    if (user.role !== "admin") {
        return res.status(401).json({msg: "you are not administrator!"});
    }
    next();
}
