const subjectRouter = require('express').Router();
const {
	createSubject,
	updateSubject,
	getSubjectList,
	getSubjectListAdmin,
	addStudent,
	deleteSubject,
} = require('../controllers/subjectController');

subjectRouter.route('/admin/').get(getSubjectListAdmin).post(createSubject);
subjectRouter.route('/admin/:id').patch(updateSubject).delete(deleteSubject);
subjectRouter.route('/').get(getSubjectList).post(addStudent);

module.exports = subjectRouter;
