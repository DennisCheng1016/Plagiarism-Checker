const assignmentRouter = require('express').Router();
const {
	getAssignmentList,
	createAssignment,
	updateAssignment,
} = require('../controllers/assignmentController');

assignmentRouter.route('/').post(createAssignment);
assignmentRouter.route('/:id').get(getAssignmentList).patch(updateAssignment);

module.exports = assignmentRouter;
