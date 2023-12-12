const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.post('/', authController.handleLogin) //post method to submit username and pass to validate

module.exports = router