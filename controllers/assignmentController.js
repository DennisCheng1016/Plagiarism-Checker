const Admin = require('../models/admin')
const Assignment = require('../models/assignment')
const Subject = require('../models/subject')
const User = require('../models/user')


const createAssignment = async(req, res) => {
    try{
        const userEmail = req.email
        if(!await User.findOne({email: userEmail, role: "teacher"})) return res.status(409).json({mag: "Must be teacher to perform"});
        const assignmentName = req.body.assignmentName
        const subjectCode = req.body.subjectCode
        if(!await Subject.findOne({subjectCode: subjectCode})) return res.status(409).json({mag: "Subject not found"});
        const newAssignment = new Assignment({
            assignmentName: assignmentName, 
            subjectCode: subjectCode
        })
        const update = await Subject.updateOne({subjectCode: subjectCode}, {$push: {assignments: newAssignment._id.toString()}})
        newAssignment.save()
        return res.status(200).json({msg: "Create assignment successfully"})

    } catch(error){
        res.status(500).json({msg: error.message})
    }
}

// const addSubject = async(req, res) => {
//     try{
//         const userEmail = req.email
//         const subjectCode = req.body.subjectCode
//         const subject = await Subject.findOne({subjectCode: subjectCode})
//         if(!subject) return res.status(409).json({ msg: "Subject not found"});
//         if(await User.findOne({email: userEmail, subjects: subjectCode})) return res.status(409).json({ msg: "Subject already existed"}); 
//         const result = await User.updateOne({email: userEmail}, {$push: {subjects: subjectCode}})
//         return res.status(200).json({msg: "Add subject successfully"})
//     } catch(error){
//         res.status(500).json({msg: error.message})
//     }
// }
// const deleteSubject = async(req, res) => {
//     try{
//         const userEmail = req.email
//         const subjectCode = req.body.subjectCode
//         const subject = await Subject.findOne({subjectCode: subjectCode})
//         if(!subject) return res.status(409).json({ msg: "Subject not found"});
//         if(!await User.findOne({email: userEmail, subjects: subjectCode})) return res.status(409).json({ msg: "Subject does not exist in the subjectList"}); 
//         const result = await User.updateOne({email: userEmail}, {$pull: {subjects: subjectCode}})
//         return res.status(200).json({msg: "Delete subject successfully"})
//     } catch(error){
//         res.status(500).json({msg: error.message})
//     }
// }

const getAssignmentList = async(req, res) => {
    try{
        const subjectCode = req.body.subjectCode
        const subject = await Subject.findOne({subjectCode: subjectCode})
        const assignmentList = subject.assignments
        console.log(assignmentList)
        return res.status(200).json(subjects)
    } catch(error){
        res.status(500).json({msg: error.message})
    }
}

module.exports = {
    createAssignment,
    getAssignmentList 
    // deleteSubject, 
    // getSubjectList
}