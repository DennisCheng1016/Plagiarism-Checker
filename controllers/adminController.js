//link to User model
const Admin = require('../models/admin')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// User login.
async function login(req, res) {
    // Find the admin. 
    let admin = await Admin.findOne({ adminName: req.body.adminName });

    // If the user isn't found.
    if (!admin) {
        return res.status(409).json(
            { msg: "Admin not found" }
        );
    }

    // If the password is incorrect.
    const match = bcrypt.compareSync(req.body.password, admin.password);
    if (!match) {
        return res.status(409).json(
            { msg: "Incorrect name/password." }
        );
    }

    // If the password is correct, issue token.
    else {
        const token = generateToken(req);
        res.status(200).json(
            { token: token }
        );
    }
}

// Generate token function.
function generateToken(req) {
    const tokenData = {
        adminName: req.body.adminNAme
    }
    const token = jwt.sign(tokenData, process.env.TOKEN_SIGNATURE, { expiresIn: '1d' });
    return token
}

module.exports = {
    login,
}