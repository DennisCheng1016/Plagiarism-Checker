const Result = require('../models/result');
const User = require('../models/user');
const Dataset = require('../models/dataset');
const Historical = require('../models/historical');


const getResultList = async(req, res) => {
    try {
        console.log(req.body.assignmentId);
        const checker = await User.findOne({email:req.email},{});
        const resultList = await Result.find({checker: checker.id, assignmentId: req.body.assignmentId}, {fileName:true, similarity:true, when:true}).lean();
        res.status(200).send(JSON.stringify(resultList));
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

const getResultDetail = async(req, res) => {
    const resultDetail = await Result.findOne({id:req.body.resultId}, {}).lean();
    res.status(200).send(JSON.stringify(resultDetail));
}

const storeResultsToDateset = async(req, res) => {
    // console.log(req.body.results);
    let result;
    for (let i = 0; i < req.body.results.length; i++) {
        result = await Result.findOne({id:req.body.results[i]},{});
        
        let passed = new Historical();
        passed.fileName = result.fileName;
        passed.assignmentId = result.assignmentId;
        passed.checker = result.checker;
        passed.submitter = result.submitter;
        passed.grade = 'passed';
        passed.datasets = [];
        for (let j = 0; j < req.body.datasets.length;j++) {
            passed.datasets.push(req.body.datasets[j]);
        }
        passed.similarity = result.similarity;
        passed.duplicates = result.duplicates;
        passed.when = result.when;
        passed.textContent = result.textContent;
        passed.originalFile = result.originalFile;
        await passed.save();
        await result.remove();
    }
    res.status(200).send({msg:"success"});
}

const tagAsFailed = async(req, res) => {
    console.log('tagAsFailed');
    const result = await Result.findOne({id:req.body.resultId},{});
    let failed = new Historical();
    failed.fileName = result.fileName;
    failed.assignmentId = result.assignmentId;
    failed.checker = result.checker;
    failed.submitter = result.submitter;
    failed.grade = 'failed';
    failed.datasets = [];
    failed.similarity = result.similarity;
    failed.duplicates = result.duplicates;
    failed.when = result.when;
    failed.textContent = result.textContent;
    failed.originalFile = result.originalFile;
    await failed.save();
    await result.remove();
    res.status(200).send({msg:"success"});
}

module.exports = {
    getResultList,
    getResultDetail,
    storeResultsToDateset,
    tagAsFailed
}