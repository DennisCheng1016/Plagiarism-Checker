const mongoose = require('mongoose');

/* -------------------------------------- MODEL -------------------------------------- */
const assignmentSchema = new mongoose.Schema(
	{
		subject: {
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
		},
		dataset: [
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
