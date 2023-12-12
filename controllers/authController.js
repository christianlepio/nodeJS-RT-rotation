const User = require('../model/User') //import user Schema
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
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
                
                const refreshToken = jwt.sign(
                    { "username": foundUser.username },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '1d' } //refresh token should last much longer than accessToken
                )
                
                //saving refreshToken with current user to users DB
                foundUser.refreshToken = refreshToken //add refreshToken to property of current user
                const result = await foundUser.save() //save updated user to mongoDB
                console.log('login RES: ', result)
                
                //send refresh token to response cookie with http only to not available to JS for much security 
                                                                                    //this is also working in httpOnly
                                                                                    //this is required when working with chrome
                res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
                res.json({ roles, accessToken }) //send roles access token to the client/user
                console.log('roles: ', roles)
            } else {
                res.sendStatus(401) //401 status code is unauthorized
            }
        }
    }
}

module.exports = { handleLogin }