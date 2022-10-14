const { exec } = require('child_process');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const fsp = require('fs').promises;
const Buffer = require('../models/bufferFile');
const Result = require('../models/result');
const Assignment = require('../models/assignment');
const Historical = require('../models/historical');
const User = require('../models/user');
const StudAssRecord = require('../models/studAssRecord');
const path = require('path');
const { sep } = require('path');
const { StatusCodes } = require('http-status-codes');

const postCheckConfig = async (req, res) => {
	const filesInBuffer = await Buffer.find({
		assignmentId: req.body.assignmentId,
		fileType: req.body.fileType,
	});
	const assignment = await Assignment.findOne(
		{ _id: req.body.assignmentId },
		{}
	);
	const filesInPassed = await Historical.find(
		{
			datasetId: {$in: assignment.setDatasets },
            fileType: req.body.fileType
		},
		{}
	); 
	const checker = await User.findOne({ email: req.email }, {});
	res.status(StatusCodes.OK).send();
	initiateCheck(
		filesInBuffer,
		filesInPassed,
		req.body.assignmentId,
		req.body.fileType,
		checker,
		req.body.granularity
	);
};

const canStudentCheck = async (req, res) => {
	const checker = await User.findOne({ email: req.email }, {});
	if (checker.role === 'teacher' || checker.role === 'admin') {
		throw new BadRequestError('User not student');
	}
	const record = await StudAssRecord.findOne({studentId: checker.id, assignmentId: req.params.id},{});
	const assignment = await Assignment.findOne({_id: req.params.id},{});
	res.status(StatusCodes.OK).send(
		{
			allowed: record.checkedTime < assignment.maxCheckTimes
		}
	)
}

async function initiateCheck(
	batchFiles,
	historicalFiles,
	assignment,
	dataType,
	checker,
	granularity
) {
	const userId = checker.id;
	fsp.mkdir(`./historical_${assignment}_${dataType}_${userId}`, err => {
		if (err) {
			return console.error(err);
		}
	}).then(() => {
		if (dataType === 'pdf') {
			for (let i = 0; i < historicalFiles.length; i++) {
				pdfParse(historicalFiles[i].originalFile).then(result => {
					fs.writeFileSync(
						`./historical_${assignment}_${dataType}_${userId}/${historicalFiles[i].id}.txt`,
						result.text
					);
				});
			}
		} else if (dataType === 'c' || dataType === 'java') {
			for (let i = 0; i < historicalFiles.length; i++) {
				fs.writeFileSync(
					`./historical_${assignment}_${dataType}_${userId}/${historicalFiles[i].id}.${dataType}`,
					historicalFiles[i].originalFile
				);
			}
		}
	});

	await new Promise(resolve =>
		setTimeout(resolve, historicalFiles.length * 1000)
	);

	fsp.mkdir(`./batch_${assignment}_${dataType}_${userId}`, err => {
		if (err) {
			return console.error(err);
		}
	}).then(() => {
		if (dataType === 'pdf') {
			for (let i = 0; i < batchFiles.length; i++) {
				pdfParse(batchFiles[i].binary).then(async result => {
					let fileName = path.parse(batchFiles[i].fileName).name;
					fs.writeFileSync(
						`./batch_${assignment}_${dataType}_${userId}/${fileName}.txt`,
						result.text
					);
					if (i == batchFiles.length - 1) {
						let batch = `./batch_${assignment}_${dataType}_${userId}`;
						let historical = `./historical_${assignment}_${dataType}_${userId}`;
						while (true) {
							var batchDir = await fsp.readdir(batch);
							if (batchDir.length == batchFiles.length) {
								await new Promise(resolve =>
									setTimeout(resolve, 5000)
								);
								if (historicalFiles.length == 0) {
									if (checker.role === 'student') {
										exec(
											`./sim_3_0_2/sim_text -S -R -d -r ${granularity} ${batch} / ./old`,
											(error, stdout, stderr) =>
												storeResult(
													stdout,
													batch,
													historical,
													Date.now(),
													assignment,
													dataType,
													batchFiles,
													checker
												)
										);
									} else {
										exec(
											`./sim_3_0_2/sim_text -s -R -d -r ${granularity} ${batch} / ./old`,
											(error, stdout, stderr) =>
												storeResult(
													stdout,
													batch,
													historical,
													Date.now(),
													assignment,
													dataType,
													batchFiles,
													checker
												)
										);
									}
								} else {
									if (checker.role === 'student') {
										exec(
											`./sim_3_0_2/sim_text -S -R -d -r ${granularity} ${batch} / ${historical}`,
											(error, stdout, stderr) =>
												storeResult(
													stdout,
													batch,
													historical,
													Date.now(),
													assignment,
													dataType,
													batchFiles,
													checker
												)
										);
									} else {
										exec(
											`./sim_3_0_2/sim_text -s -R -d -r ${granularity} ${batch} / ${historical}`,
											(error, stdout, stderr) =>
												storeResult(
													stdout,
													batch,
													historical,
													Date.now(),
													assignment,
													dataType,
													batchFiles,
													checker
												)
										);
									}
								}
								break;
							}
						}
					}
				});
			}
		} else if (dataType === 'c' || dataType === 'java') {
			for (let i = 0; i < batchFiles.length; i++) {
				let fileName = path.parse(batchFiles[i].fileName).name;
				fs.writeFileSync(
					`./batch_${assignment}_${dataType}_${userId}/${fileName}.${dataType}`,
					batchFiles[i].binary
				);
				if (i == batchFiles.length - 1) {
					let batch = `./batch_${assignment}_${dataType}_${userId}`;
					let historical = `./historical_${assignment}_${dataType}_${userId}`;
					if (historicalFiles.length == 0) {
						if (checker.role === 'student') {
							exec(
								`./sim_3_0_2/sim_${dataType} -S -R -d -r ${granularity} ${batch} / ./old`,
								(error, stdout, stderr) =>
									storeResult(
										stdout,
										batch,
										historical,
										Date.now(),
										assignment,
										dataType,
										batchFiles,
										checker
									)
							);
						} else {
							exec(
								`./sim_3_0_2/sim_${dataType} -s -R -d -r ${granularity} ${batch} / ./old`,
								(error, stdout, stderr) =>
									storeResult(
										stdout,
										batch,
										historical,
										Date.now(),
										assignment,
										dataType,
										batchFiles,
										checker
									)
							);
						}
					} else {
						if (checker.role === 'student') {
							exec(
								`./sim_3_0_2/sim_${dataType} -S -R -d -r ${granularity} ${batch} / ${historical}`,
								(error, stdout, stderr) =>
									storeResult(
										stdout,
										batch,
										historical,
										Date.now(),
										assignment,
										dataType,
										batchFiles,
										checker
									)
							);
						} else {
							exec(
								`./sim_3_0_2/sim_${dataType} -s -R -d -r ${granularity} ${batch} / ${historical}`,
								(error, stdout, stderr) =>
									storeResult(
										stdout,
										batch,
										historical,
										Date.now(),
										assignment,
										dataType,
										batchFiles,
										checker
									)
							);
						}
					}
				}
			}
		}
	});
}

