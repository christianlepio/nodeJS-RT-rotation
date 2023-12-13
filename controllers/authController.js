const User = require('../model/User') //import user Schema
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
    //get existing cookies...
    const cookies = req.cookies
    console.log(`cookie available at login: ${JSON.stringify(cookies)}`)

    const { user, pwd } = req.body
    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and Password are required!' })
    } else {
        //find user if does exist
        const foundUser = await User.findOne({ username: user }).exec()
        if (!foundUser) {
            return res.sendStatus(401) //401 status code is unauthorized
        } else {
            //evaluate password using bcrypt compare
            const matched = await bcrypt.compare(pwd, foundUser.password)
            if (matched) {
                //get all values for roles
                //filter(Boolean) to eliminate all of those nulls  
                const roles = Object.values(foundUser.roles).filter(Boolean)

                //create JWTs from from this spot
                const accessToken = jwt.sign(
                    //payload
                    { 
                        "UserInfo": { 
                            "username": foundUser.username,
                            "roles": roles
                        }
                    }, //pass username and roles here, don't pass the value of password
                    process.env.ACCESS_TOKEN_SECRET, //evironment variable
                    { expiresIn: '10s' } //limit of time of access
                )
                //generate new refresh token
                const newRefreshToken = jwt.sign(
                    { "username": foundUser.username },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '1d' } //refresh token should last much longer than accessToken
                )

                let newRefreshTokenArray = 
                    //if there is no jwt in cookies then...
                    !cookies?.jwt 
                        //return all refresh tokens for that user...
                        ? foundUser.refreshToken
                        //remove and return all refresh tokens of foundUser that is not equal to old refresh token (cookies.jwt)
                        : foundUser.refreshToken.filter(rt => rt !== cookies.jwt)
                
                //if old refresh token exists
                if (cookies?.jwt) {
                    /*
                        Scenario added here
                        1, User logs in but never uses RT and does not logout
                        2, RT is stolen
                        3, if 1 & 2, reuse detection is needed to clear all RTs when user logs in
                     */
                    const refreshToken = cookies.jwt
                    const foundToken = await User.findOne({ refreshToken }).exec()

                    if (!foundToken) {
                        console.log('attempted refresh token reuse to login!')
                        newRefreshTokenArray = []
                    }

                    //clear or erase cookie (refreshToken)
                    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
                }
                
                //saving refreshToken with current user to users DB
                foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken] //add newRefreshToken to property (refreshToken array) of current user
                const result = await foundUser.save() //save updated user to mongoDB
                console.log('login RES: ', result)
                
                //send refresh token to response cookie with http only to not available to JS for much security 
                                                                                    //this is also working in httpOnly
                                                                                    //this is required when working with chrome
                res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
                res.json({ roles, accessToken }) //send roles access token to the client/user
                console.log('roles: ', roles)
            } else {
                res.sendStatus(401) //401 status code is unauthorized
            }
        }
    }
}

module.exports = { handleLogin }