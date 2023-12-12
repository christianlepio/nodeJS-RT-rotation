const express = require('express')
const router = express.Router()
const path = require('path')

//get method route
//regex used: 
// ^ begin with, 
// $ ends with,
// | or,
router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

module.exports = router