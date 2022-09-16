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
        const teacherEmail = req.body.teacherEmail
        // console.log(teacherEmail)
        const teacher = await User.findOne({email: teacherEmail, role: "teacher"});
        if(!teacher) res.status(409).json({msg: "Teacher not found"});
        if(!subjectCode) return res.status(409).json({msg: "No subjectCode!"});
        if(await Subject.findOne({subjectCode: subjectCode})) return res.status(409).json({mag: "SubjectCode has been used"});
        const subjectName = req.body.subjectName
        const newSubject = new Subject({
            subjectCode: subjectCode, 
            subjectName: subjectName,
            teachers: teacher._id 
        })
        // console.log(newSubject._id)
        const result = await User.updateOne({email: teacherEmail}, {$push: {subjects: newSubject._id}})
        newSubject.save()
        return res.status(200).json({msg: "Create subject successfully"})

    } catch(error){
        res.status(500).json({msg: error.message})
    }
}

const addSubject = async(req, res) => {
    try{
        const userEmail = req.email
        const subjectCode = req.body.subjectCode
        const subject = await Subject.findOne({subjectCode: subjectCode})
        if(!subject) return res.status(409).json({ msg: "Subject not found"});
        if(await User.findOne({email: userEmail, subjects: subject._id})) return res.status(409).json({ msg: "Subject already existed"}); 
        const result = await User.updateOne({email: userEmail}, {$push: {subjects: subject._id}})
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
        if(!await User.findOne({email: userEmail, subjects: subject._id})) return res.status(409).json({ msg: "Subject does not exist in the subjectList"}); 
        const result = await User.updateOne({email: userEmail}, {$pull: {subjects: subject._id}})
        const result2 = await Subject.deleteOne({subjectCode: subjectCode})
        return res.status(200).json({msg: "Delete subject successfully"})
    } catch(error){
        res.status(500).json({msg: error.message})
    }
}

const getSubjectList = async(req, res) => {
    try{
        const userEmail = req.email
        console.log(userEmail)
        // const subjects = await User.find({email: userEmail}).populate("subjects")
        const user = await User.findOne({email: userEmail}).populate("subjects")
        console.log(user)
        console.log(user.subjects)
        return res.status(200).json(user.subjects)
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