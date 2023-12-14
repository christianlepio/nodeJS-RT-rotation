const User = require('../model/User') //import user Schema
const jwt = require('jsonwebtoken')

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies
    //check if there is a cookie and get the jwt property
    if (!cookies?.jwt) {
        console.log('walang cookies.jwt: ', cookies.jwt)
        return res.sendStatus(401) //unauthorize status code
    } else {
        console.log('merong cookies.jwt: ', cookies.jwt)

        const refreshToken = cookies.jwt //get value for refreshToken
        // console.log('res.cookie: ', res)
        //clear or erase cookie (refreshToken) after getting the value of it
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
        
        console.log('cleared res.cookie: ', req.cookies?.jwt)

        //find user if does exist with refreshToken similar to cookie refresh token
                                            //if the property and variable is same put only the variable name
        const foundUser = await User.findOne({ refreshToken }).exec()

        //if there is no user but we did received refreshToken from the cookie
        //Detected refresh token reuse!
        if (!foundUser) {
            console.log('no found user: ')
            //evaluate jwt, check if refreshToken (from cookie) is not yet expired
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                async (err, decoded) => {
                    if (err) {
                        //if refresh token from cookie expires
                        console.log('expired na...')
                        return res.sendStatus(403) //403 status code is Forbidden
                    } else {

                        console.log('attempted refresh token reuse!')
                        //if refresh token is not expired 
                        const hackedUser = await User.findOne({ username: decoded.username }).exec()
                        //get all refresh token from foundUser that is not equal to the old refresh token from the cookie
                        const newRefreshTokenArray = hackedUser.refreshToken.filter(rt => rt !== refreshToken)
                        //remove or erase refresh token from mongo DB with the decoded username
                        hackedUser.refreshToken = []
                        const result = await hackedUser.save()
                        console.log('no user found: ', result)

                        return res.sendStatus(403) //403 status code is Forbidden
                    }
                }
            )
        } else {
            //if there is found user...
            //get all refresh token from foundUser that is not equal to the old refresh token from the cookie
            const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken)

            //evaluate jwt, check if refreshToken is not yet expired
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                async (err, decoded) => {
                    //if foundUser's refresh token expires then remove that refresh token from the database
                    if (err) {
                        console.log('expired refresh token: ')
                        //set new refresh tokens that is not equal to the expired refresh token from the cookie
                        foundUser.refreshToken = [...newRefreshTokenArray]
                        const result = await foundUser.save()
                        console.log(result)
                    } 
                    
                    if (err || foundUser.username !== decoded.username) {
                        return res.sendStatus(403) //403 status code is Forbidden
                    } else {
                        //if refreshToken is not yet expired then create new accessToken
                        //get all values for roles
                        const roles = Object.values(foundUser.roles)
                        //generate new access token
                        const accessToken = jwt.sign(
                            //payload
                            { 
                                "UserInfo": {
                                    "username": decoded.username, 
                                    "roles": roles
                                } 
                            },
                            process.env.ACCESS_TOKEN_SECRET, 
                            { expiresIn: '10s' }
                        )
                        
                        //generate new refresh token everytime you generate an accessToken
                        const newRefreshToken = jwt.sign(
                            { "username": foundUser.username },
                            process.env.REFRESH_TOKEN_SECRET,
                            { expiresIn: '1d' } //refresh token should last much longer than accessToken
                        )
                        
                        //saving refreshToken with current user to users DB
                        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken] //add newRefreshToken to property (refreshToken array) of current user
                        const result = await foundUser.save() //save updated user to mongoDB
                        
                        //send refresh token to response cookie with http only to not available to JS for much security 
                                                                                    //this is also working in httpOnly
                                                                                    //this is required when working with chrome
                        res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
                        
                        console.log('1 new refresh token: ', result)
                        res.json({ accessToken }) //send accessToken as response
                    }
                }
            )
        }
    }
}

module.exports = { handleRefreshToken }