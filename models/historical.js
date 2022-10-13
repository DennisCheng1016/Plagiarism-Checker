// require mongoose module
const mongoose = require('mongoose');

/* -------------------------------------- MODEL -------------------------------------- */
const historicalSchema = new mongoose.Schema(
	{
		fileName: {
			type: String,
			required: true,
		},
		assignmentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Assignment',
			required: [true, 'Please provide assignment Id'],
		},
		checker: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Please provide user Id'],
		},
		submitter: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Please provide user Id'],
		},
		fileType: {
			type: String,
			required: [true, 'Please provide file type'],
		},
		grade: {
			type: String,
			enum: ['passed', 'failed'],
			required: true,
		},
		datasetId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Dataset',
			required: [true, 'Please provide dataset Id'],
		},
		similarity: {
			type: Number,
			required: true,
			default: 0,
		},
		duplicates: {
			type: [[String]],
			required: false,
			default: [],
		},
		when: {
			type: Date,
			required: true,
			default: Date.now(),
		},
		textContent: {
			type: String,
			required: true,
		},
		originalFile: {
			type: Buffer,
			required: true,
		},
	},
	{ timestamps: true }
);

const Historical = mongoose.model('Historical', historicalSchema);

module.exports = Historical;
