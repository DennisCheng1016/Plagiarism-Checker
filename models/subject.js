const mongoose = require('mongoose');

/* -------------------------------------- MODEL -------------------------------------- */
const subjectSchema = new mongoose.Schema(
	{
		subjectCode: {
			type: String,
			required: [true, 'Please provide subject code'],
			trim: true,
			unique: true,
		},
		subjectName: {
			type: String,
			trim: true,
			required: [true, 'Please provide subject name'],
		},
		teachers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		students: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		assignments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Assignment',
			},
		],
	},
	{ timestamps: true }
);

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
