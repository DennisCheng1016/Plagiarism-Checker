//link to User model
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Permission = require('../models/permission')

// User registration.
async function register(req, res) {

    // Front-end will check username, email and password are valid
    const {username, email, password, role} = req.body;

    // Check if the email already exists.
    let existingEmail = await User.findOne({email});
    if (existingEmail) {
        throw new Error("the email has been registered, wanna try new ones?");
    }

    if (role === 'teacher') {
        let permission = await Permission.findOne({email});
        if (!permission) {
            throw new Error("you are not permitted to register as teacher");
        }
    }

    // hash the password
    const HashedPassword = await bcrypt.hashSync(password, 10);

    // create account
    await User.create({
        username, email, password: HashedPassword, role
    });

    // Send success response
    res.status(200).json({
        msg: "registration successful"
    });
}

// User login.
async function login(req, res) {

    const {email, password} = req.body;

    // Find the user.
    const user = await User.findOne({email});

    // If the user isn't found.
    if (!user) {
        throw new Error("User not found");
    }

    // If the password is incorrect.
    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
        throw new Error("Incorrect email/password.");
    }

    if (user.accountStatus === "disabled") {
        throw new Error("Your account has been disabled by administrator");
    }

    const Authorization = "Bearer " + jwt.sign({email}, process.env.TOKEN_SIGNATURE, {expiresIn: '1d'});
    const role = user.role;
    res.status(200).json({
        Authorization, role: role
    });
}

module.exports = {
    register, login
}
