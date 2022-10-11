// require mongoose module
const mongoose = require('mongoose');
const validator = require('validator');

/* -------------------------------------- MODEL -------------------------------------- */
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, 'Please provide valid username'],
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validator: {
			validator: validator.isEmail,
			message: 'Please provide valid email',
		},
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ['student', 'teacher', 'admin'],
		required: true,
	},
	subjects: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Subject',
		},
	],
	accountStatus: {
		type: String,
		enum: ['disabled', 'active'],
		default: 'active',
	},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
