const mongoose = require("mongoose")

/* -------------------------------------- MODEL -------------------------------------- */
const assignmentSchema = new mongoose.Schema({

    subjectCode: {
        type: String, 
        require: true, 
    }, 
    assignmentName: {
        type: String, 
        require: true 
    }, 
    dataset: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dataset'
    }]
})

const Assignment = mongoose.model("Assignment", assignmentSchema)

module.exports = Assignment