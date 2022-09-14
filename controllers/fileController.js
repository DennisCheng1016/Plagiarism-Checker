const pdfParse = require('pdf-parse')
const fs = require('fs')
const fsp = require('fs').promises
const fileBuffer = require('../models/buffer')
const path = require('path')

let fileName
let resultText
const postSinglePDF = async(req, res) => {
    console.log("postSinglePDF")
    try{
        let file = req.files;
        console.log(Object.keys(file))
        Object.keys(file).map(key =>{
            console.log(key)
            console.log(file[key])
        })
        fileName = path.parse(file.name).name;

        file.mv("./raw/"+fileName, function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                pdfParse(file).then(result => {
                    resultText = result.text
                    fs.writeFile(`./result/${fileName}.txt`, result.text, err => {
                        if (err) {
                            console.error(err);
                        }
                        else {
                            api_stub(fileName);
                            res.status(200).send("File uploaded");
                        }
                    })
                })
            }
        })


    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

const getSingleTXT = async(req, res) => {
    console.log("getSingleTXT")
    try{
        console.log(`./result/${fileName}.txt`)
        let file = `./result/${fileName}.txt`;
        // let file = './result/risk.txt';
        res.download(file);
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

const getMockResult = async(req, res) => {
    console.log("getMockResult")
    try{
        fs.readFile(`./result/mockRate.txt`, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(data);
            result = {
                submissionID: 2,
                submitter: "Bob",
                file: fileName,
                uploadTime: new Date(2022, 4, 12).toDateString(),
                similarity: data,
                PorF: "pass",
                text: resultText
            }
            res.status(200).send(JSON.stringify(result));
        });
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

function api_stub(fileName) {
    fs.writeFile(`./result/mockRate.txt`, '10%', function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}

const uploadFiles = async(req, res) => {
    try{
        if(!req.files) return res.status.json({ msg: "No upload files"})
        const files = req.files.file
        const subjectCode = req.body.subjectCode
        const assignment = req.body.assignment
        const dataType = req.body.dataType
        const user = req.email
        Object.keys(files).map(key => {
            const file = files[key]
            const saveFile = new fileBuffer({
                user: user, 
                subjectCode: subjectCode, 
                assignment: assignment, 
                dataType: dataType,
                fileName: file.name, 
                binary: file.data
            })
            saveFile.save()
        })

        return res.status(200).json({ msg: "Files uploaded"})

    } catch(error){
        res.status(500).json({msg: error.message})
    }
} 

const getFiles = async(req, res) => {
    try{
        const user = req.user.email
        const subjectCode = req.body.subjectCode
        const assignment = req.body.assignment
        const dataType = req.body.dataType
        const files = await fileBuffer.find({subjectCode: subjectCode, assignment: assignment, dataType: dataType})
        files.forEach(async(file) => {
            fsp.writeFile(`./result/${user}/${file.fileName}`, file.binary)
        })

        return res.status(200).json({ msg: "Get files successfully"})

    } catch(error){
        res.status(500).json({msg: error, message})
    }
}

module.exports = {
    postSinglePDF,
    getSingleTXT,
    getMockResult, 
    uploadFiles, 
    getFiles
}