const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    //get access token
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.sendStatus(401) //unauthorized status code
    } else {
        console.log('authHeader: ', authHeader)
        const token = authHeader.split(' ')[1] //remove bearer word from auth header
        //verify if accessToken is not yet expired
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
                if (err) {
                    return res.sendStatus(403) //this is forbidden status code: meaning invalid token
                } else {
                    req.user = decoded.UserInfo.username //pass decoded username to request user
                    req.roles = decoded.UserInfo.roles //pass decoded roles to request roles
                    next()
                }
            }
        )
    }
}

module.exports = verifyJWT //call this function or middleware to the routes you want to protect