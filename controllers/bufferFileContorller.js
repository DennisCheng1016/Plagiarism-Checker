const fileBuffer = require("../models/bufferFile")


const getBufferFiles = async(req, res) => {
    try{
        const subjectCode = req.query.subjectCode
        const assignmentName = req.query.assignmentName
        const files = await fileBuffer.find({subjectCode: subjectCode, assignment: assignmentName})
        files.forEach((file) => {
            console.log(file.assignment)
            delete file.binary
        })
        console.log(files)
        const filesList = Object.keys(files) 
        return res.status(200).json(files)
    } catch(error){
        res.status(500).json({msg: error.message})
    }
}

module.exports = {
    getBufferFiles
}