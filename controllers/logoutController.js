const User = require('../model/User') //import user Schema

const handleLogout = async (req, res) => {
    // on client-side or front-end, also delete the accessToken

    const cookies = req.cookies
    //check if there is a cookie and get the jwt property
    if (!cookies?.jwt) {
        return res.sendStatus(204) //success but no content
    } else {
        const refreshToken = cookies.jwt //get value for refreshToken
        //is refreshToken in DB?
        const foundUser = await User.findOne({ refreshToken }).exec()
        if (!foundUser) {
            //clear or erase cookie (refreshToken)
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
            return res.sendStatus(204) //success but no content
        } else {
            //Delete refresh token in the DB
            foundUser.refreshToken = '' //update refresh token to none
            const result = await foundUser.save() //save updated user to mongoDB
            console.log('Logout RES: ', result)

            //clear cookie
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
            res.sendStatus(204) //success but no content
        }
    }
}

module.exports = { handleLogout }