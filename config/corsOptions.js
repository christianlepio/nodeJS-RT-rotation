// 3rd party middleware
const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
            //origin parameter here coming from who ever requested it like google.com
    origin: (origin, callback) => {
        //if the domain is in the whitelist
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            //null here means there's no error, true means that the origin will sent back and that is allowed
            callback(null, true)
        } else{
            callback(new Error('Not allowed by CORS'))
        }
    }, 
    optionsSuccessStatus: 200
}

module.exports = corsOptions