const mongoose = require('mongoose')

const connect = async () => {
    try {
        await mongoose.connect('mongodb+srv://BMT:tR4Cc6n9vCrOuWkh@cluster0.nxj4g9f.mongodb.net/?retryWrites=true&w=majority')
        console.log('database connected')
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

module.exports = connect;