async function storeResult(
	resultStr,
	batchName,
	historical,
	when,
	assignmentId,
	dataType,
	files,
	checker
) {
	let data = resultStr.split('\n\n');
	let result = resultParser(data, dataType, batchName);
	for (let i = 0; i < result.length; i++) {
		let newResult = new Result();
		let realFileName = path.parse(result[i].fileName).name;
		newResult.fileName = realFileName;
		newResult.assignmentId = assignmentId;
		newResult.checker = checker.id;
        newResult.fileType = dataType;
		newResult.similarity = result[i].similarity;
		newResult.duplicates = result[i].duplicates;
		newResult.when = when;
		newResult.textContent = fs.readFileSync(
			`${batchName}/${result[i].fileName}`,
			'utf8'
		);
		files.forEach(async file => {
			let fileName = path.parse(file.fileName).name;
			if (fileName === realFileName) {
				newResult.originalFile = file.binary;
				newResult.submitter = file.user;
			}
		});
		await newResult.save();
	}
	if (checker.role !== 'student'){
		for (let i = 0; i < files.length; i++) {
			await Buffer.deleteOne({ _id: files[i].id });
		}
	} else {
		await StudAssRecord.findOneAndUpdate(
			{
				studentId: checker.id,
				assignmentId: assignmentId
			},{
				$inc: {
					checkedTime: 1
				}
			}
		);
	}
	fs.rmSync(batchName, { recursive: true, force: true });
	fs.rmSync(historical, { recursive: true, force: true });
}

function resultParser(result, dataType, batchName) {
	let fileStat = fileStatParser(result, dataType);
	let simStatMap = similarChunkParser(result);
	let returnArr = [];
	for (let i = 0; i < fileStat.length; i++) {
		var oneResult;
		if (simStatMap.has(fileStat[i].fileName)) {
			var text = fs.readFileSync(
				`${batchName}/${fileStat[i].fileName}`,
				'utf-8'
			);
			var simRate = getSimilarityRate(
				simStatMap.get(fileStat[i].fileName).duplicates,
				text
			);
			oneResult = {
				fileName: fileStat[i].fileName,
				similarity: simRate,
				duplicates: simStatMap.get(fileStat[i].fileName).duplicates,
			};
		} else {
			oneResult = {
				fileName: fileStat[i].fileName,
				similarity: 0,
				duplicates: [],
			};
		}
		returnArr.push(oneResult);
	}
	return returnArr;
}

