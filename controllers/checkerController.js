const { exec } = require("child_process");
const pdfParse = require('pdf-parse')
const fs = require('fs');
const fsp = require('fs').promises;
const Buffer = require('../models/bufferFile');
const Result = require('../models/result');
const path = require('path');

const postCheckConfig = async(req, res) => {
    try{
        let filesInPassed;
        console.log(req.body.subjectCode);
        console.log(req.body.assignment);
        const filesInBuffer = await Buffer.find({subjectCode: req.body.subjectCode, assignment: req.body.assignment});
        // console.log(filesInBuffer);
        res.status(200).send({msg:"success"});
        initiateCheck(filesInBuffer, filesInPassed, req.body.subjectCode, req.body.assignment, req.body.dataType, req.email);
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}


function initiateCheck(batchFiles, old, subjectCode, assignment, dataType, userEmail) {
    let granularity = 10;
    fs.mkdir(`./batch_${subjectCode}_${assignment}_${dataType}_${userEmail}`, err => {
        if (err) {
            return console.error(err);
        }
    })
    for (let i = 0; i < batchFiles.length; i++) {
        pdfParse(batchFiles[i].binary).then(result => {
            let fileName = path.parse(batchFiles[i].fileName).name;
            fs.writeFileSync(`./batch_${subjectCode}_${assignment}_${dataType}_${userEmail}/${fileName}.txt`, result.text);
            if (i == batchFiles.length-1) {
                let batch = `./batch_${subjectCode}_${assignment}_${dataType}_${userEmail}`;
                exec(`./sim_3_0_2/sim_text -R -d -r ${granularity} ${batch} / ./old`, (error, stdout, stderr) => storeResult(stdout, batch, Date.now(), subjectCode, assignment, dataType, batchFiles));
            }
        })
    }
}

async function storeResult(resultStr, batchName, when, subjectCode, assignment, dataType, files) {
    let data = resultStr.split('\n\n');
    let result = resultParser(data);
    let emailIndex = batchName.lastIndexOf('_')+1;
    let checker = batchName.slice(emailIndex, batchName.length);
    for (let i = 0; i < result.length; i++) {
        let newResult = new Result();
        let realFileName = path.parse(result[i].fileName).name;
        newResult.fileName = realFileName;
        newResult.checker = checker;
        newResult.similarity = result[i].similarity;
        newResult.duplicates = result[i].duplicates;
        newResult.when = when;
        newResult.textContent = fs.readFileSync(`${batchName}/${result[i].fileName}`, 'utf8');
        files.forEach(async(file) => {
            let fileName = path.parse(file.fileName).name;
            if (fileName === realFileName) {
                newResult.originalFile = file.binary;
            }
        });
        await newResult.save();
    }
    for (let i = 0; i < files.length; i++) {
        await Buffer.deleteOne({_id : files[i].id});
    }
    fs.rmSync(batchName, { recursive: true, force: true });
}

function resultParser(result){
    let fileStat = fileStatParser(result);
    let simStatMap = similarChunkParser(result);
    let returnArr = [];
    for (let i = 0; i < fileStat.length; i++) {
        var oneResult;
        if (simStatMap.has(fileStat[i].fileName)) {
            oneResult = {
                fileName : fileStat[i].fileName,
                similarity : simStatMap.get(fileStat[i].fileName).simWordNum / fileStat[i].wordNum,
                duplicates : simStatMap.get(fileStat[i].fileName).duplicates
            }
        } else {
            oneResult = {
                fileName : fileStat[i].fileName,
                similarity : 0,
                duplicates : [[]]
            }
        }
        returnArr.push(oneResult);
    }
    return returnArr;
}

function fileStatParser(result){
    let fileStat = result[0]
    let data = fileStat.split('\n');
    let fileStatResult = [];
    const batchEndIndex = data.indexOf('File /: new/old separator');
    for (let i = 0; i < batchEndIndex; i++) {
        let fileNameStart = data[i].lastIndexOf('/')+1;
        let fileNameEnd = data[i].indexOf(':');
        let wordNumEnd = data[i].indexOf(' words');
        fileStatResult.push(
            {
                fileName : data[i].slice(fileNameStart, fileNameEnd),
                wordNum : parseInt(data[i].slice(fileNameEnd+2, wordNumEnd))
            }
        );
    }
    return fileStatResult;
}

function similarChunkParser(result){
    const resultMap = new Map();
    let chunks = result.slice(1, result.length);
    for (let i = 0; i < chunks.length-1; i++){
        let chunkResult = singleChunkParser(chunks[i]);
        if (resultMap.has(chunkResult.fileName)) {
            let currentResult = resultMap.get(chunkResult.fileName);
            let newDup = currentResult.duplicates;
            newDup.push(chunkResult.duplicate)
            resultMap.set(chunkResult.fileName, {
                fileName : chunkResult.fileName,
                simWordNum : chunkResult.simWordNum + currentResult.simWordNum,
                duplicates: newDup
            })
        } else {
            resultMap.set(chunkResult.fileName, {
                fileName : chunkResult.fileName,
                simWordNum : chunkResult.simWordNum,
                duplicates: [chunkResult.duplicate]
            })
        }
    }
    return resultMap;
}

function singleChunkParser(chunk) {
    let data = chunk.split('\n');
    let fileNameStart = data[0].lastIndexOf('/')+1;
    let fileNameEnd = data[0].indexOf(':');
    let simWordNumStart = data[0].lastIndexOf('[')+1;
    let simWordNumEnd = data[0].lastIndexOf(']');
    let dupStart = data[0].lastIndexOf('line ') + 5;
    let hyphenIndex = data[0].lastIndexOf('-');
    let dupEnd = simWordNumStart - 2;

    return {
        fileName : data[0].slice(fileNameStart, fileNameEnd),
        simWordNum : parseInt(data[0].slice(simWordNumStart, simWordNumEnd)),
        duplicate : [parseInt(data[0].slice(dupStart, hyphenIndex)), parseInt(data[0].slice(hyphenIndex+1, dupEnd))]
    }
}


module.exports = {
    postCheckConfig
}