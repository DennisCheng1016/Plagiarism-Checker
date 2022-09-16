const mongoose = require("mongoose")
// const user = require('./user')

/* -------------------------------------- MODEL -------------------------------------- */
const subjectSchema = new mongoose.Schema({

    subjectCode: {
        type: String, 
        require: true, 
        unique: true
    }, 
    subjectName: {
        type: String, 
        require: true
    }, 
    teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }], 
    assignments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment'
    }]
})

const Subject = mongoose.model("Subject", subjectSchema)

module.exports = Subject