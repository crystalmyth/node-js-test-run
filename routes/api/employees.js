const express = require('express');
const router = express.Router();
const path = require('path');
const employeesController = require(path.join(__dirname, "..", "..", "controllers", "employeesController.js"));
const ROLES_LIST = require(path.join(__dirname, "..", "..", "config", "ROLE_LIST"));
const verifyRoles = require(path.join(__dirname,"..","..","middleware","verifyRoles"));

router.route('/')
    .get(employeesController.getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;