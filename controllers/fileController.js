const pdfParse = require('pdf-parse')
const fs = require('fs')
const path = require('path')

let fileName
let resultText
const postSinglePDF = async(req, res) => {
    console.log("postSinglePDF")
    try{
        let file = req.files.file;
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


module.exports = {
    postSinglePDF,
    getSingleTXT,
    getMockResult
}