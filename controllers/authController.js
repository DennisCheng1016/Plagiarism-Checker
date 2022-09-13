//link to User model
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// User registation. 
async function register(req, res) {

    // Front-end will check username, email and password are valid
    try {

        // Check if the email already exists.
        let existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(409).json({
                msg: "Email has been registered"
            });
        }

        // hash the password
        const Hashedpwd = await bcrypt.hashSync(req.body.password, 10);

        // register the user.
        const user = new User(
            {
                username: req.body.username,
                email: req.body.email,
                password: Hashedpwd,
                role: req.body.role,
            });
        await user.save();

        // Send success response
        res.status(200).json({
            msg: "registration successful"
        });
    } catch (error) {
        console.log(error);
        // handle unexpected error from promises
        res.status(500).json({ msg: error.message })
    }
}

// User login.
async function login(req, res) {

    // Find the user. 
    let user = await User.findOne({ email: req.body.email });

    // If the user isn't found.
    if (!user) {
        return res.status(409).json({
            msg: "User not found"
        });
    }

    // If the password is incorrect.
    const match = bcrypt.compareSync(req.body.password, user.password);
    if (!match) {
        return res.status(409).json({
            msg: "Incorrect email/password."
        });
    }

    // If the password is correct, issue token.
    else {
        const token = generateToken(req);
        const role = user.role;
        res.status(200).json({
            token: token,
            role: role
        });
    }
}

// Generate token function.
function generateToken(req) {
    const tokenData = {
        email: req.body.email
    }
    const token = jwt.sign(tokenData, process.env.TOKEN_SIGNATURE, { expiresIn: '1d' });
    return token
}

// get user information from token
async function getUserInfo(req, res) {

    // get token from header
    let token = req.headers.token;

    // if token does not exist, return error message
    if (!token) {
        return res.status(409).json({
            msg: "Invalid token."
        });
    } else {

        // Verify token.
        jwt.verify(token, process.env.TOKEN_SIGNATURE, async (err, email) => {

            // Incorrect token.
            if (err) {
                return res.status(400).json(
                    { msg: "Invalid token." }
                );
            }
            console.log(email);
            // get the user by email
            let user = await User.findOne({ email: email.email });
            

            // sent message to front-end
            res.status(200).json({
                username: user.username,
                email: user.email,
                role: user.role,
                subjects: user.subjects
            });
        });
    }
}

module.exports = {
    register,
    login,
    getUserInfo
}