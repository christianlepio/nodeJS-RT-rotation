const express = require('express')
const router = express.Router()
const refreshTokenController = require('../controllers/refreshTokenController')

router.get('/', refreshTokenController.handleRefreshToken) //get method to get accessToken response

module.exports = router