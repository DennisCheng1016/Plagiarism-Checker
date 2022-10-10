const assignmentRouter = require('express').Router();
const {
	getAssignmentList,
	createAssignment,
	updateAssignment,
} = require('../controllers/assignmentController');

assignmentRouter
	.route('/:id')
	.get(getAssignmentList)
	.post(createAssignment)
	.patch(updateAssignment);

module.exports = assignmentRouter;
