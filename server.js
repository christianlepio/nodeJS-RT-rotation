require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')

//define the port
const PORT = process.env.PORT || 3500

//Connect to MongoDB
connectDB()

// custom middleware logger
// next call is need for custom middleware
app.use(logger)

//Handle options credentials check - before CORS !
//and fetch cookies credentials requirement
app.use(credentials)

// 3rd party middleware
// Cross Origin Resource Sharing (CORS)
app.use(cors(corsOptions))

// built-in middleware to handle urlencoded data
// in other words, form data: 
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }))

// built-in middleware for json
app.use(express.json())

// Middleware for cookies
app.use(cookieParser())

// serve static files such as css, images, etc.
app.use('/', express.static(path.join(__dirname, '/public')))

//routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))

app.use(verifyJWT)
//verify jwt token first before accessing employees or users routes/api
app.use('/employees', require('./routes/api/employees'))
app.use('/users', require('./routes/api/users'))

//404 page not found!
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ error: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

//custom error handler
app.use(errorHandler)

//listen for the connected event of mongoose
//listen for this event once
//listen for the event open, meaning if app success to connect to mongoDB
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')

    //listen to the app once mongoDB connection success
    //web creates a server that listens on port you define on your computer
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
