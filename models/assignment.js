const mongoose = require('mongoose');

/* -------------------------------------- MODEL -------------------------------------- */
const assignmentSchema = new mongoose.Schema(
	{
		subjectId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Subject',
			required: [true, 'Please provide subject Id'],
		},
		assignmentName: {
			type: String,
			required: [true, 'Please provide assignment name'],
			trim: true,
		},
		dueDate: {
			type: Date,
		},
		threshold: {
			type: Number,
			trim: true,
		},
		maxCheckTimes: {
			type: Number,
			trim: true,
			default: 3,
		},
		setDatasets: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Dataset',
			},
		],
		datasets: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Dataset',
			},
		],
	},
	{ timestamps: true }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
