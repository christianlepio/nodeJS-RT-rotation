const User = require('../model/User') //import user schema

const getAllUsers = async (req, res) => {
    const users = await User.find()
    if (!users) {
        return res.status(204).json({ 'message': 'No Users Found!' })
    } else {
        res.json(users)
    }
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'User ID is required!' })
    } else {
        const user = await User.findOne({ _id: req.body.id }).exec()
        if (!user) {
            return res.status(204).json({ 'message': `User ID ${req.body.id} not found!` })
        } else {
            const result = await User.deleteOne({ _id: req.body.id })
            res.json(result)
        }
    }
}

const getUser = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ 'message': 'User ID is required!' })
    } else {
        const user = await User.findOne({ _id: req.params.id }).exec()
        if (!user) {
            return res.status(204).json({ 'message': `User ID ${req.params.id} not found!` })
        } else {
            res.json(user)
        }
    }
}

module.exports = {
    getAllUsers,
    deleteUser,
    getUser
}