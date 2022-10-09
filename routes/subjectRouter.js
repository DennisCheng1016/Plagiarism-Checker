const subjectRouter = require('express').Router();
const {
	createSubject,
	updateSubject,
	getSubjectList,
	getSubjectListAdmin,
	addStudent,
} = require('../controllers/subjectController');

subjectRouter.route('/admin/').get(getSubjectListAdmin).post(createSubject);
subjectRouter.route('/admin/:id').patch(updateSubject);
subjectRouter.route('/').get(getSubjectList).post(addStudent);

module.exports = subjectRouter;
