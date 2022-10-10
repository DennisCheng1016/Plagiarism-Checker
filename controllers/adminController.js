const User = require('../models/user')
const Permission = require('../models/permission')

// a function that gets all user
async function getAllUser(req, res) {
    // get the user by email
    let users = await User.find({});

    // sent message to front-end
    res.status(201).json(users);
}

// a function gets all permissions for teacher to register
async function getAllPermission(req, res) {
    // get the permission by email
    let permission = await Permission.find({});

    // sent message to front-end
    res.status(201).json(permission);
}

// a function to update user account, e.g. username, account status!
async function updateUser(req, res) {
    const {userEmail, update} = req.body;
    console.log({userEmail});

    // get the user by email
    let users = await User.findOneAndUpdate({email: userEmail}, update, {new: true});

    // sent message to front-end
    res.status(201).json(users);
}

// a function to permit teachers to register
async function permitTeacherRegistration(req, res) {
    const {email} = req.body;

    // identify if the email has been permitted
    const exist = await Permission.findOne({email});
    if (exist) {
        throw new Error("the teacher's email has been permitted")
    }

    // create the permission
    await Permission.create({
        email
    });

    // sent message to front-end
    res.status(201).json({msg: "permitted registration"});
}

module.exports = {getAllUser, getAllPermission, updateUser, permitTeacherRegistration}
