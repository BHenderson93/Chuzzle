require('dotenv').config()
const mongoose = require('mongoose')
//Connect to database
const DATABASE_URL = process.env.DATABASE_URL
//only nessesary with deprecation warning
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const db = mongoose.connection
mongoose.connect(DATABASE_URL, CONFIG)
db.on('open', () => { console.log('Connected to DB') })
    .on('close', () => { console.log('Closing DB') })
    .on('error', (error) => { console.log('There was an error: ', error) })

module.exports = mongoose