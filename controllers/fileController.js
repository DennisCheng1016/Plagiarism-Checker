const pdfParse = require('pdf-parse')
const fs = require('fs')
const path = require('path')

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
                            api_stub('mockRate');
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
        // console.log(`./result/${path.parse(fileName).name}.txt`)
        // let file = `./result/${path.parse(fileName).name}.txt`;
        let file = './result/risk.txt';
        res.download(file);
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

const getMockResult = async(req, res) => {
    console.log("getMockResult")
    try{
        fs.readFile('./result/mockRate.txt', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(data);
            result = {
                submissionID: 2,
                submitter: "Bob",
                file: "56785.pdf",
                uploadTime: new Date(2022, 4, 12).toDateString(),
                similarity: data,
                PorF: "pass"
            }
            res.status(200).send(result);
        });
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

function api_stub(fileName) {
    fs.writeFile(`./result/${path.parse(fileName).name}.txt`, '10%', function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}


module.exports = {
    postSinglePDF,
    getSingleTXT,
    getMockResult
}