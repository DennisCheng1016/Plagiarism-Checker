const pdfParse = require('pdf-parse')
const fs = require('fs')
const path = require('path')

let fileName
const postSinglePDF = async(req, res) => {
    console.log("postSinglePDF")
    try{
        let file = req.files.file;
        fileName = file.name;

        file.mv("./raw/"+fileName, function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                pdfParse(file).then(result => {
                    fs.writeFile(`./result/${path.parse(fileName).name}.txt`, result.text, err => {
                        if (err) {
                            console.error(err);
                        }
                        else {
                            res.status(200).send(result.text);
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
        console.log(`./result/${path.parse(fileName).name}.txt`)
        let file = `./result/${path.parse(fileName).name}.txt`;
        res.download(file);
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}


module.exports = {
    postSinglePDF,
    getSingleTXT
}