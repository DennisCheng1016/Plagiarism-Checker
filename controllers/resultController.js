const Result = require('../models/result');
const User = require('../models/user');
const Dataset = require('../models/dataset');
const Historical = require('../models/historical');
const { StatusCodes } = require('http-status-codes');


const getResultList = async(req, res) => {
    console.log(req.params.id);
    const checker = await User.findOne({email:req.email},{});
    const resultList = await Result.find({checker: checker.id, assignmentId: req.params.id}, {fileName:true, assignmentId:true, similarity:true, submitter:true, when:true}).lean();
    res.status(StatusCodes.OK).send(JSON.stringify(resultList));
}

const getResultDetail = async(req, res) => {
    const resultDetail = await Result.findOne({id:req.params.id}, {}).lean();
    res.status(StatusCodes.OK).send(JSON.stringify(resultDetail));
}

const saveResultsToHistorical = async(req, res) => {
    for (let i = 0; i < req.body.results.length; i++) {
        let result = await Result.findOne({id:req.body.results[i]},{});
        const historical = await Historical.create({
            fileName: result.fileName,
            assignmentId: result.assignmentId,
            checker: result.checker,
            submitter: result.submitter,
            grade: req.body.grade,
            datasets: req.body.datasets,
            similarity: result.similarity,
            duplicates: result.duplicates,
            when: result.when,
            textContent: result.textContent,
            originalFile: result.originalFile
        });
        await result.remove();
    }
    res.status(StatusCodes.OK).send();
}

module.exports = {
    getResultList,
    getResultDetail,
    saveResultsToHistorical
}