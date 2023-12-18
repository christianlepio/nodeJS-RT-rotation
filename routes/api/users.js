const express = require('express')
const router = express.Router()
const usersController = require('../../controllers/usersController')
const ROLES_LIST = require('../../config/roles_list')
//verify roles of a user who can perform fetch (all) user/s and delete a user
const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
    //only user admin can view all and delete user
    .get(usersController.getAllUsers)
    // .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
    .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser)

router.route('/:id')
    //only admin can view 1 user
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getUser)

module.exports = router