function fileStatParser(result, dataType) {
	let fileStat = result[0];
	let data = fileStat.split('\n');
	let fileStatResult = [];
	const batchEndIndex = data.indexOf('File /: new/old separator');
	for (let i = 0; i < batchEndIndex; i++) {
		let fileNameStart = data[i].lastIndexOf('/') + 1;
		let fileNameEnd = data[i].indexOf(':');
		let wordNumEnd;
		if (dataType === 'pdf') {
			wordNumEnd = data[i].indexOf(' words');
		} else {
			wordNumEnd = data[i].indexOf(' tokens');
		}
		fileStatResult.push({
			fileName: data[i].slice(fileNameStart, fileNameEnd),
			wordNum: parseInt(data[i].slice(fileNameEnd + 2, wordNumEnd)),
		});
	}
	return fileStatResult;
}

function similarChunkParser(result) {
	const resultMap = new Map();
	let chunks = result.slice(1, result.length);
	for (let i = 0; i < chunks.length - 1; i++) {
		let chunkResult = singleChunkParser(chunks[i]);
		for (let j = 0; j < chunkResult.length; j++) {
			if (resultMap.has(chunkResult[j].fileName)) {
				let currentResult = resultMap.get(chunkResult[j].fileName);
				let oldDup = currentResult.duplicates;
				let newDup = oldDup.concat([chunkResult[j].duplicate]);
				resultMap.set(chunkResult[j].fileName, {
					fileName: chunkResult[j].fileName,
					duplicates: newDup,
				});
			} else {
				resultMap.set(chunkResult[j].fileName, {
					fileName: chunkResult[j].fileName,
					duplicates: [chunkResult[j].duplicate],
				});
			}
		}
	}
	return resultMap;
}

function singleChunkParser(chunk) {
	let data = chunk.split('\n');
	let fileName = [];

	let fileNameStart = data[0].lastIndexOf('/') + 1;
	let fileNameEnd = data[0].indexOf(':');
	fileName.push(data[0].slice(fileNameStart, fileNameEnd));
	let file2Start = data[1].lastIndexOf('/') + 1;
	let file2End = data[1].indexOf(':');
	fileName.push(data[1].slice(file2Start, file2End));

	let batchName = [];
	let batchStart1 = 0;
	let batchEnd1 = data[0].lastIndexOf('/');
	batchName.push(data[0].slice(batchStart1, batchEnd1));
	let batchStart2 = 0;
	let batchEnd2 = data[1].lastIndexOf('/');
	batchName.push(data[1].slice(batchStart2, batchEnd2));

	const numOfResult = batchName[0] === batchName[1] ? 2 : 1;

	let content = data.slice(2, data.length);
	const seperatorIndex = content.indexOf('---');

	let dup = [
		content.slice(0, seperatorIndex),
		content.slice(seperatorIndex + 1, content.length),
	];
	let duplicate = [];

	for (let c = 0; c < numOfResult; c++) {
		let dupStr = '';
		for (let i = 0; i < dup[c].length; i++) {
			dupStr = dupStr + dup[c][i].slice(2, dup[c][i].length);
		}
		if (numOfResult == 1) {
			duplicate.push([
				dupStr,
				fileName[(c + 1) % 2].slice(0, fileName[(c+1)%2].indexOf('.')),
			]);
		} else {
			duplicate.push([
				dupStr,
				batchName[(c + 1) % 2] + '/' + fileName[(c + 1) % 2],
			]);
		}
	}

	let result = [];
	for (let i = 0; i < numOfResult; i++) {
		result.push({
			fileName: fileName[i],
			duplicate: duplicate[i],
		});
	}
	return result;
}

function getSimilarityRate(dup, text) {
	text = text.split('\n');
	text = text.join('');

	let highlightTable = [];
	for (let i = 0; i < text.length; i++) {
		highlightTable.push(0);
	}

	for (let i = 0; i < dup.length; i++) {
		if (text.includes(dup[i][0])) {
			let start = text.indexOf(dup[i][0]);
			for (let j = 0; j < dup[i][0].length; j++) {
				highlightTable[start + j] = 1;
			}
		}
	}
	let dupNum = 0;
	for (let i = 0; i < text.length; i++) {
		dupNum += highlightTable[i];
	}
	return dupNum / text.length;
}

module.exports = {
	postCheckConfig,
	canStudentCheck
};
