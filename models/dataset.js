const mongoose = require("mongoose")

/* -------------------------------------- MODEL -------------------------------------- */
const datasetSchema = new mongoose.Schema({

    subjectCode: {
        type: String, 
        require: true, 
    }, 
    assignmentName: {
        type: String, 
        require: true
    }, 
    datasetName: {
        type:String, 
        requrie: true, 
        unique: true
    }
})

const Dataset = mongoose.model("Dataset", datasetSchema)

module.exports = Dataset