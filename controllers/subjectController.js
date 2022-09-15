const Admin = require('../models/admin')
const Subject = require('../models/subject')
const User = require('../models/user')


const createSubject = async(req, res) => {
    try{
        // const adminEmail = req.email
        // let admin = await Admin.findOne({email: adminEmail});
        // if (!admin) {
        //     return res.status(409).json(
        //         { msg: "Admin not found" }
        //     );
        // }

        const subjectCode = req.body.subjectCode
        if(Subject.findOne({subjectCode: subjectCode})) return res.status(409).json({mag: "SubjectCode has been used"});
        const subjectName = req.body.subjectName
        // console.log(subjectCode)
        // console.log(subjectName)
        const newSubject = new subject({
            subjectCode: subjectCode, 
            subjectName: subjectName
        })

        newSubject.save()
        return res.status(200).json({msg: "Create subject successfully"})

    } catch(error){
        res.status(500).json({msg: error.message})
    }
}

const addSubject = async(req, res) => {
    try{
        const userEmail = req.email
        console.log(userEmail)
        const subjectCode = req.body.subjectCode
        const subject = await Subject.findOne({subjectCode: subjectCode})
        if(!subject) return res.status(409).json({ msg: "Subject not found"});
        if(await User.findOne({email: userEmail, subjects: subjectCode})) return res.status(409).json({ msg: "Subject already existed"}); 
        const result = await User.updateOne({email: userEmail}, {$push: {subjects: subjectCode}})
        return res.status(200).json({msg: "Add subject successfully"})
    } catch(error){
        res.status(500).json({msg: error.message})
    }
}
const deleteSubject = async(req, res) => {
    try{
        const userEmail = req.email
        const subjectCode = req.body.subjectCode
        const subject = await Subject.findOne({subjectCode: subjectCode})
        if(!subject) return res.status(409).json({ msg: "Subject not found"});
        if(!await User.findOne({email: userEmail, subjects: subjectCode})) return res.status(409).json({ msg: "Subject does not exist in the subjectList"}); 
        const result = await User.updateOne({email: userEmail}, {$pull: {subjects: subjectCode}})
        return res.status(200).json({msg: "Delete subject successfully"})
    } catch(error){
        res.status(500).json({msg: error.message})
    }
}

const getSubjectList = async(req, res) => {
    try{
        // const userEmail = req.email
        // const subjectCode = req.body.subjectCode
        const subjects = await Subject.find({})
        console.log(subjects)
        // if(!subject) return res.status(409).json({ msg: "Subject not found"});
        // if(!await User.findOne({email: userEmail, subjects: subjectCode})) return res.status(409).json({ msg: "Subject does not exist in the subjectList"}); 
        // const result = await User.updateOne({email: userEmail}, {$pull: {subjects: subjectCode}})
        return res.status(200).json(subjects)
    } catch(error){
        res.status(500).json({msg: error.message})
    }
}

module.exports = {
    createSubject, 
    addSubject, 
    deleteSubject, 
    getSubjectList
}