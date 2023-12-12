const mongoose = require('mongoose')
//Everything in Mongoose starts with a Schema
//Each schema maps to a MongoDB collection and
//defines the shape of the documents within that collection
const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        roles: {
            User: {
                type: Number,
                default: 2001 //default value for User role
            }, //this is required role, all employee must have user role
            Editor: Number, //not required
            Admin: Number //not required
        },
        password: {
            type: String,
            required: true
        },
        refreshToken: String //not required
    }
)
                                //User is singular and will find its equivalent plural in the collections in mongoDB
module.exports = mongoose.model('User', userSchema)