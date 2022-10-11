const Result = require('../models/result');


const getResultList = async(req, res) => {
    try {
        const resultList = await Result.find({checker: req.email}, {fileName: true, when: true, similarity: true}).lean();
        res.status(200).send(JSON.stringify(resultList));
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

module.exports = {
    getResultList
}