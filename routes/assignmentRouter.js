const assignmentRouter = require('express').Router();
const {
	getAssignmentList,
	createAssignment,
	updateAssignment,
	deleteAssignment,
	setDatasets,
} = require('../controllers/assignmentController');

assignmentRouter
	.route('/:id')
	.get(getAssignmentList)
	.post(createAssignment)
	.patch(updateAssignment)
	.delete(deleteAssignment);
assignmentRouter.route('/dataset/:id').patch(setDatasets);

module.exports = assignmentRouter;
