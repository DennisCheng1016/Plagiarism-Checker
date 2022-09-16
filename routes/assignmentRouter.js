const assignmentRouter = require('express').Router();
const assignmentController = require('../controllers/assignmentController');

assignmentRouter.post("/createAssignment", assignmentController.createAssignment);
// assignmentRouter.post("/addSubject", subjectController.addSubject);
// assignmentRouter.post("/deleteSubject", subjectController.deleteSubject);
assignmentRouter.get("/getSubjectList", assignmentController.getAssignmentList);

module.exports = assignmentRouter;