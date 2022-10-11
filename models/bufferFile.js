// require mongoose module
const mongoose = require('mongoose');

/* -------------------------------------- MODEL -------------------------------------- */

const bufferSchema = new mongoose.Schema(
	{
		assignmentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Assignment',
			required: [true, 'Please provide assignment Id'],
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		fileType: {
			type: String,
			required: [true, 'Please provide file type'],
		},
		fileName: {
			type: String,
			required: [true, 'Please provide file name'],
		},
		binary: {
			type: Buffer,
			required: [true, 'Please provide file data'],
		},
	},
	{ timestamps: true }
);

const fileBuffer = mongoose.model('fileBuffer', bufferSchema);

module.exports = fileBuffer;
