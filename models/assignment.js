const mongoose = require("mongoose")

/* -------------------------------------- MODEL -------------------------------------- */
const assignmentSchema = new mongoose.Schema({

    subjectCode: {
        type: String, 
        require: true, 
    }, 
    assignmentName: {
        type: String, 
        require: true, 
        unique: true
    }, 
    dataset: [String]
})

const Assignment = mongoose.model("Assignment", assignmentSchema)

module.exports = Assignment