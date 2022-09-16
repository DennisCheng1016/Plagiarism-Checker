const assignmentRouter = require('express').Router();
const assignmentController = require('../controllers/assignmentController');

assignmentRouter.post("/createAssignment", assignmentController.createAssignment);
// assignmentRouter.post("/addSubject", subjectController.addSubject);
assignmentRouter.post("/deleteAssignment", assignmentController.deleteAssignment);
assignmentRouter.get("/getAssignmentList", assignmentController.getAssignmentList);

module.exports = assignmentRouter;