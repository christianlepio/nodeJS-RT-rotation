//this credentials middleware is required property when using fetch api in client-side or front-end

const allowedOrigins = require('../config/allowedOrigins')

const credentials = (req, res, next) => {
    const origin = req.headers.origin //this is url used or sent by client-side
    // if that origin does exist in the list of allowedOrigins
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true) //set this header as a response because this is required to be true
    }
    next()
}

module.exports = credentials