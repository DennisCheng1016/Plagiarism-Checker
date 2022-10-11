const AdminRouter = require('express').Router();
const AdminController = require('../controllers/adminController')

AdminRouter.get('/getAllUser', AdminController.getAllUser);
AdminRouter.get('/getAllPermission', AdminController.getAllPermission);
AdminRouter.post('/updateUserAccount', AdminController.updateUser);
AdminRouter.post('/permitTeacherRegistration', AdminController.permitTeacherRegistration);

module.exports = AdminRouter;
