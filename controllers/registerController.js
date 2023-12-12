const User = require('../model/User') //import user Schema
const bcrypt = require('bcrypt')

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body
    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and Password are required!' })
    } else {
        //check for duplicated username in the user DB
        const duplicated = await User.findOne({ username: user}).exec()
        if (duplicated) {
            return res.sendStatus(409) //409 is a conflict http status code
        } else {
            try {
                //encrypt the password using bcrypt
                const hashedPwd = await bcrypt.hash(pwd, 10) //10 is a default salt rounds for password hashing
                //create and store the new user
                const result = await User.create(
                    { 
                        "username": user, 
                        "password": hashedPwd 
                    }
                )

                console.log('result: ', result)

                res.status(201).json({ 'success': `New user ${user} created!` }) //201 status code means new user was created
            } catch (err) {
                res.status(500).json({ 'message': err.message }) //500 status code is a server error
            }
        }
    }
}

module.exports = { handleNewUser }