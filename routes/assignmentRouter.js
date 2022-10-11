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
assignmentRouter.route('/setDataset/:id').patch(setDatasets);

module.exports = assignmentRouter;
