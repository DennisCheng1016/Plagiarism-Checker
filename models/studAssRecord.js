// require mongoose module
const mongoose = require('mongoose');

/* -------------------------------------- MODEL -------------------------------------- */
const studAssRecordSchema = new mongoose.Schema(
	{
		assignmentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Assignment',
			required: [true, 'Please provide assignment Id'],
		},
		studentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Please provide user Id'],
		},
		checkedTime: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{ timestamps: true }
);

const StudAssRecord = mongoose.model('StudAssRecord', studAssRecordSchema);

module.exports = StudAssRecord;
