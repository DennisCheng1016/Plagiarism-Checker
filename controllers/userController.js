const User = require("../models/user");
const bcrypt = require("bcrypt");

// a function for front-end to get user information from token
async function getUserInfo(req, res) {

    // get the user by email
    let user = req.user;

    // sent message to front-end
    res.status(201).json({
        username: user.username,
        email: user.email,
        role: user.role,
        subjects: user.subjects,
        accountStatus: user.accountStatus
    });
}

// User login.
async function resetPassword(req, res) {

    const email = req.email;
    const password = req.body.password;

    // Find the user.
    const user = await User.findOne({email});

    // If the user isn't found.
    if (!user) {
        throw new Error('User not found');
    }
    if (user.accountStatus === 'disabled') {
        throw new Error('Your account has been disabled by administrator');
    }

    // hash the password
    user.password= await bcrypt.hashSync(password, 10);
    user.save();

    res.status(201).json({
        msg: "Success"
    });
}

module.exports = {getUserInfo, resetPassword}
