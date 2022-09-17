// require mongoose module
const mongoose = require("mongoose")

/* -------------------------------------- MODEL -------------------------------------- */

const bufferSchema = new mongoose.Schema({

    userName:{
        type: String, 
        require: true
    }, 
    subjectCode:{
        type: String, 
        require: true, 
    }, 
    assignmentName:{
        type: String, 
        require: true
    }, 
    dataType:{
        type: String, 
        require: true
    }, 
    fileName:{
        type: String, 
        require: true
    }, 
    binary:{
        type: Buffer, 
        require: true
    }
})

const fileBuffer = mongoose.model("fileBuffer", bufferSchema)

module.exports = fileBuffer