const mongoose = require('mongoose')

const connectDB = async () => {
    try {
                                //URI                    
        await mongoose.connect(process.env.DATABASE_URI, {
            //options
            //prevent warnings that we would get from mongoDB
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
    } catch (err) {
        console.error('error: ',err)
    }
}

module.exports = connectDB