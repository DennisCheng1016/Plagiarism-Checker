const assignmentRouter = require('express').Router();
const {
	getAssignmentList,
	createAssignment,
	updateAssignment,
	deleteAssignment,
} = require('../controllers/assignmentController');

assignmentRouter
	.route('/:id')
	.get(getAssignmentList)
	.post(createAssignment)
	.patch(updateAssignment)
	.delete(deleteAssignment);

module.exports = assignmentRouter;
