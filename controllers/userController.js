const User = require("../models/user");

// a function for front-end to get user information from token
async function getUserInfo(req, res) {

    // get the user by email
    let user = await User.findOne({email: req.email});

    // sent message to front-end
    res.status(200).json({
        username: user.username,
        email: user.email,
        role: user.role,
        subjects: user.subjects,
        accountStatus: user.accountStatus
    });
}

module.exports = {getUserInfo}
