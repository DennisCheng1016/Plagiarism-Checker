// require mongoose module
const mongoose = require("mongoose")
const subject = require('./subject')

/* -------------------------------------- MODEL -------------------------------------- */
const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'teacher'],
        required: true,
    },
    subjects: [String]
})


const User = mongoose.model("User", userSchema)

module.exports = User