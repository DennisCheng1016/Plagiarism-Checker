// require mongoose module
const mongoose = require("mongoose");

/* -------------------------------------- MODEL -------------------------------------- */
const adminSchema = new mongoose.Schema({
    adminName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
})


const Admin = mongoose.model("Admin", adminSchema)

module.exports = Admin