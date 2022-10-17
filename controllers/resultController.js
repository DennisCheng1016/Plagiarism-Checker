const Result = require('../models/result');
const User = require('../models/user');
const Dataset = require('../models/dataset');
const Historical = require('../models/historical');
const { StatusCodes } = require('http-status-codes');

const getResultList = async (req, res) => {
	const checker = await User.findOne({ email: req.email }, {});
	const resultList = await Result.find(
		{ checker: checker.id, assignmentId: req.params.id },
		{
			fileName: true,
			assignmentId: true,
			similarity: true,
			submitter: true,
			when: true,
		}
	)
		.populate({
			path: 'assignmentId',
			select: 'assignmentName',
		})
		.populate({
			path: 'submitter',
			select: 'username',
		});
	res.status(StatusCodes.OK).json(resultList);
};

const getResultDetail = async (req, res) => {
	const result = await Result.findOne({ _id: req.params.id }, {}).lean();
	const dup = result.duplicates;
	var text = result.textContent;
	let highlightTable = [];
	for (let i = 0; i < text.length; i++) {
		highlightTable.push(0);
	}
	let startList = [];
	let endList = [];
	for (let i = 0; i < dup.length; i++) {
		if (text.includes(dup[i][0])) {
			let start = text.indexOf(dup[i][0]);
			highlightTable[start] = 1;
			startList.push(start);
			endList.push([start + dup[i][0].length-1, dup[i][1]]);
			highlightTable[start + dup[i][0].length-1] = 2;
		}
	}
	startList.sort(function(a, b){return a - b});
	endList.sort(function(a, b){return a[0] - b[0]});
	var resultList = [];
	var similarTo = [];
	var location = 0;
	for (let i = 0; i < startList.length; i++) {
		let segment = text.slice(location, startList[i]);
		segment = segment.split('&').join('&amp');
		segment = segment.split('"').join('&quot')
		segment = segment.split('\'').join('&#39;')
		segment = segment.split('<').join('&lt');
		segment = segment.split('>').join('&gt');
		segment = segment.split('\n').join('<br>')
		segment = "<p>" + segment + "</p>"
		resultList.push(segment);

		segment = text.slice(startList[i], endList[i][0]);
		segment = segment.split('&').join('&amp');
		segment = segment.split('"').join('&quot')
		segment = segment.split('\'').join('&#39;')
		segment = segment.split('<').join('&lt');
		segment = segment.split('>').join('&gt');
		segment = segment.split('\n').join('<br>')
		
		segment = '<p style=background-color:tomato>' + segment + `[${i}]`+"</p>"
		resultList.push(segment);
		location = endList[i][0];
		similarTo.push(endList[i][1]);
	}
	if (startList.length == 0) {
		let segment = text;
		segment = segment.split('&').join('&amp');
		segment = segment.split('"').join('&quot')
		segment = segment.split('\'').join('&#39;')
		segment = segment.split('<').join('&lt');
		segment = segment.split('>').join('&gt');
		segment = segment.split('\n').join('<br>')
		segment = "<p>" + segment + "</p>"
		resultList.push(segment);
	} else if (text.slice(endList[endList.length-1][0], endList.length) !== '') {
		let segment = text.slice(endList[endList.length-1], endList.length);
		segment = segment.split('&').join('&amp');
		segment = segment.split('"').join('&quot')
		segment = segment.split('\'').join('&#39;')
		segment = segment.split('<').join('&lt');
		segment = segment.split('>').join('&gt');
		segment = segment.split('\n').join('<br>')
		segment = "<p>" + segment + "</p>"
		resultList.push(segment);
	}

	var source = [];
	for (let i = 0; i < similarTo.length; i++) {
		if (similarTo[i].slice(0, 7) === './batch') {
			let sourceId = similarTo[i].slice(0, similarTo[i].lastIndexOf('/'));
			let fileName = similarTo[i].slice(similarTo[i].lastIndexOf('/')+1, similarTo[i].lastIndexOf('.txt'));
			sourceId = sourceId.slice(sourceId.lastIndexOf('_')+1, sourceId.length);
			const sourceUser = await User.findOne({_id: sourceId},{_id:false, username: true, email: true});
			source.push(
				{
					similarTo: fileName,
					author: sourceUser
				}
			);
		} else {
			const sourceDoc = await Historical.findOne({_id: similarTo[i]},{_id:false, fileName:true, submitter:true});
			const sourceUser = await User.findOne({_id: sourceDoc.submitter},{_id:false, username:true, email:true});
			source.push(
				{
					similarTo: sourceDoc.fileName,
					author: sourceUser
				}
			)
		}
	}

	res.status(StatusCodes.OK).send(
		{
			source: source, 
			htmlStrings: resultList,
			similarity: result.similarity
		}
	);
};

const saveResultsToHistorical = async (req, res) => {
	for (let i = 0; i < req.body.results.length; i++) {
		let result = await Result.findOne({ id: req.body.results[i] }, {});
		const historical = await Historical.create({
			fileName: result.fileName,
			assignmentId: result.assignmentId,
			checker: result.checker,
			submitter: result.submitter,
			fileType: result.fileType,
			grade: req.body.grade,
			datasetId: req.body.datasetId,
			similarity: result.similarity,
			duplicates: result.duplicates,
			when: result.when,
			textContent: result.textContent,
			originalFile: result.originalFile,
		});
		await result.remove();
	}
	res.status(StatusCodes.OK).send();
};

module.exports = {
	getResultList,
	getResultDetail,
	saveResultsToHistorical,
};
