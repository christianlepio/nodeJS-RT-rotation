const { format } = require('date-fns')
const { v4: uuid } = require('uuid')

const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message, fileName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`
    console.log(logItem)//testing

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs')))
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        else
            await fsPromises.appendFile(path.join(__dirname, '..', 'logs', fileName), logItem)
    } catch (error) {
        console.error(error)
    }
}

//custom middleware
const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'request_log.txt')
    console.log(`${req.method}\t${req.path}`)
    next()
}

module.exports = { logEvents, logger}