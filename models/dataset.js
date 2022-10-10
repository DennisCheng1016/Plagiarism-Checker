const mongoose = require('mongoose');

/* -------------------------------------- MODEL -------------------------------------- */
const datasetSchema = new mongoose.Schema(
	{
		assignmentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Assignment',
			required: [true, 'Please provide assignment Id'],
		},
		datasetName: {
			type: String,
			required: [true, 'Please provide dataset name'],
			trim: true,
		},
		fileType: {
			type: String,
			required: [true, 'Please provide file type'],
		},
	},
	{ timestamps: true }
);

const Dataset = mongoose.model('Dataset', datasetSchema);

module.exports = Dataset;
