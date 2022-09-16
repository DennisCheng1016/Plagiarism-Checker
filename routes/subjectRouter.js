const subjectRouter = require('express').Router();
const subjectController = require('../controllers/subjectController');

subjectRouter.post("/createSubject", subjectController.createSubject);
subjectRouter.post("/addSubject", subjectController.addSubject);
subjectRouter.post("/deleteSubject", subjectController.deleteSubject);
subjectRouter.get("/getSubjectList", subjectController.getSubjectList);

module.exports = subjectRouter;