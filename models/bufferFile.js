// require mongoose module
const mongoose = require("mongoose")

/* -------------------------------------- MODEL -------------------------------------- */

const bufferSchema = new mongoose.Schema({

    userName:{
        type: String, 
        required: true
    }, 
    subjectCode:{
        type: String, 
        required: true, 
    }, 
    assignmentName:{
        type: String, 
        required: true, 
    }, 
    dataType:{
        type: String, 
        required: true, 
    }, 
    fileName:{
        type: String, 
        required: true
    }, 
    binary:{
        type: Buffer, 
        required: true
    }
})

const fileBuffer = mongoose.model("fileBuffer", bufferSchema)

module.exports = fileBuffer