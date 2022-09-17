const fileBuffer = require("../models/bufferFile")


const getBufferFiles = async(req, res) => {
    try{
        const subjectCode = req.query.subjectCode
        const assignmentName = req.query.assignmentName
        const files = await fileBuffer.find({subjectCode: subjectCode, assignmentName: assignmentName}).select("-binary")
        return res.status(200).json(files)
    } catch(error){
        res.status(500).json({msg: error.message})
    }
}

const deleteBufferFile = async(req, res) => {
    try{
        const _id = req.body._id
        if(!await fileBuffer.findById(_id)) return res.status(409).json({mag: "File not found"});
        const result = await fileBuffer.deleteOne({_id: _id});
        return res.status(500).json({msg: "Delete file successfully"})
    } catch(error){
        res.status(500).json({msg: error.message})
    }
}

module.exports = {
    getBufferFiles, 
    deleteBufferFile
}