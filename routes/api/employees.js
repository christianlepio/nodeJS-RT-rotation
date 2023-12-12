const express = require('express')
const router = express.Router()
const employeesController = require('../../controllers/employeesController')
const ROLES_LIST = require('../../config/roles_list') //get list of roles
//verify roles of a user who can perform add, edit, delete employee
const verifyRoles = require('../../middleware/verifyRoles') 

router.route('/')
    //everyone can get or request all list of employees
    .get(employeesController.getAllEmployees)
    //user that has admin or editor roles is authorized to add or edit employee
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee)
    //only the user that has admin role can delete employee
    .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee)

router.route('/:id')
    .get(employeesController.getEmployee)

module.exports = router