//link to User model
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Permission = require('../models/permission');
const nodemailer = require('nodemailer');
const badRequestError = require('../errors/index').BadRequestError;

// User registration.
async function register(req, res) {
    // Front-end will check username, email and password are valid
    const {username, email, password, role} = req.body;

    // Check if the email already exists.
    let existingEmail = await User.findOne({email});
    if (existingEmail) {
        throw new Error('the email has been registered, wanna try new ones?');
    }

    if (role === 'teacher') {
        let permission = await Permission.findOne({email});
        if (!permission) {
            throw new Error('you are not permitted to register as teacher');
        }
    }

    // hash the password
    const HashedPassword = await bcrypt.hashSync(password, 10);

    // create account
    await User.create({
        username, email, password: HashedPassword, role,
    });

    // Send success response
    res.status(201).json({
        msg: 'registration successful',
    });
}

// User login.
async function login(req, res) {
    const {email, password} = req.body;

    // Find the user.
    const user = await User.findOne({email});

    // If the user isn't found.
    if (!user) {
        throw new Error('User not found');
    }

    // If the password is incorrect.
    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
        throw new Error('Incorrect email/password.');
    }

    if (user.accountStatus === 'disabled') {
        throw new Error('Your account has been disabled by administrator');
    }

    const {_id, username, role} = user;

    const Authorization = jwt.sign({_id}, process.env.TOKEN_SIGNATURE, {
        expiresIn: '1d',
    });

    res.status(201).json({
        Authorization, role, username
    });
}

//
async function sendAuthenticationEmail(req, res) {
    const {email} = req.body;

    // Find the user.
    const user = await User.findOne({email});

    // If the user isn't found.
    if (!user) {
        throw new Error('User not found');
    }

    if (user.accountStatus === 'disabled') {
        throw new Error('Your account has been disabled by administrator');
    }

    const {_id} = user;
    const Authorization = jwt.sign({_id}, process.env.TOKEN_SIGNATURE, {
        expiresIn: '1d',
    });

    const sendTo = email;
    const sendFrom = process.env.EMAIL_USER;
    const replyTo = email;
    const subject = "Authentication Email";
    const message = `
    <h3>Hello ${user.username}, </h3>
    <p>This is your token: <a href="https://sc-plagiarism-checker.herokuapp.com/resetPassword?token=${Authorization}"> click here</a></p>`;


    await sendEmail(subject, message, sendTo, sendFrom, replyTo);

    res.status(201).json({
        msg: "success"
    });
}

const sendEmail = async (subject, message, sendTo, sendFrom, replyTo) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, port: 587, auth: {
            user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS
        }, tls: {
            rejectUnauthorized: false
        }
    });

    const options = {
        from: sendFrom, to: sendTo, replyTo: replyTo, subject: subject, html: message
    }

    await transporter.sendMail(options, (err, info) => {
        if (err) {
            throw badRequestError;
        } else {
            console.log(info);
        }
    })
}

module.exports = {
    register, login, sendAuthenticationEmail
};
