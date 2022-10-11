const { exec } = require("child_process");
const pdfParse = require('pdf-parse')
const fs = require('fs');
const fsp = require('fs').promises;
const Buffer = require('../models/bufferFile');
const Result = require('../models/result');
const path = require('path');
const { sep } = require("path");

const postCheckConfig = async(req, res) => {
    try{
        let filesInPassed;
        console.log(req.body.assignmentId);
        console.log(req.body.fileType);
        console.log(req.body.user);
        const filesInBuffer = await Buffer.find({assignmentId: req.body.assignmentId, fileType: req.body.fileType});
        // console.log(filesInBuffer);
        res.status(200).send({msg:"success"});
        initiateCheck(filesInBuffer, filesInPassed, req.body.assignmentId, req.body.fileType, req.body.user);
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}


function initiateCheck(batchFiles, old, assignment, dataType, userId) {
    let granularity = 10;
    fsp.mkdir(`./batch_${assignment}_${dataType}_${userId}`, err => {
        if (err) {
            return console.error(err);
        }
    }).then( () => {
        if (dataType === 'pdf') {
            for (let i = 0; i < batchFiles.length; i++) {
                pdfParse(batchFiles[i].binary).then(async (result) => {
                    let fileName = path.parse(batchFiles[i].fileName).name;
                    fs.writeFileSync(`./batch_${assignment}_${dataType}_${userId}/${fileName}.txt`, result.text);
                    if (i == batchFiles.length-1) {
                        let batch = `./batch_${assignment}_${dataType}_${userId}`;
                        while (true) {
                            var batchDir = await fsp.readdir(batch);
                            if (batchDir.length == batchFiles.length) {
                                await new Promise(resolve => setTimeout(resolve, 5000));
                                exec(`./sim_3_0_2/sim_text -s -R -d -r ${granularity} ${batch} / ./old`, (error, stdout, stderr) => storeResult(stdout, batch, Date.now(), assignment, 'text', batchFiles));
                                // console.log(batchFiles.length);
                                break;
                            }
                        }
                    }
                })
            }
        } else if (dataType === 'c' || dataType === 'java') {
            for (let i = 0; i < batchFiles.length; i++) {
                let fileName = path.parse(batchFiles[i].fileName).name;
                fs.writeFileSync(`./batch_${assignment}_${dataType}_${userId}/${fileName}.c`, batchFiles[i].binary);
                if (i == batchFiles.length-1) {
                    let batch = `./batch_${assignment}_${dataType}_${userId}`;
                    exec(`./sim_3_0_2/sim_${dataType} -s -R -d -r ${granularity} ${batch} / ./old`, (error, stdout, stderr) => storeResult(stdout, batch, Date.now(), assignment, dataType, batchFiles));
                }
                
            }
        }
    })
}

async function storeResult(resultStr, batchName, when, assignment, dataType, files) {
    let data = resultStr.split('\n\n');
    let result = resultParser(data, dataType, batchName);
    let emailIndex = batchName.lastIndexOf('_')+1;
    let checker = batchName.slice(emailIndex, batchName.length);
    // console.log(resultStr);
    // console.log(files);
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
    // for (let i = 0; i < files.length; i++) {
    //     await Buffer.deleteOne({_id : files[i].id});
    // }
    fs.rmSync(batchName, { recursive: true, force: true });
}

function resultParser(result, dataType, batchName){
    let fileStat = fileStatParser(result, dataType);
    // console.log("fileStat.length:" + fileStat.length);
    let simStatMap = similarChunkParser(result);
    let returnArr = [];
    for (let i = 0; i < fileStat.length; i++) {
        var oneResult;
        if (simStatMap.has(fileStat[i].fileName)) {
            var text = fs.readFileSync(`${batchName}/${fileStat[i].fileName}`, "utf-8");
            var simRate = getSimilarityRate(simStatMap.get(fileStat[i].fileName).duplicates, text);
            console.log(simRate);
            oneResult = {
                fileName : fileStat[i].fileName,
                similarity: simRate,
                duplicates : simStatMap.get(fileStat[i].fileName).duplicates
            }
        } else {
            // console.log(fileStat[i].fileName + "dunno why sim is 0");
            oneResult = {
                fileName : fileStat[i].fileName,
                similarity : 0,
                duplicates : []
            }
        }
        returnArr.push(oneResult);
    }
    return returnArr;
}

function fileStatParser(result, dataType){
    let fileStat = result[0]
    let data = fileStat.split('\n');
    let fileStatResult = [];
    const batchEndIndex = data.indexOf('File /: new/old separator');
    for (let i = 0; i < batchEndIndex; i++) {
        let fileNameStart = data[i].lastIndexOf('/')+1;
        let fileNameEnd = data[i].indexOf(':');
        let wordNumEnd;
        if (dataType === 'text') {
            wordNumEnd = data[i].indexOf(' words')
        } else {
            wordNumEnd = data[i].indexOf(' tokens')
        }
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
    // console.log(chunks.length);
    for (let i = 0; i < chunks.length-1; i++){
        let chunkResult = singleChunkParser(chunks[i]);
        // console.log(chunkResult);
        for (let j = 0; j < chunkResult.length; j++){
            if (resultMap.has(chunkResult[j].fileName)) {
                let currentResult = resultMap.get(chunkResult[j].fileName);
                let oldDup = currentResult.duplicates;
                let newDup = oldDup.concat([chunkResult[j].duplicate]);
                // console.log(newDup);
                resultMap.set(chunkResult[j].fileName, {
                    fileName : chunkResult[j].fileName,
                    duplicates: newDup
                })
            } else {
                // console.log(chunkResult[j].duplicate)
                resultMap.set(chunkResult[j].fileName, {
                    fileName : chunkResult[j].fileName,
                    duplicates: [chunkResult[j].duplicate]
                })
            }
        }
    }
    // console.log(resultMap);
    return resultMap;
}

function singleChunkParser(chunk) {
    let data = chunk.split('\n');
    let fileName = [];

    let fileNameStart = data[0].lastIndexOf('/')+1;
    let fileNameEnd = data[0].indexOf(':');
    fileName.push(data[0].slice(fileNameStart,fileNameEnd));
    let file2Start = data[1].lastIndexOf('/')+1;
    let file2End = data[1].indexOf(':');
    fileName.push(data[1].slice(file2Start,file2End));

    let batchName = [];
    let batchStart1 = 0;
    let batchEnd1 = data[0].lastIndexOf('/');
    batchName.push(data[0].slice(batchStart1, batchEnd1));
    // const batch1 = data[0].slice(batchStart1, batchEnd1);
    let batchStart2 = 0;
    let batchEnd2 = data[1].lastIndexOf('/');
    batchName.push(data[1].slice(batchStart2, batchEnd2));
    // const batch2 = data[1].slice(batchStart2, batchEnd2);

    const numOfResult = (batchName[0] === batchName[1])?2:1;
    // if (numOfResult == 1) {
    //     console.log(fileName[0]);
    //     console.log(batch1);
    //     console.log(batch2);
    // }
    // console.log(batch1);

    let content = data.slice(2, data.length);
    const seperatorIndex = content.indexOf('---');

    let dup = [content.slice(0, seperatorIndex), content.slice(seperatorIndex+1, content.length)];
    let duplicate = [];

    for (let c = 0; c < numOfResult; c++){
        let dupStr = "";
        for (let i = 0; i < dup[c].length; i++) {
            dupStr = dupStr + dup[c][i].slice(2, dup[c][i].length);
        }
        duplicate.push([dupStr, batchName[(c+1)%2]+fileName[(c+1)%2]]);
    }

    let result = [];
    for (let i = 0; i < numOfResult; i++) {
        result.push({
            fileName: fileName[i],
            duplicate: duplicate[i]
        })
    }
    // console.log(result);
    return result;
}

function getSimilarityRate(dup, text) {
    text = text.split('\n');
    text = text.join('');
    // console.log(dup)

    let highlightTable = [];
    for (let i = 0; i < text.length; i++){
        highlightTable.push(0);
    }

    for (let i = 0; i < dup.length; i++) {
        // console.log(text.includes(dup[i]));
        if (text.includes(dup[i][0])) {
            let start = text.indexOf(dup[i][0]);
            for (let j = 0; j < dup[i][0].length; j++) {
                highlightTable[start+j] = 1;
            }
        }
    }
    let dupNum = 0;
    for (let i = 0; i < text.length; i++) {
        dupNum += highlightTable[i];
    }
    return dupNum/text.length;
}



module.exports = {
    postCheckConfig
}