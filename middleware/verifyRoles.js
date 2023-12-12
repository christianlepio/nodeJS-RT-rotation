//middleware
                    //this will accepts many parameter using rest operator '...'
const verifyRoles = (...allowedRoles) => {
    //this is a middleware functions
    return (req, res, next) => {
        //if we don't have a request
        if(!req?.roles) {
            return res.sendStatus(401) //unauthorized
        } else {
            //define the roles 
            const rolesArray = [...allowedRoles]
            console.log('allowed roles: ', rolesArray) //allowed roles
            console.log('request roles: ', req.roles) //this is set in verifyJWT.js

            //compare roles of current logged in user to allowed roles that is authorized
            //this will return true or false
                                                                           //find the first true value from comparison
            const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true)

            if (!result) {
                return res.sendStatus(401) //unauthorized
            } else {
                next()
            }
        }
    }
}

module.exports = verifyRoles