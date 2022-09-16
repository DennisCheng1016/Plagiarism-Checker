const mongoose = require("mongoose")

/* -------------------------------------- MODEL -------------------------------------- */
const assignmentSchema = new mongoose.Schema({

    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
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